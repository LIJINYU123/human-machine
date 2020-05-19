import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Button,
  Descriptions,
  Statistic,
  Input, Icon, Table, Radio,
} from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';
import TaskList from './TaskList';
import BasicView from './BasicView';
import Highlighter from 'react-highlight-words';
import ProjectEditView from './ProjectEditView';

const { statusName } = ItemData;

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
    modalVisible: false,
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

  handleCancelModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'textProjectFormData/resetStepData',
    });
    this.setState({
      modalVisible: false,
    });
  };

  handleEdit = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleGoBack = () => {
    router.goBack();
  };

  handleCompleteProject = () => {
    const { dispatch } = this.props;
    const { projectId } = this.state;
    dispatch({
      type: 'project/updateProjectStatus',
      payload: { projectId, status: 'complete' },
    });
  };

  exportResult = () => {
    const { dispatch } = this.props;
    const { projectId } = this.state;
    dispatch({
      type: 'project/exportResult',
      payload: { projectId },
      callback: blob => {
        const link = document.createElement('a');
        link.download = `labelResult_${projectId}.xlsx`;
        link.style.display = 'none';
        link.href = URL.createObjectURL(blob);
        document.body.appendChild(link);
        link.click();
        // 释放的 URL 对象以及移除 a 标签
        URL.revokeObjectURL(link.href);
        document.body.removeChild(link);
      },
    });
  };

  render() {
    const { memberDetail: { members }, basicInfo, loading } = this.props;
    const { projectId, activeTabKey, labelerId, inspectorId, modalVisible } = this.state;
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
        <Statistic title="标注进度" value={basicInfo.labelSchedule} suffix="%" />
        <Statistic title="质检进度" value={basicInfo.reviewSchedule} suffix="%" />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="负责人">{basicInfo.owner ? basicInfo.owner.userName : ''}</Descriptions.Item>
        <Descriptions.Item label="项目周期" span={2}>{basicInfo.startTime === '' && basicInfo.endTime === '' ? '永久' : `${basicInfo.startTime} - ${basicInfo.endTime}`}</Descriptions.Item>
        <Descriptions.Item label="项目类型">{basicInfo.projectType}</Descriptions.Item>
        <Descriptions.Item label="合格率">{basicInfo.passRate}%</Descriptions.Item>
        <Descriptions.Item label="质检率">{basicInfo.checkRate}%</Descriptions.Item>
      </Descriptions>
    );

    const action = (
      <Fragment>
        <Button.Group>
          <Button icon="check" onClick={this.handleCompleteProject}>项目完成</Button>
          <Button icon="download" onClick={this.exportResult}>导出结果</Button>
        </Button.Group>
        <Button onClick={this.handleEdit}>编辑</Button>
        <Button type="primary" onClick={this.handleGoBack}>返回</Button>
      </Fragment>
    );

    const tabList = [
      {
        key: 'member',
        tab: '项目进度',
      },
      {
        key: 'project',
        tab: '项目信息',
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
            <h4 style={{ marginBottom: '16px' }}>{`标注情况： ${basicInfo.completeLabelNum}/${basicInfo.allLabelNum}， 剩余：${basicInfo.allLabelNum - basicInfo.completeLabelNum}`}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{`质检情况： ${basicInfo.reviewNum}/${parseInt(basicInfo.allLabelNum * basicInfo.checkRate * 0.01, 0)}，剩余：${parseInt(basicInfo.allLabelNum * basicInfo.checkRate * 0.01, 0) - basicInfo.reviewNum}`}</h4>
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
          activeTabKey === 'project' &&
          <BasicView />
        }
        {
          activeTabKey === 'task' &&
          <TaskList projectId={projectId} labelerId={labelerId} inspectorId={inspectorId} />
        }
        <ProjectEditView visible={modalVisible} onCancel={this.handleCancelModal} projectId={projectId} />
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetail;
