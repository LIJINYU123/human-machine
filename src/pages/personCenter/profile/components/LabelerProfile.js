import React, { Component, Fragment } from 'react';
import { Descriptions, Table } from 'antd'

class LabelerProfile extends Component {
  render() {
    const { statistics } = this.props;

    const columns = [
      {
        title: '退回次数',
        dataIndex: 'rejectNum',
      },
      {
        title: '退回任务数',
        dataIndex: 'rejectTaskNUm',
      },
      {
        title: '退回比例',
        dataIndex: 'rejectRate',
        render: val => `${val}%`,
      },
    ];

    return (
      <Fragment>
        <Descriptions title="数据统计" column={3} style={{ marginTop: '32px' }} bordered>
          <Descriptions.Item label="参与项目数">{statistics.involvedProjectNum}</Descriptions.Item>
          <Descriptions.Item label="标注任务数">{statistics.completeTaskNum}</Descriptions.Item>
          <Descriptions.Item label="标注题目数">{statistics.markQuestionNum}</Descriptions.Item>
        </Descriptions>
        <Table
          columns={columns}
          pagination={false}
          dataSource={statistics.rejectInfos}
          style={{ marginTop: '32px' }}
        />
      </Fragment>
    );
  }
}

export default LabelerProfile;
