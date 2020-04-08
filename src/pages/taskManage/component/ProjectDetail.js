import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Descriptions, Row, Col } from 'antd/lib/index';
import StandardTable from './StandardTable';
import styles from './style.less';
import ItemData from '../map';
import Link from 'umi/link';
import { connect } from 'dva/index';
import router from 'umi/router';

const { labelTypeName } = ItemData;

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
  };

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

    dispatch({
      type: 'detail/fetchTaskNumber',
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

  handleReceiveTask = task => {
    const { dispatch } = this.props;
    dispatch({
      type: 'detail/receiveTask',
      payload: task.taskId,
      callback: () => {
        dispatch({
          type: 'detail/fetchTaskNumber',
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

  render() {
    const { data, basicInfo, inProgressNum, loading } = this.props;
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
      <Link to="/task-manage">
        <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
      </Link>
    );

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '操作',
        render: (val, record) => <a>标注</a>,
      },
    ];

    const Info = ({ title, value, onClick, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p><a onClick={onClick}>{value}</a></p>
        {bordered && <em />}
      </div>
    );

    const extraContent = <Button type="primary">领取新任务</Button>;

    return (
      <PageHeaderWrapper
        title={basicInfo.projectName}
        extra={action}
        className={styles.pageHeader}
        content={description}
      >
        <div className={styles.standardList}>
          <Card className={styles.card} bordered={false}>
            <Row>
              <Col sm={24} xs={24}>
                <Info title="我的待办" value={`${inProgressNum}个任务`} onClick={this.handleJumptoInProgress} bordered />
              </Col>
            </Row>
          </Card>
          <Card title="任务列表" bordered={false} extra={extraContent}>
            <StandardTable
              rowKey="taskId"
              loading={loading}
              data={data}
              columns={columns}
              onChange={this.handleStandardTableChange}
            />
          </Card>
        </div>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetail;