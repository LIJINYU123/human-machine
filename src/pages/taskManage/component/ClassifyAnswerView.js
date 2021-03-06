import React, { Component, Fragment } from 'react';
import { Button, Card, Progress, Form, Row, Col, Descriptions, Input, Checkbox, Radio, Tag, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TagSelect from '@/components/TagSelect';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels, Labeler, Inspector, Review, Reject, Labeling } = ItemData;

@connect(({ textMark }) => ({
  questionInfo: textMark.questionInfo,
}))
class ClassifyAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    roleId: '',
    dataIdQueue: [],
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.basicInfo,
      markTool: location.state.markTool,
      roleId: location.state.roleId,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { basicInfo, dataIdQueue } = this.state;
    dispatch({
      type: 'textMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
      },
      callback: () => {
        const { questionInfo } = this.props;
        dataIdQueue.push(questionInfo.dataId);
      },
    });
  }

  handleGoBack = () => {
    this.setState({
      dataIdQueue: [],
    });
    router.goBack();
  };

  handleTagChange = value => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      labelResult: value,
    });
  };

  handleNextQuestion = () => {
    const { basicInfo, roleId, dataIdQueue } = this.state;
    const { dispatch, questionInfo, form: { getFieldsValue, setFieldsValue } } = this.props;
    let nextDataId = '';
    const currentIndex = dataIdQueue.indexOf(questionInfo.dataId);
    if (currentIndex !== -1 && currentIndex < dataIdQueue.length - 1) {
      nextDataId = dataIdQueue[currentIndex + 1]
    }

    const values = getFieldsValue();
    dispatch({
      type: 'textMark/fetchNext',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        dataId: questionInfo.dataId,
        reviewRounds: basicInfo.rejectTime + 1,
        nextDataId,
        ...values,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { questionInfo } = this.props;
        if (roleId === Labeler) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
          });
        } else if (roleId === Inspector) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
          });
        }
        if (!dataIdQueue.includes(questionInfo.dataId) && questionInfo.dataId !== '') {
          dataIdQueue.push(questionInfo.dataId);
        }
      },
    });
  };

  handlePrevQuestion = () => {
    const { basicInfo, roleId, dataIdQueue } = this.state;
    const { dispatch, questionInfo, form: { setFieldsValue } } = this.props;
    let prevDataId = '';
    const currentIndex = dataIdQueue.indexOf(questionInfo.dataId);
    if (currentIndex !== -1 && currentIndex !== 0) {
      prevDataId = dataIdQueue[currentIndex - 1];
    }

    dispatch({
      type: 'textMark/fetchPrev',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        prevDataId,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { questionInfo } = this.props;
        if (roleId === Labeler) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
          });
        } else if (roleId === Inspector) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
          });
        }
      },
    });
  };

  submitReview = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'textMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'review' },
      callback: () => {
        router.push({
          pathname: '/task-manage/my-task',
          state: {
            status: roleId === Labeler ? 'labeling,reject' : 'review',
          },
        });
      },
    });
  };

  submitComplete = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'textMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'complete' },
      callback: () => {
        router.push({
          pathname: '/task-manage/my-task',
          state: {
            status: roleId === Labeler ? 'labeling,reject' : 'review',
          },
        });
      },
    });
  };

  submitReject = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'textMark/updateStatus',
      payload: { taskId: basicInfo.taskId, status: 'reject' },
      callback: () => {
        router.push({
          pathname: '/task-manage/my-task',
          state: {
            status: roleId === Labeler ? 'labeling,reject' : 'review',
          },
        });
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

  render() {
    const { form: { getFieldDecorator, getFieldsValue }, questionInfo } = this.props;
    const { basicInfo, markTool, roleId, dataIdQueue } = this.state;
    const action = (
      <Fragment>
        { roleId === Labeler && <Button icon="check" onClick={this.submitReview} disabled={this.judgeDisabled(roleId, basicInfo.status)}>提交质检</Button> }
        { roleId === Inspector &&
          <Button.Group>
            <Button icon="close" onClick={this.submitReject} disabled={this.judgeDisabled(roleId, basicInfo.status)}>驳回</Button>
            <Button icon="check" onClick={this.submitComplete} disabled={this.judgeDisabled(roleId, basicInfo.status)}>通过</Button>
          </Button.Group>
        }
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleGoBack}>返回</Button>
      </Fragment>
    );

    const extra = (
      <div className={styles.moreInfo}>
        <Progress type="circle" percent={questionInfo.schedule ? questionInfo.schedule.completeRate : 0} width={60} />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={6}>
        <Descriptions.Item label="已答题数">{questionInfo.schedule ? questionInfo.schedule.completeNum : ''}</Descriptions.Item>
        {
          roleId === Labeler && <Descriptions.Item label="剩余题数">{questionInfo.schedule ? questionInfo.schedule.restNum : ''}</Descriptions.Item>
        }
        {
          roleId === Labeler && <Descriptions.Item label="无效题数">{questionInfo.schedule ? questionInfo.schedule.invalidNum : ''}</Descriptions.Item>
        }
      </Descriptions>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card bordered={false}>
          <Form {...formItemLayout}>
            <Row>
              <Col md={12} sm={24}>
                <Row>
                  {
                    questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence') &&
                    <Form.Item label={AnswerModeLabels.text}>
                      <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence : '' } style={{ width: '80%' }} autoSize/>
                    </Form.Item>
                  }
                </Row>
                <Row>
                  {
                    questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence1') &&
                    <Form.Item label={AnswerModeLabels.text1}>
                      <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence1 : '' } style={{ width: '80%' }} autoSize/>
                    </Form.Item>
                  }
                </Row>
                <Row>
                  {
                    questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence2') &&
                    <Form.Item label={AnswerModeLabels.text2}>
                      <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence2 : '' } style={{ width: '80%' }} autoSize/>
                    </Form.Item>
                  }
                </Row>
                <Row>
                  <Form.Item label={markTool.classifyName}>
                    {
                      getFieldDecorator('labelResult', {
                        initialValue: questionInfo.labelResult,
                      })(
                        <TagSelect expandable multiple={markTool.multiple} onChange={this.handleTagChange} disabled={this.judgeDisabled(roleId, basicInfo.status)}>
                          {markTool.options.map(option => <TagSelect.Option value={option.optionName}>{option.optionName}</TagSelect.Option>)}
                        </TagSelect>)
                    }
                  </Form.Item>
                </Row>
                <Row>
                  {
                    roleId === Inspector &&
                    <Form.Item label={AnswerModeLabels.reviewResult}>
                      {
                        getFieldDecorator('reviewResult', {
                          initialValue: questionInfo.reviewResult,
                        })(
                          <Radio.Group disabled={this.judgeDisabled(roleId, basicInfo.status)}>
                            <Radio.Button value="approve">通过</Radio.Button>
                            <Radio.Button value="reject">拒绝</Radio.Button>
                          </Radio.Group>)
                      }
                    </Form.Item>
                  }
                </Row>
                <Row>
                  {
                    roleId === Inspector &&
                    <Form.Item label={AnswerModeLabels.remark}>
                      {
                        getFieldDecorator('remark', {
                          initialValue: questionInfo.remark,
                        })(<TextArea style={{ width: '80%' }} autoSize disabled={this.judgeDisabled(roleId, basicInfo.status)}/>)
                      }
                    </Form.Item>
                  }
                </Row>
                <Row>
                  {
                    roleId === Inspector &&
                    <Form.Item label={AnswerModeLabels.valid}>
                      {
                        questionInfo.invalid === true ? <Tag color="#f5222d">无效</Tag> : <Tag color="#52c41a">有效</Tag>
                      }
                    </Form.Item>
                  }
                </Row>
                <Row>
                  <Form.Item
                    wrapperCol={{
                      xs: {
                        span: 24,
                        offset: 0,
                      },
                      sm: {
                        span: formItemLayout.wrapperCol.sm.span,
                        offset: formItemLayout.labelCol.sm.span,
                      },
                    }}
                  >
                    <Button onClick={this.handlePrevQuestion} disabled={dataIdQueue.length === 0 || dataIdQueue.indexOf(questionInfo.dataId) === 0}>上一题</Button>
                    <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleNextQuestion}>下一题</Button>
                    {
                      roleId === Labeler &&
                      getFieldDecorator('invalid', {
                        initialValue: questionInfo.invalid,
                        valuePropName: 'checked',
                      })(
                        <Checkbox style={{ marginLeft: '16px' }} disabled={this.judgeDisabled(roleId, basicInfo.status)}>无效数据</Checkbox>)
                    }
                  </Form.Item>
                </Row>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item label="标注结果">
                  <Fragment>
                    {
                      typeof getFieldsValue().labelResult !== 'undefined' ? getFieldsValue().labelResult.map(item => <Tag color="blue">{item}</Tag>) : null
                    }
                  </Fragment>
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ClassifyAnswerView);
