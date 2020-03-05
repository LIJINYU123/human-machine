import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Card,
  Button,
  Descriptions,
  Statistic,
  Badge,
  Divider,
  Popconfirm, Progress, Tooltip,
} from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';
import StandardTable from './StandardTable';

const { statusName, labelTypeName, taskStatusName, taskStatusMap } = ItemData;

const statusFilters = Object.keys(taskStatusName).map(key => ({
  text: taskStatusName[key],
  value: key,
}));

const getValue = obj => (obj ? obj.join(',') : []);

@connect(({ projectDetail, loading }) => ({
  data: projectDetail.data,
  basicInfo: projectDetail.basicInfo,
  loading: loading.effects['projectDetail/fetchDetail'],
}))
class ProjectDetail extends Component {
  state = {
    projectId: undefined,
    selectedRows: [],
    filteredInfo: {},
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'projectDetail/fetchDetail',
      payload: location.state.projectId,
    });

    dispatch({
      type: 'projectDetail/fetchTaskData',
      payload: { projectId: location.state.projectId },
    });

    this.setState({
      projectId: location.state.projectId,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch } = this.props;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      projectId: this.state.projectId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'projectDetail/fetchTaskData',
      payload: params,
    });
  };

  handleDelete = taskInfo => {
    const { dispatch } = this.props;
    const { projectId } = this.state;
    dispatch({
      type: 'projectDetail/deleteTaskData',
      payload: {
        projectId,
        taskIds: [taskInfo.taskId],
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { projectId, selectedRows } = this.state;
    dispatch({
      type: 'projectDetail/deleteTaskData',
      payload: {
        projectId,
        taskIds: selectedRows.map(row => row.taskId),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleReviewDetails = task => {
    const { projectId } = this.state;
    router.push({
      pathname: '/project/text/task-detail',
      state: {
        taskId: task.taskId,
        projectId,
      },
    });
  };

  render() {
    const { data, basicInfo, loading } = this.props;
    const { selectedRows } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};


    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value={statusName[basicInfo.status]} />
        <Statistic title="标注进度" value={basicInfo.schedule} suffix="%"/>
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="标注类型">{labelTypeName[basicInfo.labelType]}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{basicInfo.createdTime}</Descriptions.Item>
        <Descriptions.Item label="项目周期">{basicInfo.endTime}</Descriptions.Item>
        <Descriptions.Item label="标注员">{basicInfo.labelers ? basicInfo.labelers[0].name : ''}{basicInfo.labelers ? <Tooltip title={basicInfo.labelers.map(labeler => labeler.name).join('，')}>...</Tooltip> : ''}</Descriptions.Item>
        <Descriptions.Item label="质检员">{basicInfo.inspectors ? basicInfo.inspectors[0].name : ''}{basicInfo.inspectors ? <Tooltip title={basicInfo.inspectors.map(inspector => inspector.name).join('，')}>...</Tooltip> : ''}</Descriptions.Item>
        <Descriptions.Item label="标注工具">{basicInfo.markTool ? basicInfo.markTool.map(item => item.toolName).join('，') : ''}</Descriptions.Item>
        <Descriptions.Item label="合格率">{basicInfo.passRate}%</Descriptions.Item>
        <Descriptions.Item label="质检率" span={2}>{basicInfo.checkRate}%</Descriptions.Item>
        <Descriptions.Item label="项目描述">{basicInfo.description}</Descriptions.Item>
      </Descriptions>
    );

    const action = (
      <Fragment>
        <Button>编辑</Button>
        <Link to="/project">
          <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
        </Link>
      </Fragment>
    );

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '标注员',
        dataIndex: 'labelerName',
      },
      {
        title: '质检员',
        dataIndex: 'inspectorName',
      },
      {
        title: '标注进度',
        dataIndex: 'schedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '任务状态',
        dataIndex: 'status',
        filters: statusFilters,
        filteredValue: filteredInfo.status || null,
        render: val => <Badge status={taskStatusMap[val]} text={taskStatusName[val]}/>,
      },
      {
        title: '操作',
        render: (_, task) => (
          <Fragment>
            <a onClick={() => this.handleReviewDetails(task)}>详情</a>
            <Divider type="vertical"/>
            <Popconfirm title="确认删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(task)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper
        title={basicInfo.projectName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card title="任务列表" className={styles.card} bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleBatchDelete}>删除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ProjectDetail;
