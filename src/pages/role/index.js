import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Modal, Popconfirm } from 'antd';
import StandardTable from './components/StandardTable';
import RoleDetailView from './components/RoleDetailView';
import RoleCreateView from './components/RoleCreateView';
import styles from './style.less';

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
    const { addAuthority, modifyAuthority, deleteAuthority } = this.state;

    const columns = [
      {
        title: '角色标识',
        dataIndex: 'roleId',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
      },
      {
        title: '操作',
        render: (_, role) => (
          <Fragment>
            { modifyAuthority && <a onClick={() => this.handleModify(role)}>编辑</a> }
            { modifyAuthority && deleteAuthority && <Divider type="vertical"/> }
            <Popconfirm title="确认删除该角色吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(role)}>
              { deleteAuthority && <a>删除</a> }
            </Popconfirm>
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
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <RoleDetailView visible={this.state.modalVisible} onCancel={this.handleCancelModal} roleInfo={this.state.roleInfo} />
        {/* eslint-disable-next-line max-len */}
        <RoleCreateView visible={this.state.addModalVisible} onCancel={this.handleCancelAddModal} roles={data} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
