import React, { Component } from 'react';
import { Descriptions, Card, Tooltip, Popover } from 'antd';
import PopoverView from './PopoverView';
import { connect } from 'dva';
import ItemData from '../map';

const { labelTypeName } = ItemData;

@connect(({ projectDetail }) => ({
  basicInfo: projectDetail.basicInfo,
}))
class BasicView extends Component {
  render() {
    const { basicInfo } = this.props;

    return (
      <Card bordered={false}>
        <Descriptions title="项目信息" column={3} bordered>
          <Descriptions.Item label="项目名称">{basicInfo.projectName}</Descriptions.Item>
          <Descriptions.Item label="项目类型">{basicInfo.projectType}</Descriptions.Item>
          <Descriptions.Item label="项目负责人">{basicInfo.owner.userName}</Descriptions.Item>
          <Descriptions.Item label="发布时间">{basicInfo.createdTime}</Descriptions.Item>
          <Descriptions.Item label="项目周期" span={2}>{`${basicInfo.startTime} - ${basicInfo.endTime}`}</Descriptions.Item>
          <Descriptions.Item label="单个任务包题目数">{basicInfo.questionNum}</Descriptions.Item>
          <Descriptions.Item label="合格率">{basicInfo.passRate}%</Descriptions.Item>
          <Descriptions.Item label="质检率">{basicInfo.checkRate}%</Descriptions.Item>
          <Descriptions.Item label="标注员"><Tooltip title={basicInfo.labelers.map(labeler => labeler.userName).join('，')}><a>查看列表</a></Tooltip></Descriptions.Item>
          <Descriptions.Item label="质检员"><Tooltip title={basicInfo.inspectors.map(inspector => inspector.userName).join('，')}><a>查看列表</a></Tooltip></Descriptions.Item>
          <Descriptions.Item label="项目描述">{basicInfo.description}</Descriptions.Item>
        </Descriptions>
        {/*<Descriptions title="项目数据集" style={{ marginTop: '32px' }} bordered>*/}
        {/*  <Descriptions.Item label="数据文件"><a>下载数据集</a></Descriptions.Item>*/}
        {/*</Descriptions>*/}
        <Descriptions title="标注工具" column={2} style={{ marginTop: '32px' }} bordered>
          <Descriptions.Item label="标注工具">{labelTypeName[basicInfo.labelType]}</Descriptions.Item>
          <Descriptions.Item label="工具配置"><Popover content={<PopoverView setting={basicInfo.setting}/>} overlayStyle={{ maxWidth: '500px' }}><a>查看详情</a></Popover></Descriptions.Item>
          <Descriptions.Item label="标注规则"><span dangerouslySetInnerHTML={{ __html: basicInfo.explain }}/></Descriptions.Item>
        </Descriptions>
      </Card>
    );
  }
}

export default BasicView;
