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
  Popconfirm, Dropdown, Menu, Modal,
} from 'antd';
import styles from './style.less';
import StandardTable from './component/StandardTable';
import ProjectCreateView from './component/ProjectCreateView';
import ProjectEditView from './component/ProjectEditView';
import ItemData from './map';

const { RangePicker } = DatePicker;
const { confirm } = Modal;

const { statusMap, statusName, labelTypeName, projectTypes } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const statusFilters = Object.keys(statusName).map(key => ({
  text: statusName[key],
  value: key,
}));

const labelTypeFilters = Object.keys(labelTypeName).map(key => ({
  text: labelTypeName[key],
  value: key,
}));

const projectTypeFilters = projectTypes.map(item => ({
  text: item.label,
  value: item.label,
}));

@connect(({ project, loading }) => ({
  data: project.data,
  loading: loading.effects['project/fetchProject'],
}))
class TextProjectList extends Component {
  state = {
    selectedRows: [],
    formValues: {},
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
    projectId: '',
    addModalVisible: false,
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      sorter: 'createdTime_descend',
    };
    dispatch({
      type: 'project/fetchProject',
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
      type: 'project/fetchProject',
      payload: params,
    });
  };

  handleAdd = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  handleEdit = projectId => {
    this.setState({
      modalVisible: true,
      projectId,
    });
  };

  handleCancelAddModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'project/fetchProject',
      payload: { sorter: 'createdTime_descend' },
    });

    dispatch({
      type: 'textProjectFormData/resetStepData',
    });
    this.setState({
      addModalVisible: false,
    });
  };

  handleCancelEditModal = () => {
    const { dispatch } = this.props;

    dispatch({
      type: 'textProjectFormData/resetStepData',
    });
    this.setState({
      modalVisible: false,
    });
  };

  handleReviewDetails = project => {
    router.push({
      pathname: '/project/detail',
      state: {
        projectId: project.projectId,
      },
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
      searchText: '',
      searchedColumn: '',
    });

    dispatch({
      type: 'project/fetchProject',
      payload: { sorter: 'updatedTime_descend' },
    });
  };

  handleDelete = projectId => {
    confirm({
      title: '确定删除该项目吗？',
      content: <div><span style={{ color: 'red' }}>项目删除后，不可恢复</span><br/><br/><span>你还要继续吗？</span></div>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        dispatch({
          type: 'project/deleteProject',
          payload: {
            projectIds: [projectId],
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
      },
    });
  };

  handleBatchDelete = () => {
    confirm({
      title: '确定删除这些项目吗？',
      content: <div><span style={{ color: 'red' }}>项目删除后，不可恢复</span><br/><br/><span>你还要继续吗？</span></div>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        const { dispatch } = this.props;
        const { selectedRows } = this.state;
        dispatch({
          type: 'project/deleteProject',
          payload: {
            projectIds: selectedRows.map(row => row.projectId),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
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
        createdStartTime: fieldValues.createdTime && fieldValues.createdTime[0].format('YYYY-MM-DD 00:00:00'),
        createdEndTime: fieldValues.createdTime && fieldValues.createdTime[1].format('YYYY-MM-DD 23:59:59'),
      };
      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'project/fetchProject',
        payload: values,
      });
    });
  };

  handleSuspend = projectId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/updateProjectStatus',
      payload: { projectId, status: 'suspend' },
      callback: () => {
        dispatch({
          type: 'project/fetchProject',
          payload: { sorter: 'createdTime_descend' },
        });
      },
    });
  };

  handleRecover = projectId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'project/updateProjectStatus',
      payload: { projectId, status: 'inProgress' },
      callback: () => {
        dispatch({
          type: 'project/fetchProject',
          payload: { sorter: 'createdTime_descend' },
        });
      },
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
            <Button type="primary" onClick={this.handleFormSearch}>
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
    const { selectedRows, addModalVisible, modalVisible, projectId } = this.state;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    // eslint-disable-next-line no-shadow
    const MoreBtn = ({ status, projectId }) => (
      <Dropdown
        overlay={
          <Menu>
            {
              status === 'suspend' &&
              <Menu.Item key="recover" onClick={() => this.handleRecover(projectId)}>恢复</Menu.Item>
            }
            {
              status === 'inProgress' &&
              <Menu.Item key="suspend" onClick={() => this.handleSuspend(projectId)}>暂停</Menu.Item>
            }
            <Menu.Item key="delete" onClick={() => this.handleDelete(projectId)}>删除</Menu.Item>
          </Menu>
        }
      >
        <a>更多<Icon type="down"/></a>
      </Dropdown>
    );

    const columns = [
      {
        title: '项目名称',
        dataIndex: 'projectName',
        ...this.getColumnSearchProps('projectName', '项目名称'),
        render: (text, project) => (this.state.searchedColumn === 'projectName' ? (
          <a onClick={() => this.handleReviewDetails(project)}><Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          /></a>
        ) : <a onClick={() => this.handleReviewDetails(project)}>{text}</a>),
      },
      {
        title: '负责人',
        dataIndex: 'owner',
        render: val => val.userName,
      },
      {
        title: '项目类型',
        dataIndex: 'projectType',
        filters: projectTypeFilters,
        filteredValue: filteredInfo.projectType || null,
      },
      {
        title: '项目进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '项目状态',
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
        title: '操作',
        render: (_, project) => (
          <Fragment>
            <a onClick={() => this.handleEdit(project.projectId)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleReviewDetails(project)}>详情</a>
            <Divider type="vertical"/>
            <MoreBtn key="more" status={project.status} projectId={project.projectId}/>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleAdd}>创建</Button>
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
        <ProjectCreateView visible={addModalVisible} onCancel={this.handleCancelAddModal} />
        <ProjectEditView visible={modalVisible} onCancel={this.handleCancelEditModal} projectId={projectId} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TextProjectList);
