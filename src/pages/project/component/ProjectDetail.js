import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Button,
  Descriptions,
  Statistic,
  Badge,
  Divider,
  Popconfirm, Progress, Tooltip, Modal, Input, Icon, Table,
} from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';
import TaskList from './TaskList';
import Highlighter from 'react-highlight-words';

const { statusName, labelTypeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

@connect(({ memberDetail, projectDetail, loading }) => ({
  memberDetail,
  basicInfo: projectDetail.basicInfo,
  loading: loading.effects['memberDetail/fetchMemberData'],
}))
class ProjectDetail extends Component {
  state = {
    projectId: undefined,
    filteredInfo: {},
    labelerId: '',
    inspectorId: '',
    activeTabKey: 'member',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'projectDetail/fetchDetail',
      payload: location.state.projectId,
    });

    dispatch({
      type: 'memberDetail/fetchMemberData',
      payload: { projectId: location.state.projectId },
    });

    this.setState({
      projectId: location.state.projectId,
    });
  }

  handleTableChange = (pagination, filterArg, _) => {
    const { dispatch, projectId } = this.props;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      projectId,
      ...filters,
    };

    dispatch({
      type: 'memberDetail/fetchMemberData',
      payload: params,
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input ref={node => { this.searchInput = node; }}
               placeholder={`搜索 ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
               onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
               style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (this.state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ) : text),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({
      searchText: '',
    });
  };

  handleTabChange = key => {
    this.setState({
      activeTabKey: key,
      labelerId: '',
      inspectorId: '',
    });
  };

  jumpToTaskList = record => {
    this.setState({
      activeTabKey: 'task',
    });

    if (record.roleId === 'labeler') {
      this.setState({
        labelerId: record.userId,
      });
    } else {
      this.setState({
        inspectorId: record.userId,
      });
    }
  };

  render() {
    const { memberDetail: { members }, basicInfo, loading } = this.props;
    const { projectId, activeTabKey, labelerId, inspectorId } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const roleFilters = members.reduce((obj, member) => {
      const newObj = [...obj];
      const roleNames = newObj.map(item => item.text);
      if (!roleNames.includes(member.roleName)) {
        newObj.push({ value: member.roleId, text: member.roleName })
      }
      return newObj;
    }, []);

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value={statusName[basicInfo.status]} />
        <Statistic title="标注进度" value={basicInfo.schedule} suffix="%" />
        <Statistic title="项目进度" value={basicInfo.schedule} suffix="%" />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="工具类型">{labelTypeName[basicInfo.labelType]}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{basicInfo.createdTime}</Descriptions.Item>
        <Descriptions.Item label="项目周期">{basicInfo.endTime}</Descriptions.Item>
        <Descriptions.Item label="标注员">{basicInfo.labelers ? basicInfo.labelers[0].name : ''}{basicInfo.labelers ? <Tooltip title={basicInfo.labelers.map(labeler => labeler.name).join('，')}>...</Tooltip> : ''}</Descriptions.Item>
        <Descriptions.Item label="质检员">{basicInfo.inspectors ? basicInfo.inspectors[0].name : ''}{basicInfo.inspectors ? <Tooltip title={basicInfo.inspectors.map(inspector => inspector.name).join('，')}>...</Tooltip> : ''}</Descriptions.Item>
        <Descriptions.Item label="合格率">{basicInfo.passRate}%</Descriptions.Item>
        <Descriptions.Item label="质检率">{basicInfo.checkRate}%</Descriptions.Item>
        <Descriptions.Item label="项目描述">{basicInfo.description}</Descriptions.Item>
      </Descriptions>
    );

    const action = (
      <Link to="/project">
        <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
      </Link>
    );

    const tabList = [
      {
        key: 'project',
        tab: '项目信息',
      },
      {
        key: 'member',
        tab: '项目进度',
      },
      {
        key: 'task',
        tab: '任务列表',
      },
    ];

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        ...this.getColumnSearchProps('userName'),
      },
      {
        title: '角色名称',
        dataIndex: 'roleId',
        render: (_, record) => record.roleName,
        filters: roleFilters,
        filteredValue: filteredInfo.roleId || null,
      },
      {
        title: '领取任务数',
        dataIndex: 'receiveNum',
      },
      {
        title: '标注任务详情',
        render: (_, record) => <a onClick={() => this.jumpToTaskList(record)}>任务列表</a>,
      },
    ];

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={activeTabKey}
        onTabChange={this.handleTabChange}
        title={basicInfo.projectName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        {
          activeTabKey === 'member' &&
          <Card bordered={false}>
            <Table
              rowKey="userId"
              columns={columns}
              dataSource={members}
              onChange={this.handleTableChange}
              pagination={{ showSizeChanger: true, showQuickJumper: true }}
              loading={loading}
            />
          </Card>
        }
        {
          activeTabKey === 'task' &&
          <TaskList projectId={projectId} labelerId={labelerId} inspectorId={inspectorId} />
        }
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetail;
