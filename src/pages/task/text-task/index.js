import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Row, Col, DatePicker, Button, Divider, Card, Progress, Badge, Input, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import styles from './style.less';
import StandardTable from './component/StandardTable';
import ItemData from './map';

const { RangePicker } = DatePicker;

const { statusMap, statusName, taskName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const statusFilters = Object.keys(statusName).map(key => ({
  text: statusName[key],
  value: key,
}));

const taskTypeFilters = Object.keys(taskName).map(key => ({
  text: taskName[key],
  value: key,
}));

@connect(({ textTaskList, loading }) => ({
  textTaskList,
  loading: loading.models.textTaskList,
}))
class TextTaskList extends Component {
  state = {
    selectedRows: [],
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      sorter: 'createdTime_descend',
    };
    dispatch({
      type: 'textTaskList/fetchTask',
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
      type: 'textTaskList/fetchTask',
      payload: params,
    });
  };

  handleReviewDetails = task => {
    console.log(task);
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
    });

    dispatch({
      type: 'textTaskList/fetchTask',
    });
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form layout="inline">
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
    const { textTaskList: { data, labelers }, loading } = this.props;
    const { selectedRows } = this.state;

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
        render: val => taskName[val],
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
            <a>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary">新增</Button>
            <Button icon="delete" type="danger">删除</Button>
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TextTaskList);
