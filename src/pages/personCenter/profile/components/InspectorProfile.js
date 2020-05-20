import React, { Component, Fragment } from 'react';
import { Descriptions } from 'antd';

class InspectorProfile extends Component {
  render() {
    const { statistics } = this.props;

    return (
      <Fragment>
        <Descriptions title="数据统计" column={3} style={{ marginTop: '32px' }} bordered>
          <Descriptions.Item label="参与项目数">{statistics.involvedProjectNum}</Descriptions.Item>
          <Descriptions.Item label="质检任务数">{statistics.completeTaskNum}</Descriptions.Item>
          <Descriptions.Item label="质检题目数">{statistics.reviewQuestionNum}</Descriptions.Item>
          <Descriptions.Item label="要求质检比例(均)">{`${statistics.requireCheckRate}%`}</Descriptions.Item>
          <Descriptions.Item label="实际质检比例(均)">{`${statistics.actualCheckRate}%`}</Descriptions.Item>
        </Descriptions>
      </Fragment>
    );
  }
}

export default InspectorProfile;
