import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Col,
  Descriptions,
  Divider, Input,
  Switch,
  Popover,
  Radio,
  Row,
  Statistic,
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './StandardTable';
import styles from './style.less';
import ItemData from '../map';
import router from 'umi/router';
import { connect } from 'dva/index';

const { Meta } = Card;
const { labelTypeName, taskStatusName, reviewLabel, labelResult, Labeler, Inspector, Labeling, Reject, Review } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const reviewFilters = Object.keys(reviewLabel).map(key => ({
  text: reviewLabel[key],
  value: key,
}));

const labelResultFilters = Object.keys(labelResult).map(key => ({
  text: labelResult[key],
  value: key,
}));

@connect(({ imageMark, loading }) => ({
  data: imageMark.data,
  checkRate: imageMark.checkRate,
  passRate: imageMark.passRate,
  markTool: imageMark.markTool,
  schedule: imageMark.schedule,
  loading: loading.effects['imageMark/fetchLabelData'],
}))
class ImageMarkView extends Component {
  state = {
    basicInfo: undefined,
    filteredInfo: {},
    pagination: {},
    remarkPopoverVisible: {},
    inputValue: '',
    roleId: '',
  };

  componentWillMount() {
    const { location, dispatch, schedule } = this.props;
    const roleId = localStorage.getItem('RoleID');
    this.setState({
      basicInfo: location.state.taskInfo,
      roleId,
    });

    if (schedule === 0) {
      dispatch({
        type: 'imageMark/updateSchedule',
        payload: { schedule: location.state.taskInfo.schedule },
      });
    }
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'imageMark/fetchLabelData',
      payload: { taskId: basicInfo.taskId },
    });
    dispatch({
      type: 'imageMark/fetchMarkTool',
      payload: { projectId: basicInfo.projectId },
    });
  }

  handleGoBack = () => {
    // 更新schedule
    const { dispatch } = this.props;
    dispatch({
      type: 'imageMark/updateSchedule',
      payload: { schedule: 0 },
    });

    router.goBack();
  };

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch } = this.props;
    this.setState({
      filteredInfo: filterArg,
      pagination,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      taskId: this.state.basicInfo.taskId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'imageMark/fetchLabelData',
      payload: params,
    });
  };

  // 处理质检通过或者拒绝的处理函数
  handleApproveOperate = (dataId, taskId, remark) => {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'imageMark/saveReviewResult',
      payload: { dataId, taskId, result: { reviewResult: 'approve', remark }, reviewRounds: basicInfo.rejectTime + 1 },
      callback: () => {
        this.handleRefreshView();
      },
    });
  };

  handleRejectOperate = (dataId, taskId, remark) => {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'imageMark/saveReviewResult',
      payload: { dataId, taskId, result: { reviewResult: 'reject', remark }, reviewRounds: basicInfo.rejectTime + 1 },
      callback: () => {
        this.handleRefreshView();
      },
    });
  };

  handleRemarkPopiverVisible = (dataId, value) => {
    const popoverValue = {};
    popoverValue[`remark${dataId}`] = true;
    this.setState({ remarkPopoverVisible: popoverValue, inputValue: value });
  };

  handleRemarkConfirm = (dataId, taskId, reviewResult) => {
    const { dispatch } = this.props;
    const { inputValue } = this.state;
    dispatch({
      type: 'imageMark/saveReviewResult',
      payload: { dataId, taskId, result: { reviewResult, remark: inputValue } },
      callback: () => {
        this.handleRefreshView();
        this.setState({ remarkPopoverVisible: {} });
      },
    });
  };

  // 备注模态输入框取消处理函数
  handleRemarkCancel = () => {
    this.setState({ remarkPopoverVisible: {} });
  };

  // 备注模态输入框change处理函数
  handleInputChange = event => {
    this.setState({ inputValue: event.target.value });
  };

  // 数据变动，刷新页面处理函数
  handleRefreshView = () => {
    const { dispatch } = this.props;
    const { pagination, basicInfo } = this.state;
    const params = {
      taskId: basicInfo.taskId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'imageMark/fetchLabelData',
      payload: params,
    });
  };

  jumpToAnswerMode = dataId => {
    const { basicInfo, roleId } = this.state;
    const { markTool } = this.props;
    router.push({
      pathname: '/task-manage/my-task/answer-mode/image',
      state: { basicInfo, markTool, roleId, dataId },
    });
  };

  submitReview = () => {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'imageMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'review' },
      callback: () => {
        router.goBack();
      },
    });
  };

  submitComplete = () => {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'imageMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'complete' },
      callback: () => {
        router.goBack();
      },
    });
  };

  submitReject = () => {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'imageMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'reject' },
      callback: () => {
        router.goBack();
      },
    });
  };

  handleSwitchClick = (invalid, record) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'imageMark/saveDataValidity',
      payload: { taskId: this.state.basicInfo.taskId, dataId: record.dataId, invalid: !invalid },
      callback: () => {
        this.handleRefreshView();
      },
    });
  };

  judgeDisabled = (roleId, status) => {
    if (roleId === Labeler) {
      return ![Labeling, Reject].includes(status);
    }

    if (roleId === Inspector) {
      return status !== Review;
    }

    return true;
  };

  judgeDisabled2 = (roleId, status) => {
    if (roleId === Labeler) {
      return ![Labeling, Reject].includes(status);
    }

    return true;
  };

  render() {
    const { basicInfo, remarkPopoverVisible, inputValue, roleId } = this.state;
    const { data, checkRate, passRate, schedule } = this.props;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value={taskStatusName[basicInfo.status]} />
        <Statistic title={roleId === Labeler ? '标注进度' : '质检进度'} value={schedule} suffix="%" />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="所属项目">{basicInfo.projectName}</Descriptions.Item>
        <Descriptions.Item label="标注类型">{labelTypeName[basicInfo.labelType]}</Descriptions.Item>
        <Descriptions.Item label="题数">{basicInfo.questionNum}</Descriptions.Item>
        <Descriptions.Item label="领取时间">{basicInfo.receiveTime}</Descriptions.Item>
      </Descriptions>
    );

    const action = (
      <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleGoBack}>返回</Button>
    );

    const extraContent = (
      <Fragment>
        {
          roleId === Inspector &&
          <Fragment>
            <span style={{ marginRight: '16px' }}>质检率：{`${checkRate}%`}</span>
            <span style={{ marginRight: '16px' }}>合格率：{`${passRate}%`}</span>
          </Fragment>
        }
        <Radio.Group defaultValue="overview" style={{ marginRight: '16px' }}>
          <Radio.Button value="overview">概览模式</Radio.Button>
          <Radio.Button value="focus" onClick={() => this.jumpToAnswerMode('')}>答题模式</Radio.Button>
        </Radio.Group>
        {
          roleId === Labeler && <Button type="primary" icon="check" onClick={this.submitReview} disabled={this.judgeDisabled(roleId, basicInfo.status)}>提交质检</Button>
        }
        {
          roleId === Inspector &&
          <Button.Group>
            <Button icon="close" onClick={this.submitReject} disabled={this.judgeDisabled(roleId, basicInfo.status)}>驳回</Button>
            <Button icon="check" onClick={this.submitComplete} disabled={this.judgeDisabled(roleId, basicInfo.status)}>通过</Button>
          </Button.Group>
        }
      </Fragment>
    );

    const columns = [
      {
        title: '图片名称',
        dataIndex: 'data',
        render: val => val.sentence,
        // render: val => <Popover content={<Card style={{ width: 240 }} cover={<img alt="example" src={val.url} />} hoverable><Meta description="http://10.89.100.14/img/0002fdafdf.png"/></Card>} placement="top"><a>{val.sentence}</a></Popover>,
      },
      {
        title: '标注结果',
        dataIndex: 'labelResult',
        render: (_, record) => <a onClick={() => this.jumpToAnswerMode(record.dataId)}>查看</a>,
        filters: labelResultFilters,
        filteredValue: filteredInfo.labelResult || null,
      },
      {
        title: '数据有效性',
        dataIndex: 'invalid',
        render: (val, record) => <Switch checkedChildren="有效" unCheckedChildren="无效" onClick={() => this.handleSwitchClick(val, record)} checked={!val} disabled={this.judgeDisabled2(roleId, basicInfo.status)}/>,
      },
      {
        title: '质检结果',
        dataIndex: 'reviewResult',
        render: roleId === Inspector && basicInfo.status === Review ? (val, info) => {
          let renderItem;
          if (val === 'approve') {
            renderItem = <span style={{ color: '#52c41a', cursor: 'pointer' }}>{reviewLabel[val]}</span>;
          } else if (val === 'reject') {
            renderItem = <span style={{ color: '#f5222d', cursor: 'pointer' }}>{reviewLabel[val]}</span>;
          } else {
            renderItem = <a>{reviewLabel[val]}</a>;
          }
          return <Popover title="质检" trigger="click" content={<Row>
            <Col sm={10} xs={24}>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <a onClick={() => this.handleApproveOperate(info.dataId, basicInfo.taskId, info.remark)}>通过</a>
              </div>
            </Col>
            <Col sm={2} xs={24}>
              <Divider type="vertical"/>
            </Col>
            <Col sm={10} xs={24}>
              <div style={{ position: 'relative', textAlign: 'center' }}>
                <a onClick={() => this.handleRejectOperate(info.dataId, basicInfo.taskId, info.remark)}>拒绝</a>
              </div>
            </Col>
          </Row>}>{renderItem}</Popover>;
        } : val => reviewLabel[val],
        filters: reviewFilters,
        filteredValue: filteredInfo.reviewResult || null,
      },
      {
        title: '备注',
        dataIndex: 'remark',
        render: roleId === Inspector && basicInfo.status === Review ? (val, info) => {
          let renderItem;
          if (val === '') {
            renderItem = <a>备注</a>;
          } else {
            renderItem = <span style={{ cursor: 'pointer' }}>{val}</span>
          }
          return <Popover visible={remarkPopoverVisible.hasOwnProperty(`remark${info.dataId}`)} title="备注" trigger="click" placement="topRight" overlayStyle={{ minWidth: '450px' }} onVisibleChange={() => this.handleRemarkPopiverVisible(info.dataId, val)} content={
            <Row gutter={16}>
              <Col sm={16}>
                <Input value={inputValue} onChange={this.handleInputChange} onPressEnter={() => this.handleRemarkConfirm(info.dataId, basicInfo.taskId, info.reviewResult)} />
              </Col>
              <Col sm={4}>
                <Button type="primary" onClick={() => this.handleRemarkConfirm(info.dataId, basicInfo.taskId, info.reviewResult)}>确定</Button>
              </Col>
              <Col sm={4}>
                <Button onClick={this.handleRemarkCancel}>取消</Button>
              </Col>
            </Row>
          }>{renderItem}</Popover>
        } : val => val,
      },
    ];

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card title="标注数据" bordered={false} extra={extraContent}>
          <StandardTable
            rowKey="sentence"
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default ImageMarkView;
