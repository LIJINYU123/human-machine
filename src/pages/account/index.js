import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Popconfirm, Modal, Input, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import UserDetailView from './components/UserDetailView';
import UserAddView from './components/UserAddView';

const { confirm } = Modal;

@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
class UserManage extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    selectedRows: [],
    searchText: '',
    userInfo: {},
    searchedColumn: '',
    addAuthority: false,
    modifyAuthority: false,
    deleteAuthority: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      sorter: 'registerTime_descend',
    };

    dispatch({
      type: 'userList/fetchUsers',
      payload: params,
    });

    const privilegeStr = localStorage.getItem('Privileges');
    const privileges = JSON.parse(privilegeStr);
    const { userManage } = privileges;
    this.setState({
      addAuthority: userManage.includes('add'),
      modifyAuthority: userManage.includes('modify'),
      deleteAuthority: userManage.includes('delete'),
    });
  }

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'userList/deleteUsers',
      payload: {
        userIds: selectedRows.map(row => row.userId),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  showDeleteConfirm = () => {
    confirm({
      title: '确认删除这些用户吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleBatchDelete,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    if (this.state.searchText !== '') {
      params[this.state.searchedColumn] = this.state.searchText;
    }
    dispatch({
      type: 'userList/fetchUsers',
      payload: params,
    });
  };

  handleModify = user => {
    const { dispatch, userList: { data } } = this.props;

    const { list } = data;
    const result = list.filter(item => item.userId === user.userId);
    this.setState({
      userInfo: result[0],
    });

    dispatch({
      type: 'userList/fetchRoles',
    });

    this.setState({
      modalVisible: true,
    });
  };

  handleAddto = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/fetchNoDepAccounts',
    });

    dispatch({
      type: 'userList/fetchRoles',
    });

    this.setState({
      addModalVisible: true,
    });
  };

  handleCancelAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handleDelete = user => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userList/deleteUsers',
      payload: { userIds: [user.userId] },
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  getColumnSearchProps = dataIndex => ({
    // eslint-disable-next-line no-shadow
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
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }} >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
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
    ) : (text)),
  });

  // eslint-disable-next-line no-shadow
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

  render() {
    const { userList: { data, roleInfos, accounts }, loading } = this.props;
    const { selectedRows, userInfo, addAuthority, modifyAuthority, deleteAuthority } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userId',
        ...this.getColumnSearchProps('userId'),
      },
      {
        title: '真实姓名',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '注册时间',
        dataIndex: 'registerTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, user) => (
          <Fragment>
            { modifyAuthority && <a onClick={() => this.handleModify(user)}>编辑</a> }
            { modifyAuthority && deleteAuthority && <Divider type="vertical"/> }
            <Popconfirm title="确认移除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(user)}>
              { deleteAuthority && <a>移除</a> }
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleAddto} disabled={!addAuthority}>添加</Button>
            <Button icon="delete" type="danger" disabled={!selectedRows.length || !deleteAuthority} onClick={this.showDeleteConfirm}>移除</Button>
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
        {/* eslint-disable-next-line max-len */}
        <UserDetailView visible={this.state.modalVisible} onCancel={this.handleCancelModal} userInfo={userInfo} roleInfos={roleInfos} />
        {/* eslint-disable-next-line max-len */}
        <UserAddView visible={this.state.addModalVisible} onCancel={this.handleCancelAddModal} roleInfos={roleInfos} noDepAccounts={accounts} />
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
