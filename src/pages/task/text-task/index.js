import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Divider,
  Card,
  Progress,
  Badge,
  Input,
  Icon,
  Popconfirm,
} from 'antd';
import Highlighter from 'react-highlight-words';
import styles from './style.less';
import StandardTable from './component/StandardTable';
import TaskCreateView from './component/TaskCreateView';
import ItemData from './map';

const { RangePicker } = DatePicker;

const { statusMap, statusName, taskTypeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const statusFilters = Object.keys(statusName).map(key => ({
  text: statusName[key],
  value: key,
}));

const taskTypeFilters = Object.keys(taskTypeName).map(key => ({
  text: taskTypeName[key],
  value: key,
}));

@connect(({ textTask, loading }) => ({
  data: textTask.data,
  labelers: textTask.labelers,
  loading: loading.effects['textTask/fetchTask'],
}))
class TextTaskList extends Component {
  state = {
    selectedRows: [],
    formValues: {},
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
    addModalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      sorter: 'updatedTime_descend',
    };
    dispatch({
      type: 'textTask/fetchTask',
      payload: params,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

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
      type: 'textTask/fetchTask',
      payload: params,
    });
  };

  handleAdd = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  handleCancelAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handleReviewDetails = task => {
    router.push({
      pathname: '/task/text-detail',
      state: {
        taskId: task.taskId,
      },
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

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      filteredInfo: null,
      formValues: {},
    });

    dispatch({
      type: 'textTask/fetchTask',
    });
  };

  handleDelete = task => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textTask/deleteTask',
      payload: {
        taskIds: [task.taskId],
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'textTask/deleteTask',
      payload: {
        taskIds: selectedRows.map(row => row.taskId),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleFormSearch = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldValues) => {
      if (err) return;
      const values = {
        createdStartTime: fieldValues.createdTime && fieldValues.createdTime[0].format('YYYY-MM-DD HH:mm:ss'),
        createdEndTime: fieldValues.createdTime && fieldValues.createdTime[1].format('YYYY-MM-DD HH:mm:ss'),
        deadlineStartTime: fieldValues.deadline && fieldValues.deadline[0].format('YYYY-MM-DD HH:mm:ss'),
        deadlineEndTime: fieldValues.deadline && fieldValues.deadline[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'textTask/fetchTask',
        payload: values,
      });
    });
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleFormSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={8} sm={24}>
            <Form.Item label="创建时间">
              {
                getFieldDecorator('createdTime')(
                  <RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['开始时间', '结束时间']}/>)
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="截止时间">
              {
                getFieldDecorator('deadline')(
                  <RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['开始时间', '结束时间']} />)
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { data, labelers, loading } = this.props;
    const { selectedRows, addModalVisible } = this.state;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const labelerFilters = labelers.map(labeler => ({
      text: labeler.labelerName,
      value: labeler.labelerName,
    }));

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
        ...this.getColumnSearchProps('taskName'),
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
        render: val => taskTypeName[val],
        filters: taskTypeFilters,
        filteredValue: filteredInfo.taskType || null,
      },
      {
        title: '标注员',
        dataIndex: 'labelerName',
        filters: labelerFilters,
        filteredValue: filteredInfo.labelerName || null,
      },
      {
        title: '标注进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        filters: statusFilters,
        filteredValue: filteredInfo.status || null,
        render: val => <Badge status={statusMap[val]} text={statusName[val]}/>,
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        sorter: true,
      },
      {
        title: '操作',
        render: (_, task) => (
          <Fragment>
            <a onClick={() => this.handleReviewDetails(task)}>详情</a>
            <Divider type="vertical"/>
            <Popconfirm title="确认删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(task)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleAdd}>新增</Button>
            <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleBatchDelete}>删除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <TaskCreateView visible={addModalVisible} onCancel={this.handleCancelAddModal}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TextTaskList);
