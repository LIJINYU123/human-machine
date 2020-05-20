import React, { Component } from 'react';
import { Descriptions, Card, Tag } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ItemData from './map';

const { AgencyNameMap, PrivilegeMap } = ItemData;

@connect(({ agency }) => ({
  agencyInfo: agency.agencyInfo,
}))
class Agency extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'agency/fetchAgencyInfo',
    });
  }

  render() {
    const { agencyInfo } = this.props;
    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title="机构信息" column={2} bordered>
            <Descriptions.Item label="机构名称">{agencyInfo.agencyName}</Descriptions.Item>
            <Descriptions.Item label="机构类型">{AgencyNameMap[agencyInfo.agencyType]}</Descriptions.Item>
            <Descriptions.Item label="机构权限">{Object.keys(agencyInfo).length ? agencyInfo.privilege.map(item => <Tag color="blue">{PrivilegeMap[item]}</Tag>) : ''}</Descriptions.Item>
          </Descriptions>
        </Card>
      </PageHeaderWrapper>
    );
  }
}


export default Agency;
