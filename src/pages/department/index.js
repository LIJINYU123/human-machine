import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Popconfirm, Table } from 'antd';
import DepCreateView from './component/DepCreateView';
import DepDetailView from './component/DepDetailView';
import styles from './style.less';

@connect(({ departmentList, loading }) => ({
  departmentList,
  loading: loading.models.departmentList,
}))
class DepartmentList extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    departmentInfo: {},
  };

  columns = [
    {
      title: '部门标识',
      dataIndex: 'departmentId',
    },
    {
      title: '部门名称',
      dataIndex: 'departmentName',
    },
    {
      title: '管理员',
      dataIndex: 'administrator',
    },
    {
      title: '用户数目',
      dataIndex: 'userAmount',
      render: (_, department) => (
        <a>{department.userAmount}</a>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdTime',
    },
    {
      title: '操作',
      render: (_, department) => (
        <Fragment>
          <a onClick={() => this.handleModify(department)}>编辑</a>
          <Divider type="vertical" />
          <Popconfirm title="确定删除该部门吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(department)}>
            <a>删除</a>
          </Popconfirm>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/fetchDepartment',
    });
  }

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleDelete = department => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/deleteDepartment',
      payload: { departmentId: department.departmentId },
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/fetchNoDepAccounts',
    });

    this.setState({
      addModalVisible: true,
    });
  };

  handleModify = department => {
    const { dispatch, departmentList: { data } } = this.props;

    const result = data.filter(item => item.departmentId === department.departmentId);
    this.setState({
      departmentInfo: result[0],
    });

    dispatch({
      type: 'departmentList/fetchNoDepAccounts',
    });

    this.setState({
      modalVisible: true,
    });
  };

  handleCancelAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  render() {
    const { departmentList: { data, accounts }, loading } = this.props;

    return (
      <PageHeaderWrapper>
        <Button className={styles.tableListOperator} icon="plus" type="primary" onClick={this.handleAdd}>新增</Button>
        <Card bordered={false}>
          <Table
            className={styles.standardTable}
            loading={loading}
            dataSource={data}
            pagination={false}
            columns={this.columns}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <DepDetailView visible={this.state.modalVisible} onCancel={this.handleCancelModal} departmentInfo={this.state.departmentInfo} noDepAccounts={accounts} />
        {/* eslint-disable-next-line max-len */}
        <DepCreateView visible={this.state.addModalVisible} onCancel={this.handleCancelAddModal} noDepAccounts={accounts} />
      </PageHeaderWrapper>
    );
  }
}

export default DepartmentList;
