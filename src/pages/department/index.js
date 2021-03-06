import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Icon, Input, Table, Tag, Modal, Tooltip } from 'antd';
import Highlighter from 'react-highlight-words';
import DepCreateView from './component/DepCreateView';
import DepEditView from './component/DepEditView';
import DepDetailView from './component/DepDetailView';
import styles from './style.less';
import ItemData from './component/map';

const { confirm } = Modal;
const { PrivilegeToFirstLevelName, DepartmentType, PrivilegeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const departmentTypeFilters = DepartmentType.map(d => ({
  text: d.name,
  value: d.id,
}));

@connect(({ departmentList, loading }) => ({
  departmentList,
  loading: loading.effects['departmentList/fetchDepartment'],
}))
class DepartmentList extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    detailModalVisible: false,
    departmentInfo: {},
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/fetchDepartment',
      payload: { sorter: 'updatedTime_descend' },
    });
  }

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

  handleDelete = department => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/deleteDepartment',
      payload: { departmentId: department.departmentId },
    });
  };

  showDeleteConform = department => {
    confirm({
      title: '请问是否确定删除该机构？',
      content: <div><span style={{ color: 'red' }}>删除后机构下所有账户均被删除且不可恢复</span><br/><br/><span>你还要继续吗？</span></div>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.handleDelete(department);
      },
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

  handleModify = department => {
    const { departmentList: { data } } = this.props;

    const result = data.filter(item => item.departmentId === department.departmentId);
    this.setState({
      departmentInfo: result[0],
      modalVisible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleDetail = department => {
    this.setState({
      departmentInfo: department,
      detailModalVisible: true,
    });
  };

  handleCancelDetailModal = () => {
    this.setState({
      detailModalVisible: false,
    });
  };

  handleTableChange = (pagination, filterArg, sorter) => {
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
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'departmentList/fetchDepartment',
      payload: params,
    });
  };

  render() {
    const { departmentList: { data, accounts }, loading } = this.props;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: '序号',
        render: (_, record, index) => index + 1,
        width: 60,
      },
      {
        title: '机构名称',
        dataIndex: 'departmentName',
        ...this.getColumnSearchProps('departmentName', '机构名称'),
        render: (text, department) => (this.state.searchedColumn === 'departmentName' ? (
          <a onClick={() => this.handleDetail(department)}><Highlighter
            highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
            searchWords={[this.state.searchText]}
            autoEscape
            textToHighlight={text.toString()}
          /></a>
        ) : <a onClick={() => this.handleDetail(department)}>{text}</a>),
      },
      {
        title: '机构类型',
        dataIndex: 'departmentType',
        render: val => DepartmentType.filter(d => d.id === val)[0].name,
        filters: departmentTypeFilters,
        filteredValue: filteredInfo.departmentType || null,
      },
      {
        title: '机构权限',
        dataIndex: 'privilege',
        render: val => {
          const names = val.map(item => PrivilegeToFirstLevelName[item]);
          const title = val.map(item => PrivilegeName[item]);
          const noRepeat = [];
          names.forEach(name => {
            if (!noRepeat.includes(name)) {
              noRepeat.push(name);
            }
          });
          return <Tooltip title={title.join('，')}>{noRepeat.map(m => <Tag color="blue" style={{ cursor: 'pointer' }}>{m}</Tag>)}</Tooltip>
        },
        ellipsis: true,
      },
      {
        title: '管理员',
        dataIndex: 'administrator',
      },
      {
        title: '用户数目',
        dataIndex: 'userAmount',
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, department) => (
          <Fragment>
            <a onClick={() => this.handleModify(department)}>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDetail(department)}>详情</a>
            <Divider type="vertical"/>
            <a onClick={() => this.showDeleteConform(department)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Button className={styles.tableListOperator} icon="plus" type="primary" onClick={this.handleAdd}>新增</Button>
        <Card bordered={false}>
          <Table
            className={styles.standardTable}
            loading={loading}
            dataSource={data}
            pagination={{ showSizeChanger: true, showQuickJumper: true }}
            columns={columns}
            onChange={this.handleTableChange}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <DepEditView visible={this.state.modalVisible} onCancel={this.handleCancelModal} departmentInfo={this.state.departmentInfo} noDepAccounts={accounts} />
        <DepDetailView visible={this.state.detailModalVisible} onCancel={this.handleCancelDetailModal} departmentInfo={this.state.departmentInfo}/>
        {/* eslint-disable-next-line max-len */}
        <DepCreateView visible={this.state.addModalVisible} onCancel={this.handleCancelAddModal} noDepAccounts={accounts} />
      </PageHeaderWrapper>
    );
  }
}

export default DepartmentList;
