import React, { Component, Fragment } from 'react';
import { Button, Card, Progress, Badge, Modal, Divider, Popconfirm, message } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import StandardTable from './StandardTable';
import ItemData from '../map';
import styles from './style.less';

const { taskStatusName, taskStatusMap } = ItemData;

const statusFilters = Object.keys(taskStatusName).map(key => ({
  text: taskStatusName[key],
  value: key,
}));

const { confirm } = Modal;

const getValue = obj => (obj ? obj.join(',') : []);

@connect(({ projectDetail, loading }) => ({
  data: projectDetail.data,
  basicInfo: projectDetail.basicInfo,
  loading: loading.effects['projectDetail/fetchTaskData'],
}))
class TaskList extends Component {
  state = {
    selectedRows: [],
    filteredInfo: {},
  };

  componentDidMount() {
    const { dispatch, projectId, labelerId, inspectorId } = this.props;

    const params = { projectId };
    if (labelerId !== '') {
      params.labelerId = labelerId;
      this.setState({
        filteredInfo: { labelerId: [labelerId] },
      });
    } else if (inspectorId !== '') {
      params.inspectorId = inspectorId;
      this.setState({
        filteredInfo: { inspectorId: [inspectorId] },
      });
    }

    dispatch({
      type: 'projectDetail/fetchTaskData',
      payload: params,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch, projectId } = this.props;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      projectId,
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
    const { dispatch, projectId } = this.props;

    if (taskInfo.status !== 'initial') {
      message.error(`任务状态：${taskStatusName[taskInfo.status]}，无法删除！`);
    } else {
      dispatch({
        type: 'projectDetail/deleteTaskData',
        payload: {
          projectId,
          taskIds: [taskInfo.taskId],
        },
        callback: () => {
          dispatch({
            type: 'projectDetail/fetchTaskData',
            payload: { projectId },
          });
        },
      });
    }
  };

  handleBatchDelete = () => {
    const { dispatch, projectId } = this.props;
    const { selectedRows } = this.state;

    if (selectedRows.filter(row => row.status !== 'initial').length) {
      message.error('批量删除失败，只能删除未开始状态的任务！')
    } else {
      dispatch({
        type: 'projectDetail/deleteTaskData',
        payload: {
          projectId,
          taskIds: selectedRows.map(row => row.taskId),
        },
        callback: () => {
          dispatch({
            type: 'projectDetail/fetchTaskData',
            payload: { projectId },
          });
          this.setState({
            selectedRows: [],
          });
        },
      });
    }
  };

  showDeleteConfirm = () => {
    confirm({
      title: '确认删除这些任务吗？',
      okText: '删除',
      okType: 'danger',
      cancelText: '取消',
      onOk: this.handleBatchDelete,
    });
  };

  handleReviewDetails = task => {
    router.push({
      pathname: '/project/task-detail',
      state: {
        taskId: task.taskId,
      },
    });
  };

  render() {
    const { data, basicInfo, loading } = this.props;
    const { selectedRows } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const labelerFilters = Object.keys(basicInfo).length ? basicInfo.labelers.map(labeler => ({
      text: labeler.userName,
      value: labeler.userId,
    })) : [];

    // eslint-disable-next-line max-len
    const inspectorFilters = Object.keys(basicInfo).length ? basicInfo.inspectors.map(inspector => ({
      text: inspector.userName,
      value: inspector.userId,
    })) : [];

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '标注员',
        dataIndex: 'labelerId',
        render: (_, record) => record.labelerName,
        filters: labelerFilters,
        filteredValue: filteredInfo.labelerId || null,
      },
      {
        title: '质检员',
        dataIndex: 'inspectorId',
        render: (_, record) => record.inspectorName,
        filters: inspectorFilters,
        filteredValue: filteredInfo.inspectorId || null,
      },
      {
        title: '标注进度',
        dataIndex: 'labelSchedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '质检进度',
        dataIndex: 'reviewSchedule',
        render: val => (val !== 100 ? <Progress percent={val} size="small" status="active"/> : <Progress percent={val} size="small"/>),
      },
      {
        title: '剩余标注数',
        dataIndex: 'restLabelNum',
      },
      {
        title: '已标注数',
        dataIndex: 'completeLabelNum',
      },
      {
        title: '无效题数',
        dataIndex: 'invalidNum',
      },
      {
        title: '质检数',
        dataIndex: 'reviewNum',
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
            <Popconfirm title="确认删除吗？" placement="top" okText="删除" cancelText="取消" onConfirm={() => this.handleDelete(task)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <Card className={styles.card} bordered={false}>
        <div style={{ marginBottom: '16px' }}>
          <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.showDeleteConfirm}>删除</Button>
        </div>
        <StandardTable
          rowKey="taskId"
          selectedRows={selectedRows}
          loading={loading}
          data={data}
          columns={columns}
          onSelectRow={this.handleSelectRows}
          onChange={this.handleStandardTableChange}
        />
      </Card>
    );
  }
}


export default TaskList;
