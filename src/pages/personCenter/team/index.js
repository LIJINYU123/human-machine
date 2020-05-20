import React, { Component } from 'react';
import { Card, Table } from 'antd';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';

@connect(({ team }) => ({
  projectManagers: team.projectManagers,
  labelers: team.labelers,
  inspectors: team.inspectors,
}))
class Team extends Component {
  state = {
    activeTabKey: 'projectManager',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'team/fetchTeamInfo',
    });
  }

  handleTabChange = key => {
    this.setState({
      activeTabKey: key,
    });
  };

  jumpToMemberProfile = (userId, tabKey) => {
    router.push({
      pathname: '/person/team/member',
      state: { userId, roleId: tabKey },
    });
  };

  renderTable = tabKey => {
    const { projectManagers, labelers, inspectors } = this.props;
    let columns = [
      {
        title: '用户名',
        dataIndex: 'userId',
        render: val => <a onClick={() => this.jumpToMemberProfile(val, tabKey)}>{val}</a>,
      },
      {
        title: '昵称',
        dataIndex: 'userName',
      },
    ];
    let dataSource = [];
    if (tabKey === 'projectManager') {
      columns = columns.concat(
        [
          {
            title: '负责项目数',
            dataIndex: 'ownProjectNum',
            sorter: (a, b) => a.ownProjectNum - b.ownProjectNum,
          },
          {
            title: '延期项目数',
            dataIndex: 'delayProjectNum',
            sorter: (a, b) => a.delayProjectNum - b.delayProjectNum,
          },
          {
            title: '延期率',
            dataIndex: 'delayRate',
            render: val => `${val}%`,
            sorter: (a, b) => a.delayRate - b.delayRate,
          },
        ]);
      dataSource = projectManagers;
    } else if (tabKey === 'labeler') {
      columns = columns.concat(
        [
          {
            title: '参与项目数',
            dataIndex: 'involvedProjectNum',
            sorter: (a, b) => a.involvedProjectNum - b.involvedProjectNum,
          },
          {
            title: '参与任务数',
            dataIndex: 'completeTaskNum',
            sorter: (a, b) => a.completeTaskNum - b.completeTaskNum,
          },
          {
            title: '退回任务数',
            dataIndex: 'rejectTaskNum',
            sorter: (a, b) => a.rejectTaskNum - b.rejectTaskNum,
          },
          {
            title: '退回率',
            dataIndex: 'rejectRate',
            render: val => `${val}%`,
            sorter: (a, b) => a.rejectRate - b.rejectRate,
          },
          {
            title: '平均退回次数',
            dataIndex: 'averageRejectTime',
            sorter: (a, b) => a.averageRejectTime - b.averageRejectTime,
          },
        ],
      );
      dataSource = labelers;
    } else {
      columns = columns.concat(
        [
          {
            title: '参与项目数',
            dataIndex: 'involvedProjectNum',
            sorter: (a, b) => a.involvedProjectNum - b.involvedProjectNum,
          },
          {
            title: '质检任务数',
            dataIndex: 'completeTaskNum',
            sorter: (a, b) => a.completeTaskNum - b.completeTaskNum,
          },
          {
            title: '要求质检比例(均)',
            dataIndex: 'requireCheckRate',
            render: val => `${val}%`,
            sorter: (a, b) => a.requireCheckRate - b.requireCheckRate,
          },
          {
            title: '实际质检比例(均)',
            dataIndex: 'actualCheckRate',
            render: val => `${val}%`,
            sorter: (a, b) => a.actualCheckRate - b.actualCheckRate,
          },
        ],
      );
      dataSource = inspectors;
    }

    return <Table columns={columns} dataSource={dataSource} pagination={{ showSizeChanger: true, showQuickJumper: true }} />
  };

  render() {
    const tabList = [
      {
        key: 'projectManager',
        tab: '项目管理员',
      },
      {
        key: 'labeler',
        tab: '标注员',
      },
      {
        key: 'inspector',
        tab: '质检员',
      },
    ];
    const { activeTabKey } = this.state;

    return (
      <PageHeaderWrapper
        tabList={tabList}
        tabActiveKey={activeTabKey}
        onTabChange={this.handleTabChange}
      >
        <Card bordered={false}>
          {
            this.renderTable(activeTabKey)
          }
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Team;
