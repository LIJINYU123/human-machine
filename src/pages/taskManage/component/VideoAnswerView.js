import React, { Component, Fragment } from 'react';
import { Button, Card, Descriptions, Input, Row, Col, Form, Radio, Tag, Progress, Select, DatePicker, TimePicker, Tabs, Table, Divider } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { connect } from 'dva';
import FooterToolBar from '../../form/advanced-form/components/FooterToolbar';
import UserInfo from './UserInfo';
import DialogRecord from './DialogRecord';
import SelectUserModalView from './SelectUserModalView';
import TopicCreateModalView from './TopicCreateModalView';
import styles from './style.less';
import ItemData from '../map';

const { RangePicker } = DatePicker;
const { TabPane } = Tabs;
const { TextArea } = Input;
const { FieldLabels, Labeler, Inspector } = ItemData;

const defaultUserInfo = {
  sex: undefined,
  age: undefined,
  appearance: [],
  profession: undefined,
  figure: '',
  entourage: undefined,
  userTag: [],
  visible: false,
  createVisible: false,
};

@connect(({ videoMark }) => ({
  dataId: videoMark.dataId,
  labelData: videoMark.labelData,
  labelResult: videoMark.labelResult,
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
    nextUserIndex: 0,
    width: '100%',
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.basicInfo,
      roleId: location.state.roleId,
    });
  }

  componentDidMount() {
    const { dispatch, form } = this.props;
    const { basicInfo, dataIdQueue } = this.state;

    let panes = [{ title: '用户1', content: <UserInfo form={form} user={defaultUserInfo}/>, key: 'user1' }];

    window.addEventListener('resize', this.resizeFooterToolbar, { passive: true });
    this.resizeFooterToolbar();

    dispatch({
      type: 'videoMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
      },
      callback: () => {
        const { dataId, userInfo, dialogRecord, topicList } = this.props;
        dataIdQueue.push(dataId);

        if (userInfo.length) {
          panes = userInfo.map(user => ({ title: `用户${user.userId}`, content: <UserInfo form={form} user={user} userId={user.userId}/>, key: `user${user.userId}` }));
        }

        this.setState({
          panes,
          records: dialogRecord,
          topics: topicList,
          activeKey: 'user1',
          dataIdQueue,
          nextUserIndex: userInfo.length ? userInfo.slice(-1)[0].userId + 1 : 2,
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
    const { dispatch, form } = this.props;
    const { panes, nextUserIndex } = this.state;
    panes.push({ title: `用户${nextUserIndex}`, content: <UserInfo form={form} user={defaultUserInfo} userId={nextUserIndex}/>, key: `user${nextUserIndex}` })

    dispatch({
      type: 'videoMark/addUser',
      payload: defaultUserInfo,
    });
    this.setState({
      panes,
      activeKey: `user${nextUserIndex}`,
      nextUserIndex: nextUserIndex + 1,
    });
  };

  remove = targetKey => {
    let { activeKey } = this.state;
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

  handleAddDialog = userId => {
    const { records } = this.state;
    records.push({
      dialogType: '业务',
      customer: '',
      user: '',
      userId,
      emotionTag: [],
      actionTag: [],
      dialogTag: [],
      reverse: false,
    });
    this.setState({
      records,
    });
  };

  handleDeleteDialog = index => {
    const { records } = this.state;
    records.splice(index, 1);
    this.setState({
      records,
    });
  };

  render() {
    const { form: { getFieldDecorator }, schedule, receptionEvaluation, remark, reviewResult } = this.props;
    const { basicInfo, roleId, dataIdQueue, panes, activeKey, records, topics, width, visible, createVisible } = this.state;

    const users = panes.map(pane => ({ userId: parseInt(pane.key.replace('user', ''), 0), userName: pane.title }));

    const action = (<Button type="primary" onClick={this.handleGoBack}>返回</Button>);

    const extra = (
      <div className={styles.moreInfo}>
        <Progress type="circle" percent={schedule ? schedule.completeRate : 0} width={60} />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={6}>
        <Descriptions.Item label="已答题数">{schedule ? schedule.completeNum : ''}</Descriptions.Item>
        <Descriptions.Item label="剩余题数">{schedule ? schedule.restNum : ''}</Descriptions.Item>
        <Descriptions.Item label="无效题数">{schedule ? schedule.invalidNum : ''}</Descriptions.Item>
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
            <a>编辑</a>
            <Divider type="vertical"/>
            <a>删除</a>
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
                  <Input disabled/>
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.area}>
                  {
                    getFieldDecorator('area', {
                      rules: [
                        {
                          required: true,
                          message: '请输入地区',
                        },
                      ],
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.outlet}>
                  {
                    getFieldDecorator('outlet', {
                      rules: [
                        {
                          required: true,
                          message: '请输入网点',
                        },
                      ],
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.receptionPerson}>
                  {
                    getFieldDecorator('receptionPerson', {
                      rules: [
                        {
                          required: true,
                          message: '请输入接待人员',
                        },
                      ],
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.dialogTime}>
                  {
                    getFieldDecorator('dialogTime', {
                      rules: [
                        {
                          required: true,
                          message: '请输入对话时间',
                        },
                      ],
                    })(<RangePicker allowClear={false} showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" placeholder={['开始时间', '结束时间']} style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.receptionCostTime}>
                  {
                    getFieldDecorator('receptionCostTime', {
                      rules: [
                        {
                          required: true,
                          message: '请输入接待时长',
                        },
                      ],
                    })(<TimePicker format="HH:mm" style={{ width: '100%' }} />)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.dialogScene}>
                  {
                    getFieldDecorator('dialogScene', {
                      rules: [
                        {
                          required: true,
                          message: '请输入对话场景',
                        },
                      ],
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.dialogTarget}>
                  {
                    getFieldDecorator('dialogTarget', {
                      rules: [
                        {
                          required: true,
                          message: '请输入对话目的',
                        },
                      ],
                    })(<Input/>)
                  }
                </Form.Item>
              </Col>
              <Col md={8} sm={12}>
                <Form.Item label={FieldLabels.remark}>
                  {
                    getFieldDecorator('remark', {})(<TextArea autoSize/>)
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card bordered={false} title="用户信息" className={styles.card}>
          {
            <Tabs type="editable-card" onEdit={this.onEditTab} onChange={this.onChange} activeKey={activeKey}>
              {panes.map(pane => (<TabPane tab={pane.title} key={pane.key}>{pane.content}</TabPane>))}
            </Tabs>
          }
        </Card>
        <Card bordered={false} title="对话记录">
          <Row gutter={16}>
            <Col span={16}>
              {records.map((record, index) => <DialogRecord form={this.props.form} dialog={record} index={index + 1} onDelete={() => this.handleDeleteDialog(index)}/>)}
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
          <Button type="primary" icon="plus" onClick={this.showModal}>问答对</Button>
        </Card>
        <SelectUserModalView users={users} visible={visible} onClose={this.onClose} onConfirm={this.handleAddDialog}/>
        {/*<TopicCreateModalView visible={createVisible} onClose={this.onCloseCreateModal}/>*/}
        <FooterToolBar style={{ width }}>
          <Form {...formItemLayout}>
            <Row>
              <Col span={8}>
                <Form.Item label={FieldLabels.receptionEvaluation}>
                  {
                    getFieldDecorator('receptionEvaluation', {
                      initialValue: receptionEvaluation,
                    })(<TextArea autoSize/>)
                  }
                </Form.Item>
              </Col>
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
              {
                roleId === Inspector &&
                <Col span={8}>
                  <Form.Item label={FieldLabels.remark}>
                    {
                      getFieldDecorator('remark', {
                        initialValue: remark,
                      })(<TextArea autoSize/>)
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
