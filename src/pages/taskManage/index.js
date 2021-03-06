import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Card, Row, Col, Radio, Input, Button, Icon, Badge, message } from 'antd/lib/index';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './component/StandardTable';
import styles from './style.less';
import ItemData from './map';
import Highlighter from 'react-highlight-words';
import router from 'umi/router';

const { statusMap, statusName, projectTypeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const statusFilters = Object.keys(statusName).map(key => ({
  text: statusName[key],
  value: key,
}));

const projectTypeFilters = Object.keys(projectTypeName).map(key => ({
  text: projectTypeName[key],
  value: projectTypeName[key],
}));

@connect(({ taskCenter, detail, loading }) => ({
  data: taskCenter.data,
  inProgressNum: detail.inProgressNum,
  completeNum: detail.completeNum,
  loading: loading.effects['taskCenter/fetchProject'],
}))
class TaskCenter extends Component {
  state = {
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
    roleId: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const roleId = localStorage.getItem('RoleID');
    const params = {
      sorter: 'createdTime_descend',
    };
    dispatch({
      type: 'taskCenter/fetchProject',
      payload: params,
    });
    dispatch({
      type: 'detail/fetchTaskNumber',
    });
    this.setState({
      roleId,
    });
  }

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      if (getValue(filterArg[key])) {
        newObj[key] = getValue(filterArg[key]);
      }

      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'taskCenter/fetchProject',
      payload: params,
    });
  };

  getColumnSearchProps = (dataIndex, title) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input ref={node => { this.searchInput = node; }}
               placeholder={`搜索 ${title}`}
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

  handleReviewDetails = project => {
    if (project.status === 'suspend') {
      message.warn('该项目暂停中，无法进入');
    } else {
      router.push({
        pathname: '/task-manage/project-detail',
        state: {
          projectId: project.projectId,
          roleId: this.state.roleId,
        },
      });
    }
  };

  handleJumptoInProgress = () => {
    const { roleId } = this.state;
    router.push({
      pathname: '/task-manage/my-task',
      state: {
        status: roleId === 'labeler' ? 'labeling,reject' : 'review',
      },
    });
  };

  handleRadioChange = event => {
    const { dispatch } = this.props;
    const params = {
      sorter: 'createdTime_descend',
    };
    if (event.target.value !== '全部') {
      params.projectType = event.target.value;
    }

    dispatch({
      type: 'taskCenter/fetchProject',
      payload: params,
    });
  };

  render() {
    const { data, inProgressNum, loading } = this.props;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectName',
        ...this.getColumnSearchProps('projectName', '项目名称'),
      },
      {
        title: '项目类型',
        dataIndex: 'projectType',
        filters: projectTypeFilters,
        filteredValue: filteredInfo.projectType || null,
      },
      {
        title: '项目状态',
        dataIndex: 'status',
        filters: statusFilters,
        render: val => <Badge status={statusMap[val]} text={statusName[val]}/>,
      },
      {
        title: '可领任务数',
        dataIndex: 'availableNum',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, project) => (
          <a onClick={() => this.handleReviewDetails(project)}>进入</a>
        ),
      },
    ];

    const Info = ({ title, value, onClick, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p><a onClick={onClick}>{value}</a></p>
        {bordered && <em />}
      </div>
    );

    const extraContent = (
      <div>
        <Radio.Group defaultValue="全部" onChange={this.handleRadioChange}>
          <Radio.Button value="全部">全部</Radio.Button>
          <Radio.Button value="文本">文本</Radio.Button>
          <Radio.Button value="图片">图片</Radio.Button>
          <Radio.Button value="音频">音频</Radio.Button>
          <Radio.Button value="视频">视频</Radio.Button>
        </Radio.Group>
      </div>
    );

    return (
      <PageHeaderWrapper>
        <div className={styles.standardList}>
          <Card bordered={false}>
            <Row>
              <Col sm={24} xs={24}>
                <Info title="我的待办" value={`${inProgressNum}个任务`} onClick={this.handleJumptoInProgress} bordered={false} />
              </Col>
            </Row>
          </Card>
          <Card title="项目列表" className={styles.card} extra={extraContent} bordered={false}>
            <StandardTable
              rowKey="projectId"
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </Card>
        </div>

      </PageHeaderWrapper>
    );
  }
}

export default TaskCenter;
