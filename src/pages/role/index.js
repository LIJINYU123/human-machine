import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Modal } from 'antd';
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
  };

  columns = [
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
          <a onClick={() => this.handleModify(role)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={() => this.handleDelete(role)}>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'roleList/fetchRole',
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

    return (
      <PageHeaderWrapper>
        <Button className={styles.tableLitOperator} icon="plus" type="primary" onClick={this.handleAdd}>新增</Button>
        <Card bordered={false}>
          <StandardTable
            loading={loading}
            data={data}
            columns={this.columns}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <RoleDetailView visible={this.state.modalVisible} onCancel={this.handleCancelModal} roleInfo={this.state.roleInfo} />
        <RoleCreateView visible={this.state.addModalVisible} onCancel={this.handleCancelAddModal} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
