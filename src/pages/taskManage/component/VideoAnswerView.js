import React, { Component, Fragment } from 'react';
import { Button, Card, Descriptions, Input, Row, Col, Form, Radio, Tag, Progress, Select, DatePicker, TimePicker, Tabs, Table, Divider, message } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { connect } from 'dva';
import moment from 'moment';
import FooterToolBar from '../../form/advanced-form/components/FooterToolbar';
import UserInfo from './UserInfo';
import DialogRecord from './DialogRecord';
import SelectUserModalView from './SelectUserModalView';
import TopicCreateModalView from './TopicCreateModalView';
import TopicEditModalView from './TopicEditModalView';
import styles from './style.less';
import ItemData from '../map';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { FieldLabels, Labeler, Inspector } = ItemData;


@connect(({ videoMark }) => ({
  dataId: videoMark.dataId,
  labelData: videoMark.labelData,
  reviewResult: videoMark.reviewResult,
  remark: videoMark.remark,
  schedule: videoMark.schedule,
  videoBasicInfo: videoMark.videoBasicInfo,
  userInfo: videoMark.userInfo,
  dialogRecord: videoMark.dialogRecord,
  topicList: videoMark.topicList,
  receptionEvaluation: videoMark.receptionEvaluation,
}))
class VideoAnswerView extends Component {
  state = {
    basicInfo: undefined,
    roleId: '',
    dataIdQueue: [],
    activeKey: '',
    panes: [],
    records: [],
    topics: [],
    nextUserId: 0,
    nextDialogId: 0,
    width: '100%',
    topic: {},
    topicIndex: 0,
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.basicInfo,
      roleId: location.state.roleId,
    });
  }

  componentDidMount() {
    const { dispatch, form, location } = this.props;
    const { basicInfo, dataIdQueue } = this.state;

    const defaultUserInfo = {
      userId: 1,
      sex: undefined,
      age: undefined,
      appearance: [],
      profession: undefined,
      figure: '',
      entourage: undefined,
      userTag: [],
      visible: false,
      createVisible: false,
      editVisible: false,
    };

    const defaultDialogInfo = {
      dialogId: 1,
      dialogType: '业务',
      customer: '',
      user: '',
      userId: 1,
      emotionTag: [],
      actionTag: [],
      dialogTag: [],
      reverse: false,
    };

    let panes = [{ title: '用户1', content: <UserInfo form={form} user={defaultUserInfo}/>, key: 'user1' }];

    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();

    dispatch({
      type: 'videoMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        dataId: location.state.dataId,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { dataId, userInfo, dialogRecord, topicList } = this.props;
        dataIdQueue.push(dataId);

        if (userInfo.length) {
          panes = userInfo.map(user => ({ title: `用户${user.userId}`, content: <UserInfo form={form} user={user}/>, key: `user${user.userId}` }));
        }

        this.setState({
          panes,
          records: dialogRecord.length ? dialogRecord : [defaultDialogInfo],
          topics: topicList,
          activeKey: userInfo.length ? `user${userInfo.slice(-1)[0].userId}` : 'user1',
          dataIdQueue,
          nextUserId: userInfo.length ? userInfo.slice(-1)[0].userId + 1 : 2,
          nextDialogId: dialogRecord.length ? dialogRecord.slice(-1)[0].dialogId + 1 : 2,
        });
      },
    });
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];

      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  handleGoBack = () => {
    this.setState({
      dataIdQueue: [],
    });
    router.goBack();
  };

  onEditTab = (targetKey, action) => {
    this[action](targetKey);
  };

  onChange = activeKey => {
    this.setState({ activeKey });
  };

  add = () => {
    const { form } = this.props;
    const { panes, nextUserId } = this.state;

    const defaultUserInfo = {
      userId: nextUserId,
      sex: undefined,
      age: undefined,
      appearance: [],
      profession: undefined,
      figure: '',
      entourage: undefined,
      userTag: [],
      visible: false,
      createVisible: false,
      editVisible: false,
    };

    panes.push({ title: `用户${nextUserId}`, content: <UserInfo form={form} user={defaultUserInfo}/>, key: `user${nextUserId}` });

    this.setState({
      panes,
      activeKey: `user${nextUserId}`,
      nextUserId: nextUserId + 1,
    });
  };

  remove = targetKey => {
    let { activeKey } = this.state;

    const filterRecords = this.state.records.filter(item => item.userId === parseInt(targetKey.replace('user', ''), 0));
    if (filterRecords.length) {
       message.error('该用户存在对话记录，无法删除！');
    } else {
      let lastIndex = 0;
      this.state.panes.forEach((pane, index) => {
        if (pane.key === targetKey) {
          lastIndex = index - 1;
        }
      });

      const panes = this.state.panes.filter(pane => pane.key !== targetKey);
      if (panes.length && activeKey === targetKey) {
        if (lastIndex >= 0) {
          activeKey = panes[lastIndex].key;
        } else {
          activeKey = panes[0].key;
        }
      }

      this.setState({ panes, activeKey });
    }
  };

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  showCreateModal = () => {
    this.setState({
      createVisible: true,
    });
  };

  onCloseCreateModal = () => {
    this.setState({
      createVisible: false,
    });
  };

  showEditModal = (topic, index) => {
    this.setState({
      editVisible: true,
      topic,
      topicIndex: index,
    });
  };

  onCloseEditModal = () => {
    this.setState({
      editVisible: false,
    });
  };

  handleAddDialog = userId => {
    const { records, nextDialogId } = this.state;
    const defaultDialogInfo = {
      dialogId: nextDialogId,
      dialogType: '业务',
      customer: '',
      user: '',
      userId,
      emotionTag: [],
      actionTag: [],
      dialogTag: [],
      reverse: false,
    };

    records.push(defaultDialogInfo);
    this.setState({
      records,
      nextDialogId: nextDialogId + 1,
    });
  };

  handleDeleteDialog = index => {
    const { records, topics } = this.state;
    topics.forEach(topic => {
      if (index < topic.startIndex) {
        topic.startIndex -= 1;
        topic.endIndex -= 1;
      } else if (index >= topic.startIndex && index <= topic.endIndex) {
        topic.endIndex -= 1;
      }
    });

    records.splice(index, 1);
    this.setState({
      records,
      topics,
    });
  };

  handleAddTopic = topic => {
    const { topics } = this.state;
    topics.push(topic);
    this.setState({
      topics,
    });
  };

  handleEditTopic = (topic, index) => {
    const { topics } = this.state;
    topics.splice(index, 1, topic);
    this.setState({
      topics,
    });
  };

  handleDeleteTopic = index => {
    const { topics } = this.state;
    topics.splice(index, 1);
    this.setState({
      topics,
    });
  };

  handleNextQuestion = () => {
    const { basicInfo, dataIdQueue, topics } = this.state;
    const { dispatch, dataId, form: { validateFieldsAndScroll } } = this.props;

    validateFieldsAndScroll((errors, values) => {
      if (!errors) {
        let nextDataId = '';
        const currentIndex = dataIdQueue.indexOf(dataId);
        if (currentIndex !== -1 && currentIndex < dataIdQueue.length - 1) {
          nextDataId = dataIdQueue[currentIndex + 1]
        }

        const { videoBasicInfo, dialogRecord, userInfo, receptionEvaluation, ...rest } = values;
        videoBasicInfo.dialogTime = [videoBasicInfo.dialogTime[0].format('YYYY-MM-DD HH:mm:ss'), videoBasicInfo.dialogTime[1].format('YYYY-MM-DD HH:mm:ss')];
        videoBasicInfo.receptionCostTime = videoBasicInfo.receptionCostTime.format('HH:mm');

        dispatch({
          type: 'videoMark/fetchNext',
          payload: {
            projectId: basicInfo.projectId,
            taskId: basicInfo.taskId,
            dataId,
            reviewRounds: basicInfo.rejectTime + 1,
            nextDataId,
            labelResult: [{
              videoBasicInfo,
              dialogRecord: dialogRecord.filter(item => item && item.hasOwnProperty('user')),
              userInfo: userInfo.filter(item => item && item.hasOwnProperty('age')),
              topicList: topics,
              receptionEvaluation,
            }],
            ...rest,
          },
          callback: () => {
            // eslint-disable-next-line no-shadow
            const { dataId, userInfo, dialogRecord, topicList, form } = this.props;

            if (!dataIdQueue.includes(dataId) && dataId !== '') {
              dataIdQueue.push(dataId);
            }

            form.resetFields();

            const defaultUserInfo = {
              userId: 1,
              sex: undefined,
              age: undefined,
              appearance: [],
              profession: undefined,
              figure: '',
              entourage: undefined,
              userTag: [],
              visible: false,
              createVisible: false,
              editVisible: false,
            };

            const defaultDialogInfo = {
              dialogId: 1,
              dialogType: '业务',
              customer: '',
              user: '',
              userId: 1,
              emotionTag: [],
              actionTag: [],
              dialogTag: [],
              reverse: false,
            };

            let panes = [{ title: '用户1', content: <UserInfo form={form} user={defaultUserInfo}/>, key: 'user1' }];

            if (userInfo.length) {
              panes = userInfo.map(user => ({ title: `用户${user.userId}`, content: <UserInfo form={form} user={user}/>, key: `user${user.userId}` }));
            }

            this.setState({
              panes,
              records: dialogRecord.length ? dialogRecord : [defaultDialogInfo],
              topics: topicList,
              activeKey: userInfo.length ? `user${userInfo.slice(-1)[0].userId}` : 'user1',
              dataIdQueue,
              nextUserId: userInfo.length ? userInfo.slice(-1)[0].userId + 1 : 2,
              nextDialogId: dialogRecord.length ? dialogRecord.slice(-1)[0].dialogId + 1 : 2,
            });
          },
        });
      }
    });
  };

  handlePrevQuestion = () => {
    const { basicInfo, dataIdQueue } = this.state;
    const { dispatch, dataId } = this.props;
    let prevDataId = '';
    const currentIndex = dataIdQueue.indexOf(dataId);
    if (currentIndex !== -1 && currentIndex !== 0) {
      prevDataId = dataIdQueue[currentIndex - 1];
    }

    dispatch({
      type: 'videoMark/fetchPrev',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        prevDataId,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { userInfo, dialogRecord, topicList, form } = this.props;

        const defaultUserInfo = {
          userId: 1,
          sex: undefined,
          age: undefined,
          appearance: [],
          profession: undefined,
          figure: '',
          entourage: undefined,
          userTag: [],
          visible: false,
          createVisible: false,
          editVisible: false,
        };

        let panes = [{ title: '用户1', content: <UserInfo form={form} user={defaultUserInfo} />, key: 'user1' }];
        if (userInfo.length) {
          panes = userInfo.map(user => ({ title: `用户${user.userId}`, content: <UserInfo form={form} user={user} userId={user.userId}/>, key: `user${user.userId}` }));
        }

        this.setState({
          panes,
          records: dialogRecord,
          topics: topicList,
          activeKey: userInfo.length ? `user${userInfo[0].userId}` : 'user1',
          dataIdQueue,
          nextUserId: userInfo.length ? userInfo.slice(-1)[0].userId + 1 : 2,
          nextDialogId: dialogRecord.length ? dialogRecord.slice(-1)[0].dialogId + 1 : 2,
        });

        if (!dataIdQueue.includes(dataId) && dataId !== '') {
          dataIdQueue.push(dataId);
        }
      },
    });
  };

  submitReview = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'videoMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'review' },
      callback: () => {
        router.push({
          pathname: '/task-manage/my-task',
          state: {
            status: roleId === 'labeler' ? 'labeling,reject' : 'review',
          },
        });
      },
    });
  };

  submitComplete = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'videoMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'complete' },
      callback: () => {
        router.push({
          pathname: '/task-manage/my-task',
          state: {
            status: roleId === 'labeler' ? 'labeling,reject' : 'review',
          },
        });
      },
    });
  };

  submitReject = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'videoMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'reject' },
      callback: () => {
        router.push({
          pathname: '/task-manage/my-task',
          state: {
            status: roleId === 'labeler' ? 'labeling,reject' : 'review',
          },
        });
      },
    });
  };

  render() {
    const { form: { getFieldDecorator }, schedule, receptionEvaluation, remark, reviewResult, dataId, videoBasicInfo } = this.props;
    const { basicInfo, roleId, dataIdQueue, panes, activeKey, records, topics, width, visible, createVisible, editVisible, topic, topicIndex } = this.state;

    const users = panes.map(pane => ({ userId: parseInt(pane.key.replace('user', ''), 0), userName: pane.title }));

    const action = (
      <Fragment>
        { roleId === 'labeler' && <Button icon="check" onClick={this.submitReview}>提交质检</Button> }
        { roleId === 'inspector' &&
        <Button.Group>
          <Button icon="close" onClick={this.submitReject}>驳回</Button>
          <Button icon="check" onClick={this.submitComplete}>通过</Button>
        </Button.Group>
        }
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleGoBack}>返回</Button>
      </Fragment>
    );

    const extra = (
      <div className={styles.moreInfo}>
        <Progress type="circle" percent={schedule ? schedule.completeRate : 0} width={60} />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={6}>
        <Descriptions.Item label="已答题数">{schedule ? schedule.completeNum : ''}</Descriptions.Item>
        {
          roleId === Labeler &&
          <Fragment>
            <Descriptions.Item label="剩余题数">{schedule ? schedule.restNum : ''}</Descriptions.Item>
            <Descriptions.Item label="无效题数">{schedule ? schedule.invalidNum : ''}</Descriptions.Item>
          </Fragment>
        }
      </Descriptions>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
      },
    };

    const colorGroups = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

    const columns = [
      {
        title: '话题',
        dataIndex: 'topic',
      },
      {
        title: '位置',
        render: (_, record) => `No${record.startIndex + 1}-No${record.endIndex + 1}`,
      },
      {
        title: '话题标签',
        dataIndex: 'tags',
        render: val => val.map((tag, index) => <Tag key={tag} color={colorGroups[index % colorGroups.length]}>{tag}</Tag>),
      },
      {
        title: '操作',
        render: (_, record, index) => (
          <Fragment>
            <a onClick={() => this.showEditModal(record, index)}>编辑</a>
            <Divider type="vertical"/>
            <a onClick={() => this.handleDeleteTopic(index)}>删除</a>
          </Fragment>
        ),
        width: 120,
      },
    ];

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        className={styles.pageHeader}
        extra={action}
        content={description}
        extraContent={extra}
      >
        <Card title="基本信息" bordered={false} className={styles.card}>
          <Form {...formItemLayout}>
            <Row>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.videoNo}>
                  {
                    getFieldDecorator('videoBasicInfo.videoNo', {
                      rules: [{
                        required: true,
                        message: '请输入视频编号',
                      }],
                      initialValue: videoBasicInfo.videoNo,
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.area}>
                  {
                    getFieldDecorator('videoBasicInfo.area', {
                      rules: [
                        {
                          required: true,
                          message: '请输入地区',
                        },
                      ],
                      initialValue: videoBasicInfo.area,
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.outlet}>
                  {
                    getFieldDecorator('videoBasicInfo.outlet', {
                      rules: [
                        {
                          required: true,
                          message: '请输入网点',
                        },
                      ],
                      initialValue: videoBasicInfo.outlet,
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.receptionPerson}>
                  {
                    getFieldDecorator('videoBasicInfo.receptionPerson', {
                      rules: [
                        {
                          required: true,
                          message: '请输入接待人员',
                        },
                      ],
                      initialValue: videoBasicInfo.receptionPerson,
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.dialogTime}>
                  {
                    getFieldDecorator('videoBasicInfo.dialogTime', {
                      rules: [
                        {
                          required: true,
                          message: '请输入对话时间',
                        },
                      ],
                      initialValue: videoBasicInfo.hasOwnProperty('dialogTime') ? [moment(videoBasicInfo.dialogTime[0], 'YYYY-MM-DD HH:mm'), moment(videoBasicInfo.dialogTime[1], 'YYYY-MM-DD HH:mm')] : [],
                    })(<RangePicker allowClear={false} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.receptionCostTime}>
                  {
                    getFieldDecorator('videoBasicInfo.receptionCostTime', {
                      rules: [
                        {
                          required: true,
                          message: '请输入接待时长',
                        },
                      ],
                      initialValue: videoBasicInfo.hasOwnProperty('receptionCostTime') ? moment(videoBasicInfo.receptionCostTime, 'HH:mm') : undefined,
                    })(<TimePicker format="HH:mm" style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.dialogScene}>
                  {
                    getFieldDecorator('videoBasicInfo.dialogScene', {
                      rules: [
                        {
                          required: true,
                          message: '请输入对话场景',
                        },
                      ],
                      initialValue: videoBasicInfo.dialogScene,
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.dialogTarget}>
                  {
                    getFieldDecorator('videoBasicInfo.dialogTarget', {
                      rules: [
                        {
                          required: true,
                          message: '请输入对话目的',
                        },
                      ],
                      initialValue: videoBasicInfo.dialogTarget,
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.remark}>
                  {
                    getFieldDecorator('videoBasicInfo.videoRemark', {
                      initialValue: videoBasicInfo.videoRemark,
                    })(<TextArea autoSize/>)
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false} title="用户信息" className={styles.card}>
          {
            <Tabs type="editable-card" onEdit={this.onEditTab} onChange={this.onChange} activeKey={activeKey}>
              {panes.map(pane => (<TabPane tab={pane.title} key={pane.key} forceRender>{pane.content}</TabPane>))}
            </Tabs>
          }
        </Card>
        <Card bordered={false} title="对话记录">
          <Row gutter={16}>
            <Col span={16}>
              {records.map((record, index) => <DialogRecord form={this.props.form} dialog={record} index={index} onDelete={() => this.handleDeleteDialog(index)} key={record.dialogId}/>)}
            </Col>
            <Col span={8}>
              <Table
                columns={columns}
                dataSource={topics}
                pagination={false}
                bordered
              />
              <Button type="primary" style={{ marginTop: '16px' }} onClick={this.showCreateModal}>关联话题</Button>
            </Col>
          </Row>
          <Row gutter={[16, 32]}>
            <Col>
              <Button type="primary" icon="plus" onClick={this.showModal}>问答对</Button>
            </Col>
          </Row>
          <Row gutter={[16, 32]}>
            <Col>
              <Button onClick={this.handlePrevQuestion} disabled={dataIdQueue.length === 0 || dataIdQueue.indexOf(dataId) === 0}>上一题</Button>
              <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleNextQuestion}>下一题</Button>
            </Col>
          </Row>
        </Card>
        <SelectUserModalView users={users} visible={visible} onClose={this.onClose} onConfirm={this.handleAddDialog}/>
        <TopicCreateModalView records={records} visible={createVisible} onClose={this.onCloseCreateModal} onConfirm={this.handleAddTopic}/>
        <TopicEditModalView records={records} topic={topic} index={topicIndex} visible={editVisible} onClose={this.onCloseEditModal} onConfirm={this.handleEditTopic} />
        <FooterToolBar style={{ width }} className={styles.footerForm}>
          <Form {...formItemLayout}>
            <Row style={{ marginTop: '12px' }} gutter={16}>
              <Col span={8}>
                <Form.Item label={FieldLabels.receptionEvaluation}>
                  {
                    getFieldDecorator('receptionEvaluation', {
                      initialValue: receptionEvaluation,
                    })(<TextArea rows={1}/>)
                  }
                </Form.Item>
              </Col>
              {
                roleId === Inspector &&
                <Col span={8}>
                  <Form.Item label={FieldLabels.remark}>
                    {
                      getFieldDecorator('remark', {
                        initialValue: remark,
                      })(<TextArea rows={1}/>)
                    }
                  </Form.Item>
                </Col>
              }
              {
                roleId === Inspector &&
                <Col span={8}>
                  <Form.Item label={FieldLabels.reviewResult}>
                    {
                      getFieldDecorator('reviewResult', {
                        initialValue: reviewResult,
                      })(
                        <Radio.Group>
                          <Radio.Button value="approve">通过</Radio.Button>
                          <Radio.Button value="reject">拒绝</Radio.Button>
                        </Radio.Group>)
                    }
                  </Form.Item>
                </Col>
              }
            </Row>
          </Form>
        </FooterToolBar>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(VideoAnswerView);
