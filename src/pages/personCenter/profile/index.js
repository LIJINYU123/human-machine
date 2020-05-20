import React, { Component, Fragment } from 'react';
import { Descriptions, Card, Badge, Button } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ItemData from './map'
import ProjectManagerProfile from './components/ProjectManagerProfile';
import LabelerProfile from './components/LabelerProfile';
import InspectorProfile from './components/InspectorProfile';

const { SuperAdmin, ProjectManage, Labeler, Inspector } = ItemData;

@connect(({ profile }) => ({
  userInfo: profile.userInfo,
  statistics: profile.statistics,
}))
class Profile extends Component {
  state = {
    roleId: '',
  };

  componentWillMount() {
    const roleId = localStorage.getItem('RoleID');
    this.setState({
      roleId,
    });
  }

  componentDidMount() {
    const userId = localStorage.getItem('UserID');
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchUserInfo',
      payload: { userId },
    });

    if (this.state.roleId !== SuperAdmin) {
      dispatch({
        type: 'profile/fetchStatistics',
        payload: { userId },
      });
    }
  }

  renderStatistics = () => {
    const { statistics } = this.props;
    const { roleId } = this.state;
    if (roleId === ProjectManage) {
      return <ProjectManagerProfile statistics={statistics} />;
    }

    if (roleId === Labeler) {
      return <LabelerProfile statistics={statistics}/>;
    }

    if (roleId === Inspector) {
      return <InspectorProfile statistics={statistics} />
    }

    return null;
  };

  render() {
    const { userInfo } = this.props;

    const titleComponent = (
      <Fragment>
        <span>基本信息</span>
        <Button type="primary" style={{ float: 'right' }}>编辑</Button>
      </Fragment>
    );

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <Descriptions title={titleComponent} column={2} bordered>
            <Descriptions.Item label="用户名">{userInfo.userId}</Descriptions.Item>
            <Descriptions.Item label="角色">{userInfo.roleName}</Descriptions.Item>
            <Descriptions.Item label="昵称">{userInfo.userName}</Descriptions.Item>
            <Descriptions.Item label="状态"><Badge status={userInfo.status === 'active' ? 'success' : 'error'} text={userInfo.status === 'active' ? '已启用' : '已停用'}/></Descriptions.Item>
          </Descriptions>
          {
            this.renderStatistics()
          }
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Profile;
