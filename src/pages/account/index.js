import React, { Component, Fragment } from 'react';
import { connect } from 'dva';

@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
class UserManage extends Component {
  render() {
    columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
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
      },
      {
        title: '操作',
        render: (_, record) => (
          <Fragment>
            <a>编辑</a>
          </Fragment>
        ),
      },
    ];
  }
}

