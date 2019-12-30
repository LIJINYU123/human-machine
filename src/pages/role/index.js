import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Divider } from 'antd';
import StandardTable from './components/StandardTable';
import RoleDetailView from './components/RoleDetailView';

@connect(({ roleList, loading }) => ({
  roleList,
  loading: loading.models.roleList,
}))
class RoleList extends Component {
  state = {
    modalVisible: false,
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
          <a>删除</a>
        </Fragment>
      ),
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'roleList/fetch',
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handleModify = role => {
    const { dispatch } = this.props;

    dispatch({
      type: 'roleList/fetchDetail',
      payload: { roleId: role.roleId },
    });
    this.setState({
      modalVisible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { roleList: { data, roleInfo }, loading } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <StandardTable
            loading={loading}
            data={data}
            columns={this.columns}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <RoleDetailView visible={this.state.modalVisible} onCancel={this.handleCancelModal} roleInfo={roleInfo} />
      </PageHeaderWrapper>
    );
  }
}

export default RoleList;
