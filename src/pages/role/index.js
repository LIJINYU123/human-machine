import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Modal } from 'antd';
import StandardTable from './components/StandardTable';
import RoleDetailView from './components/RoleDetailView';
import RoleCreateView from './components/RoleCreateView';
import styles from './style.less';

const { confirm } = Modal;

@connect(({ roleList, loading }) => ({
  roleList,
  loading: loading.models.roleList,
}))
class RoleList extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    roleInfo: {},
    addAuthority: false,
    modifyAuthority: false,
    deleteAuthority: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'roleList/fetchRole',
      payload: { sorter: 'updatedTime_descend' },
    });

    const privilegeStr = localStorage.getItem('Privileges');
    const privileges = JSON.parse(privilegeStr);
    const { roleManage } = privileges;
    this.setState({
      addAuthority: roleManage.includes('add'),
      modifyAuthority: roleManage.includes('modify'),
      deleteAuthority: roleManage.includes('delete'),
    });
  }

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const params = {};

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'roleList/fetchRole',
      payload: params,
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleModify = role => {
    const { roleList: { data } } = this.props;

    const result = data.filter(item => item.roleId === role.roleId);
    this.setState({
      roleInfo: result.length ? result[0] : {},
    });
    this.setState({
      modalVisible: true,
    });
  };

  handleDelete = role => {
    const { dispatch } = this.props;

    dispatch({
      type: 'roleList/deleteRole',
      payload: { roleId: role.roleId },
      callback: () => {
        dispatch({
          type: 'roleList/fetchRole',
          payload: { sorter: 'updatedTime_descend' },
        });
      },
    });
  };

  showDeleteConform = role => {
    confirm({
      title: '请问是否确定删除该角色？',
      content: <div><span style={{ color: 'red' }}>删除后，不可恢复且该角色下的账户将无法登录</span><br/><br/><span>你还要继续吗？</span></div>,
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        this.handleDelete(role);
      },
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
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

  render() {
    const { roleList: { data }, loading } = this.props;
    const { modalVisible, addModalVisible, roleInfo, addAuthority, modifyAuthority, deleteAuthority } = this.state;

    const columns = [
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '角色描述',
        dataIndex: 'description',
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, role) => (
          <Fragment>
            { modifyAuthority && <a onClick={() => this.handleModify(role)}>编辑</a> }
            { modifyAuthority && deleteAuthority && <Divider type="vertical"/> }
            { deleteAuthority && <a onClick={() => this.showDeleteConform(role)}>删除</a> }
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Button className={styles.tableListOperator} icon="plus" type="primary" onClick={this.handleAdd} disabled={!addAuthority}>新增</Button>
        <Card bordered={false}>
          <StandardTable
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <RoleDetailView visible={modalVisible} onCancel={this.handleCancelModal} roleInfo={roleInfo} />
        {/* eslint-disable-next-line max-len */}
        <RoleCreateView visible={addModalVisible} onCancel={this.handleCancelAddModal} roles={data} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
