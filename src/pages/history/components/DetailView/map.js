import React from 'react';
import { Select } from 'antd';

const { Option } = Select;

export default {
  FieldLabels: {
    sex: '性别',
    age: '年龄',
    appearance: '外貌',
    emotion: '情感',
    profession: '职业',
    attendant: '随从',
    customize: '自定义',
    dialog: '对话时间',
    remark: '对话备注',
    videoId: '视频编号',
  },
  TreeData: [
    {
      title: '面部特征',
      value: 'face',
      key: 'face',
      children: [
        {
          title: '发型',
          value: 'hairstyle',
          key: 'hairstyle',
          children: [
            {
              title: '长发',
              value: 'longhair',
              key: 'longhair',
            },
            {
              title: '短发',
              value: 'bingle',
              key: 'bingle',
            }],
        },
        {
          title: '眼镜',
          value: 'glass',
          key: 'glass',
          children: [
            {
              title: '近视镜',
              value: 'myopic',
              key: 'myopic',
            },
            {
              title: '太阳镜',
              value: 'sunglass',
              key: 'sunglass',
            },
            {
              title: '无眼镜',
              value: 'natural',
              key: 'natural',
            }] }],
    },
    {
      title: '身体特征',
      value: 'body',
      key: 'body',
      children: [
        {
          title: '体型',
          value: 'bodytype',
          key: 'bodytype',
          children: [
            {
              title: '苗条',
              value: 'hide',
              key: 'hide',
            },
            {
              title: '肥胖',
              value: 'fat',
              key: 'fat',
            },
            {
              title: '正常',
              value: 'normal',
              key: 'normal',
            }] },
        {
          title: '穿着',
          value: 'clothes',
          key: 'clothes',
          children: [
            {
              title: '普通',
              value: 'plain',
              key: 'plain',
            },
            {
              title: '时髦',
              value: 'fashion',
              key: 'fashion',
            },
            {
              title: '工装',
              value: 'frock',
              key: 'frock',
            }],
        }] }],
  ProfessionData: [
    <Option key="institution">企事业单位人员</Option>,
    <Option key="technology">专业技术人员</Option>,
    <Option key="officer">办事人员</Option>,
    <Option key="server">服务人员</Option>,
    <Option key="agriculture">农林牧渔业人员</Option>,
    <Option key="prudctor">生产制造人员</Option>,
    <Option key="soldier">军人</Option>,
    <Option key="other">其他从业人员</Option>],

  AttendantMember: [
    <Option key="child">孩子</Option>,
    <Option key="spouse">配偶</Option>,
    <Option key="friend">朋友</Option>,
    <Option key="parent">长辈</Option>,
    <Option key="none">无</Option>,
  ],
  EmotionOptions: [
    <Option key="anger">愤怒</Option>,
    <Option key="hate">厌恶</Option>,
    <Option key="fear">害怕</Option>,
    <Option key="sad">悲伤</Option>,
    <Option key="happy">高兴</Option>,
    <Option key="like">喜欢</Option>,
    <Option key="surprise">惊喜</Option>,
    <Option key="neutral">中性</Option>,
  ],
}
