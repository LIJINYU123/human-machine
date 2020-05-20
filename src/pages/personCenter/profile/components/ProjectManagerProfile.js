import React, { Component, Fragment } from 'react';
import { Descriptions, Table } from 'antd';

class ProjectManagerProfile extends Component {
  render() {
    const { statistics } = this.props;

    const columns = [
      {
        title: '延期时长',
        dataIndex: 'delayTime',
      },
      {
        title: '延期项目数',
        dataIndex: 'delayProjectNum',
      },
      {
        title: '延期率',
        dataIndex: 'delayRate',
        render: val => `${val}%`,
      },
    ];

    return (
      <Fragment>
        <Descriptions title="数据统计" column={2} style={{ marginTop: '32px' }} bordered>
          <Descriptions.Item label="参与项目数">{statistics.ownProjectNum}</Descriptions.Item>
          <Descriptions.Item label="项目延期率">{`${statistics.delayRate}% (${statistics.delayProjectNum}/${statistics.ownProjectNum})`}</Descriptions.Item>
        </Descriptions>
        <Table
          columns={columns}
          pagination={false}
          dataSource={statistics.delayInfos}
          style={{ marginTop: '32px' }}
        />
      </Fragment>
    );
  }
}

export default ProjectManagerProfile;
