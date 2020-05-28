import React, { Component, Fragment } from 'react';
import { Descriptions, Card, Badge, Button } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ItemData from './map'
import UserModifyView from './components/UserModifyView';
import ProjectManagerProfile from './components/ProjectManagerProfile';
import LabelerProfile from './components/LabelerProfile';
import InspectorProfile from './components/InspectorProfile';

const { SuperAdmin, DepAdmin, ProjectManage, Labeler, Inspector } = ItemData;

@connect(({ profile }) => ({
  userInfo: profile.userInfo,
  statistics: profile.statistics,
}))
class Profile extends Component {
  state = {
    roleId: '',
    visible: false,
  };

  componentWillMount() {
    const roleId = localStorage.getItem('RoleID');
    this.setState({
      roleId,
    });
  }

  componentDidMount() {
    const userId = localStorage.getItem('UserID');
    const roleId = localStorage.getItem('RoleID');
    const { dispatch } = this.props;
    dispatch({
      type: 'profile/fetchUserInfo',
      payload: { userId },
    });

    if (this.state.roleId !== SuperAdmin && this.state.roleId !== DepAdmin) {
      dispatch({
        type: 'profile/fetchStatistics',
        payload: { userId, roleId },
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

  handleModify = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const { userInfo } = this.props;
    const { visible } = this.state;

    const titleComponent = (
      <Fragment>
        <span>基本信息</span>
        <Button type="primary" style={{ float: 'right' }} onClick={this.handleModify}>编辑</Button>
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
          <UserModifyView userInfo={userInfo} visible={visible} onCancel={this.handleCancel}/>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Profile;
