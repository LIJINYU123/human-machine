import React, { Component } from 'react';
import { Descriptions, Card, Badge, Button } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import ItemData from '../../profile/map'
import ProjectManagerProfile from '../../profile/components/ProjectManagerProfile';
import LabelerProfile from '../../profile/components/LabelerProfile';
import InspectorProfile from '../../profile/components/InspectorProfile';
import router from 'umi/router';

const { SuperAdmin, ProjectManage, Labeler, Inspector } = ItemData;

@connect(({ team }) => ({
  userInfo: team.userInfo,
  statistics: team.statistics,
}))
class Profile extends Component {
  state = {
    roleId: '',
    userId: '',
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      userId: location.state.userId,
      roleId: location.state.roleId,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/fetchUserInfo',
      payload: { userId: this.state.userId },
    });

    if (this.state.roleId !== SuperAdmin) {
      dispatch({
        type: 'team/fetchStatistics',
        payload: { userId: this.state.userId, roleId: this.state.roleId },
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

  handleGoBack = () => {
    router.goBack();
  };

  render() {
    const { userInfo } = this.props;
    const action = <Button type="primary" onClick={this.handleGoBack}>返回</Button>;

    return (
      <PageHeaderWrapper
        extra={action}
      >
        <Card bordered={false}>
          <Descriptions title="基本信息" column={2} bordered>
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
