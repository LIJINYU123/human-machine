import React, { Component } from 'react';
import { Badge, Button, Card, Icon, Input, Progress } from 'antd/lib/index';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
import { connect } from 'dva/index';
import router from 'umi/router';
import StandardTable from './StandardTable';
import ItemData from '../map';

const { taskStatusMap, taskStatusName, labelTypeName, Labeler, Inspector, Labeling, Reject, Review } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const statusFilters = Object.keys(taskStatusName).map(key => ({
  text: taskStatusName[key],
  value: key,
}));

const labelTypeFilters = Object.keys(labelTypeName).map(key => ({
  text: labelTypeName[key],
  value: key,
}));

@connect(({ detail, loading }) => ({
  data: detail.myTask,
  loading: loading.effects['detail/fetchMyTask'],
}))
class MyTaskView extends Component {
  state = {
    filteredInfo: {},
    searchText: '',
    searchedColumn: '',
    roleId: '',
  };

  componentWillMount() {
    const roleId = localStorage.getItem('RoleID');
    this.setState({
      roleId,
    });
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'detail/fetchMyTask',
      payload: { status: location.state.status, sorter: 'receiveTime_descend' },
    });
    this.setState({
      filteredInfo: { status: location.state.status.split(',') },
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
      newObj[key] = getValue(filterArg[key]);
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
      type: 'detail/fetchMyTask',
      payload: params,
    });
  };

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

  handleJumpToMarkView = task => {
    switch (task.labelType) {
      case 'textClassify':
        router.push({
          pathname: '/task-manage/my-task/text-mark',
          state: {
            taskInfo: task,
          },
        });
        break;

      case 'sequenceLabeling':
        router.push({
          pathname: '/task-manage/my-task/sequence-mark',
          state: {
            taskInfo: task,
          },
        });
        break;

      case 'textExtension':
        router.push({
          pathname: '/task-manage/my-task/extension-mark',
          state: {
            taskInfo: task,
          },
        });
        break;

      case 'pictureMark':
        router.push({
          pathname: '/task-manage/my-task/image-mark',
          state: {
            taskInfo: task,
          },
        });
        break;

      case 'videoDialogMark':
        router.push({
          pathname: '/task-manage/my-task/video-mark',
          state: {
            taskInfo: task,
          },
        });
        break;

      default:
        break;
    }
  };

  handleGoback = () => {
    router.goBack();
  };

  showOperateName = (roleId, status) => {
    if (roleId === Labeler && [Labeling, Reject].includes(status)) {
      return '标注';
    }

    if (roleId === Inspector && status === Review) {
      return '质检';
    }

    return '查看'
  };

  render() {
    const { data, loading } = this.props;
    const { roleId } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const action = (
      <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleGoback}>返回</Button>
    );

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
        ...this.getColumnSearchProps('taskName', '任务名称'),
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
        ...this.getColumnSearchProps('projectName', '所属项目'),
      },
      {
        title: '标注工具',
        dataIndex: 'labelType',
        render: val => labelTypeName[val],
        filters: labelTypeFilters,
        filteredValue: filteredInfo.labelType || null,
      },
      {
        title: '题数',
        dataIndex: 'questionNum',
      },
      {
        title: roleId === 'labeler' ? '标注进度' : '质检进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        filters: statusFilters,
        filteredValue: filteredInfo.status || null,
        render: val => <Badge status={taskStatusMap[val]} text={taskStatusName[val]}/>,
      },
      {
        title: '领取时间',
        dataIndex: 'receiveTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, task) => <a onClick={() => this.handleJumpToMarkView(task)}>{this.showOperateName(roleId, task.status)}</a>,
      },
    ];
    return (
      <PageHeaderWrapper
        extra={action}
      >
        <Card title="任务列表" bordered={false}>
          <StandardTable
            rowKey="taskId"
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default MyTaskView;
