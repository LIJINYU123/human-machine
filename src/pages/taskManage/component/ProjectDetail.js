import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Descriptions, Progress, Badge } from 'antd/lib/index';
import StandardTable from './StandardTable';
import styles from './style.less';
import { connect } from 'dva/index';
import router from 'umi/router';
import ItemData from '../map';

const { taskStatusMap, taskStatusName, labelTypeName } = ItemData;

@connect(({ detail, loading }) => ({
  data: detail.data,
  basicInfo: detail.basicInfo,
  inProgressNum: detail.inProgressNum,
  completeNum: detail.completeNum,
  loading: loading.effects['detail/fetchDetail'],
}))
class ProjectDetail extends Component {
  state = {
    projectId: undefined,
    roleId: '',
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      roleId: location.state.roleId,
    });
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'detail/fetchDetail',
      payload: location.state.projectId,
    });

    dispatch({
      type: 'detail/fetchTaskData',
      payload: { projectId: location.state.projectId },
    });

    this.setState({
      projectId: location.state.projectId,
    });
  }

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch } = this.props;

    const params = {
      projectId: this.state.projectId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'detail/fetchTaskData',
      payload: params,
    });
  };

  handleReceiveTask = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/receiveTask',
      payload: this.state.projectId,
      callback: () => {
        dispatch({
          type: 'detail/fetchTaskData',
          payload: { projectId: this.state.projectId },
        });
      },
    });
  };

  handleJumptoInProgress = () => {
    router.push({
      pathname: '/task-manage/my-task',
      state: {
        status: 'labeling,reject',
      },
    });
  };

  handleJumptoComplete = () => {
    router.push({
      pathname: '/task-manage/my-task',
      state: {
        status: 'complete',
      },
    });
  };

  handleJumpToMarkView = task => {
    if (task.labelType === 'textClassify') {
      router.push({
        pathname: '/task-manage/my-task/text-mark',
        state: {
          taskInfo: task,
        },
      });
    } else if (task.labelType === 'sequenceLabeling') {
      router.push({
        pathname: '/task-manage/my-task/sequence-mark',
        state: {
          taskInfo: task,
        },
      });
    } else if (task.labelType === 'textExtension') {
      router.push({
        pathname: '/task-manage/my-task/extension-mark',
        state: {
          taskInfo: task,
        },
      });
    }
  };

  handleGoback = () => {
    router.goBack()
  };

  render() {
    const { data, basicInfo, loading } = this.props;
    const { roleId } = this.state;
    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="标注类型">{labelTypeName[basicInfo.labelType]}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{basicInfo.createdTime}</Descriptions.Item>
        <Descriptions.Item label="项目周期">{basicInfo.endTime}</Descriptions.Item>
        <Descriptions.Item label="标注工具">{basicInfo.markTool ? basicInfo.markTool.toolName : ''}</Descriptions.Item>
        <Descriptions.Item label="合格率">{basicInfo.passRate}%</Descriptions.Item>
        <Descriptions.Item label="质检率">{basicInfo.checkRate}%</Descriptions.Item>
        <Descriptions.Item label="项目描述">{basicInfo.description}</Descriptions.Item>
      </Descriptions>
    );

    const action = (
      <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleGoback}>返回</Button>
    );

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '题数',
        dataIndex: 'questionNum',
      },
      {
        title: roleId === 'labeler' ? '标注进度' : '质检进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        render: val => <Badge status={taskStatusMap[val]} text={taskStatusName[val]}/>,
      },
      {
        title: '领取时间',
        dataIndex: 'receiveTime',
      },
      {
        title: '操作',
        render: (_, task) => <a onClick={() => this.handleJumpToMarkView(task)}>{roleId === 'labeler' ? '标注' : '质检'}</a>,
      },
    ];

    const Info = ({ title, value, onClick, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p><a onClick={onClick}>{value}</a></p>
        {bordered && <em />}
      </div>
    );

    const extraContent = <Button type="primary" disabled={data.list.length} onClick={this.handleReceiveTask}>领取新任务</Button>;

    return (
      <PageHeaderWrapper
        title={basicInfo.projectName}
        extra={action}
        className={styles.pageHeader}
        content={description}
      >
        <Card title="任务列表" bordered={false} extra={extraContent}>
          <StandardTable
            rowKey="taskId"
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetail;
