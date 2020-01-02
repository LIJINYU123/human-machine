import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Popconfirm, Modal } from 'antd';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import UserDetailView from './components/UserDetailView';

const { confirm } = Modal;

@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
class UserManage extends Component {
  state = {
    modalVisible: false,
    selectedRows: [],
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

    dispatch({
      type: 'userList/fetchUsers',
      payload: params,
    });
  };

  handleModify = user => {
    const { dispatch } = this.props;

    dispatch({
      type: 'userList/fetchDetail',
      payload: { userId: user.userId },
    });

    dispatch({
      type: 'userList/fetchRoles',
    });

    this.setState({
      modalVisible: true,
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

  render() {
    const { userList: { data, userInfo, roleInfos }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userId',
      },
      {
        title: '真实姓名',
        dataIndex: 'name',
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
            <a onClick={() => this.handleModify(user)}>编辑</a>
            <Divider type="vertical"/>
            <Popconfirm title="确认删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(user)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Button className={styles.tableLitOperator} icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.showDeleteConfirm}>删除</Button>
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
      </PageHeaderWrapper>
    );
  }
}

export default UserManage;
