import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Modal, Input, Icon, Badge, Tag, Dropdown, Menu } from 'antd';
import Highlighter from 'react-highlight-words';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import UserDetailView from './components/UserDetailView';
import BatchAddView from './components/BatchAddView';
import ManualAddView from './components/ManualAddView';
import GroupManage from './components/GroupManage';
import md5 from 'md5';

const { confirm } = Modal;

const getValue = obj => (obj ? obj.join(',') : []);

@connect(({ userList, groupList, loading }) => ({
  userList,
  groupList,
  loading: loading.models.userList,
}))
class UserManage extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    manualAddVisible: false,
    selectedRows: [],
    userInfo: {},
    filteredInfo: null,
    searchedColumn: '',
    searchText: '',
    addAuthority: false,
    modifyAuthority: false,
    deleteAuthority: false,
    activeTabKey: 'account',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    const params = {
      sorter: 'updatedTime_descend',
    };

    dispatch({
      type: 'userList/fetchRoles',
    });

    dispatch({
      type: 'userList/fetchUsers',
      payload: params,
    });

    dispatch({
      type: 'groupList/fetchGroups',
      payload: { sorter: 'updatedTime_descend' },
    });

    const privilegeStr = localStorage.getItem('Privileges');
    const privileges = JSON.parse(privilegeStr);
    const { userManage } = privileges;

    this.setState({
      addAuthority: userManage.includes('add'),
      modifyAuthority: userManage.includes('modify'),
      deleteAuthority: userManage.includes('delete'),
      activeTabKey: typeof location.state !== 'undefined' ? 'group' : 'account',
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
        dispatch({
          type: 'userList/fetchUsers',
          payload: { sorter: 'updatedTime_descend' },
        });
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

  handleTabChange = key => {
    this.setState({
      activeTabKey: key,
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;

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
      ...filters,
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
    const { userList: { data } } = this.props;

    const { list } = data;
    const result = list.filter(item => item.userId === user.userId);
    this.setState({
      userInfo: result[0],
    });

    this.setState({
      modalVisible: true,
    });
  };

  handleResetPassword = user => {
    const { dispatch } = this.props;
    dispatch({
      type: 'userList/resetPassword',
      payload: { userId: user.userId, name: user.name, password: md5('eco@1234'), confirm: md5('eco@1234') },
    });
  };

  handleBatchAdd = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  handleManualAdd = () => {
    this.setState({
      manualAddVisible: true,
    });
  };

  handleCancelAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handleCancelManualModal = () => {
    this.setState({
      manualAddVisible: false,
    });
  };

  handleDelete = userId => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userList/deleteUsers',
      payload: { userIds: [userId] },
      callback: () => {
        dispatch({
          type: 'userList/fetchUsers',
          payload: { sorter: 'updatedTime_descend' },
        });
      },
    });
  };

  handleActive = (userId, status) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userList/activeUser',
      payload: { userId, status: status === 'active' ? 'inactive' : 'active' },
      callback: () => {
        dispatch({
          type: 'userList/fetchUsers',
          payload: { sorter: 'updatedTime_descend' },
        });
      },
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

  activeAndDelete = (key, userId, status) => {
    if (key === 'delete') {
      this.handleDelete(userId);
    } else {
      this.handleActive(userId, status);
    }
  };

  manualAndAuto = key => {
    if (key === 'batch') {
      this.handleBatchAdd();
    } else {
      this.handleManualAdd();
    }
  };

  render() {
    const { userList: { data, roleInfos, accounts }, groupList: { groups }, loading } = this.props;
    const { selectedRows, userInfo, addAuthority, modifyAuthority, deleteAuthority, activeTabKey, modalVisible, addModalVisible, manualAddVisible } = this.state;
    const roleFilters = roleInfos.map(info => ({
      text: info.roleName,
      value: info.roleId,
    }));

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const MoreBtn = ({ userId, status }) => (
      <Dropdown
        overlay={
          <Menu onClick={({ key }) => this.activeAndDelete(key, userId, status)}>
            <Menu.Item key="active">{status === 'active' ? '停用' : '启用'}</Menu.Item>
            <Menu.Item key="delete">删除</Menu.Item>
          </Menu>
        }
      >
        <a>更多<Icon type="down"/></a>
      </Dropdown>
    );

    const AddBtn = () => (
      <Dropdown
        trigger={['click']}
        overlay={
          <Menu onClick={({ key }) => this.manualAndAuto(key)}>
            <Menu.Item key="manual">手动创建</Menu.Item>
            <Menu.Item key="batch">批量创建</Menu.Item>
          </Menu>
        }
      >
        <Button icon="down" type="primary">创建</Button>
      </Dropdown>
    );

    const tabList = [
      {
        key: 'account',
        tab: '成员管理',
      },
      {
        key: 'group',
        tab: '组别管理',
      },
    ];

    const columns = [
      {
        title: '账户名',
        dataIndex: 'userId',
        ...this.getColumnSearchProps('userId'),
      },
      {
        title: '用户名',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
        render: val => <a>{val}</a>,
      },
      {
        title: '角色名称',
        dataIndex: 'roleId',
        render: val => (roleInfos.length ? roleInfos.filter(item => item.roleId === val)[0].roleName : val),
        filters: roleFilters,
        filteredValue: filteredInfo.roleId || null,
      },
      {
        title: '组别',
        dataIndex: 'groupId',
        render: val => {
          if (groups.length) {
            return val.map(groupId => {
              const filterGroups = groups.filter(group => group.groupId === groupId);
              if (filterGroups.length) {
                return (<Tag color="blue">{filterGroups[0].groupName}</Tag>);
              }
              return '';
            });
          }
          return '';
        },
      },
      {
        title: '状态',
        dataIndex: 'status',
        render: val => <Badge status={val === 'active' ? 'success' : 'error'} text={val === 'active' ? '已启用' : '已停用'}/>,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, user) => (
          <Fragment>
            { modifyAuthority && <a onClick={() => this.handleModify(user)}>编辑</a> }
            { modifyAuthority && <Divider type="vertical"/> }
            <a onClick={() => this.handleResetPassword(user)}>重置密码</a>
            <Divider type="vertical"/>
            <MoreBtn key="more" userId={user.userId} status={user.status}/>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={activeTabKey}
        onTabChange={this.handleTabChange}
      >
        {
          activeTabKey === 'account' &&
          <Fragment>
            <Card bordered={false}>
              <div className={styles.tableListOperator}>
                <AddBtn/>
                <Button icon="delete" type="danger" disabled={!selectedRows.length || !deleteAuthority} onClick={this.showDeleteConfirm}>删除</Button>
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
            <UserDetailView visible={modalVisible} onCancel={this.handleCancelModal} userInfo={userInfo} roleInfos={roleInfos} groupInfos={groups} />
            <BatchAddView visible={addModalVisible} onCancel={this.handleCancelAddModal} roleInfos={roleInfos} noDepAccounts={accounts} />
            <ManualAddView visible={manualAddVisible} onCancel={this.handleCancelManualModal} roleInfos={roleInfos} groupInfos={groups} />
          </Fragment>
        }
        {
          activeTabKey === 'group' && <GroupManage />
        }
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
