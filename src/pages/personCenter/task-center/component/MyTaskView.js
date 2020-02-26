import React, { Component } from 'react';
import { Badge, Button, Card, Icon, Input, Progress } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
import StandardTable from './StandardTable';
import { connect } from 'dva';
import ItemData from '../map';
import Link from 'umi/link';


const { taskStatusMap, taskStatusName, labelTypeName } = ItemData;

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
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'detail/fetchMyTask',
      payload: { status: location.state.status },
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

  render() {
    const { data, loading } = this.props;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const action = (
      <Link to="/person/task-center">
        <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
      </Link>
    );

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
        ...this.getColumnSearchProps('taskName'),
      },
      {
        title: '所属项目',
        dataIndex: 'projectName',
        ...this.getColumnSearchProps('projectName'),
      },
      {
        title: '标注类型',
        dataIndex: 'labelType',
        render: val => labelTypeName[val],
        filters: labelTypeFilters,
        filteredValue: filteredInfo.labelType || null,
      },
      {
        title: '提数',
        dataIndex: 'qustionNum',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        filters: statusFilters,
        render: val => <Badge status={taskStatusMap[val]} text={taskStatusName[val]}/>,
      },
      {
        title: '任务进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '领取时间',
        dataIndex: 'receiveTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, task) => (
          <a>标注</a>
        ),
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
