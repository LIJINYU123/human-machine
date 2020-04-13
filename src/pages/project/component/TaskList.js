import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Progress, Badge, Table } from 'antd';
import Link from 'umi/link';

class TaskList extends Component {
  render() {
    const action = (
      <Link to="/project/detail">
        <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
      </Link>
    );

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '标注进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '状态',
        dataIndex: 'status',
      },
    ];

    return (
      <PageHeaderWrapper
        extra={action}
      >
        <Card bordered={false}>
          <Table
            rowKey="taskId"
            columns={columns}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }

}


export default TaskList;
