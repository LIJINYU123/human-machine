import React, { Component } from 'react';
import { connect } from 'dva';

@connect(({ userList, loading }) => ({
  userList,
  loading: loading.models.userList,
}))
class UserManage extends Component {
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
  ];
}

