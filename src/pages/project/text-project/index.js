import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
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
import styles from './style.less';
import StandardTable from './component/StandardTable';
import ItemData from './map';

const { RangePicker } = DatePicker;

const { statusMap, statusName, labelTypeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const statusFilters = Object.keys(statusName).map(key => ({
  text: statusName[key],
  value: key,
}));

const labelTypeFilters = Object.keys(labelTypeName).map(key => ({
  text: labelTypeName[key],
  value: key,
}));

@connect(({ textProject, loading }) => ({
  data: textProject.data,
  loading: loading.effects['textProject/fetchProject'],
}))
class TextProjectList extends Component {
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
      sorter: 'createdTime_descend',
    };
    dispatch({
      type: 'textProject/fetchProject',
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
      type: 'textProject/fetchProject',
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
      addModalVisible: true,
    });
  };

  handleReviewDetails = project => {
    router.push({
      pathname: '/project/text-detail',
      state: {
        projectId: project.projectId,
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
      type: 'textProject/fetchProject',
    });
  };

  handleDelete = project => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProject/deleteProject',
      payload: {
        projectIds: [project.projectId],
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
      type: 'textProject/deleteProject',
      payload: {
        projectIds: selectedRows.map(row => row.projectId),
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
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'textProject/deleteProject',
        payload: values,
      });
    });
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form onSubmit={this.handleFormReset} layout="inline">
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
    const { data, loading } = this.props;
    const { selectedRows, addModalVisible } = this.state;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: '项目名称',
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
        title: '标注进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '项目状态',
        dataIndex: 'status',
        filters: statusFilters,
        render: val => <Badge status={statusMap[val]} text={statusName[val]}/>,
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
          <Fragment>
            <a onClick={() => this.handleReviewDetails(project)}>详情</a>
            <Divider type="vertical"/>
            <Popconfirm title="确定删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(project)}>
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
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TextProjectList);


