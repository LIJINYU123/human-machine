import React, { Component } from 'react';
import { Button, Card, Table } from 'antd';


const getValue = obj => (obj ? obj.join(',') : []);

class MemberDetail extends Component {
  handleTableChange = (pagination, filterArg, _) => {
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
      projectId: this.state.projectId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'projectDetail/fetchTaskData',
      payload: params,
    });
  };

  render() {
    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
      },
      {
        title: '角色名称',
        dataIndex: 'roleName',
      },
      {
        title: '领取任务数',
        dataIndex: 'receiveNum',
      },
      {
        title: '标注任务详情',
        render: (_, user) => <a>任务列表</a>,
      },
    ];


    return (
      <Card bordered={false}>
        <Table
          rowKey="userId"
          columns={columns}
          onChange={this.handleTableChange}
          pagination={{ showSizeChanger: true, showQuickJumper: true }}
        />
      </Card>
    );
  }
}

export default MemberDetail;
