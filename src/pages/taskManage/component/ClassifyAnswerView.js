import React, { Component, Fragment } from 'react';
import { Button, Card, Statistic, Form, Row, Col, Descriptions, Input, Checkbox, Radio, Tag, Icon } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TagSelect from '@/components/TagSelect';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels } = ItemData;

@connect(({ textMark }) => ({
  questionInfo: textMark.questionInfo,
}))
class ClassifyAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    roleId: '',
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
    const roleId = localStorage.getItem('RoleID');
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'textMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        roleId,
      },
    });
  }

  goBackToTextMark = () => {
    router.push({
      pathname: '/task-manage/my-task/text-mark',
      state: {
        taskInfo: this.state.basicInfo,
      },
    });
  };

  handleNextQuestion = () => {
    const roleId = localStorage.getItem('RoleID');
    const { basicInfo } = this.state;
    const { dispatch, questionInfo, form: { getFieldsValue, setFieldsValue } } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'textMark/fetchNext',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        roleId,
        dataId: questionInfo.dataId,
        ...values,
      },
      callback: () => {
        const { questionInfo } = this.props;
        if (roleId === 'labeler') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
          });
        } else if (roleId === 'inspector') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
          });
        }
      },
    });
  };

  handlePrevQuestion = () => {
    const roleId = localStorage.getItem('RoleID');
    const { basicInfo } = this.state;
    const { dispatch, questionInfo, form: { setFieldsValue } } = this.props;
    dispatch({
      type: 'textMark/fetchPrev',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        roleId,
        dataId: questionInfo.dataId,
      },
      callback: () => {
        const { questionInfo } = this.props;
        if (roleId === 'labeler') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
          });
        } else if (roleId === 'inspector') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
          });
        }
      },
    });
  };

  render() {
    const { form: { getFieldDecorator }, questionInfo } = this.props;
    const { basicInfo, markTool, roleId } = this.state;
    const action = (
      <Fragment>
        { roleId === 'labeler' && <Button icon="check">提交质检</Button> }
        { roleId === 'inspector' &&
          <Button.Group>
            <Button icon="close">驳回</Button>
            <Button icon="check">通过</Button>
          </Button.Group>
        }
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.goBackToTextMark}>返回</Button>
      </Fragment>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={6}>
        <Descriptions.Item label="已答题数">{questionInfo.schedule ? questionInfo.schedule.completeNum : ''}</Descriptions.Item>
        <Descriptions.Item label="剩余题数">{questionInfo.schedule ? questionInfo.schedule.restNum : ''}</Descriptions.Item>
        <Descriptions.Item label="无效题数">{questionInfo.schedule ? questionInfo.schedule.invalidNum : ''}</Descriptions.Item>
      </Descriptions>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    const formItemLayout2 = {
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
      >
        <Card bordered={false}>
          <Form {...formItemLayout}>
            <Row>
              {
                questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence') &&
                <Col md={12} sm={24}>
                  <Form.Item label={AnswerModeLabels.text} {...formItemLayout2}>
                    <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence : '' } style={{ width: '80%' }} autoSize/>
                  </Form.Item>
                </Col>
              }
              {
                questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence1') &&
                <Fragment>
                  <Col md={12} sm={24}>
                    <Form.Item label={AnswerModeLabels.text1} {...formItemLayout2}>
                      <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence1 : '' } style={{ width: '80%' }} autoSize/>
                    </Form.Item>
                  </Col>
                </Fragment>
              }
              <Col md={12} sm={24}>
                <Form.Item label="标注结果" {...formItemLayout2}>
                  <Fragment>
                    {
                      Object.keys(questionInfo).length ? questionInfo.labelResult.map(item => <Tag color="blue">{item}</Tag>) : ''
                    }
                  </Fragment>
                </Form.Item>
              </Col>
            </Row>
            {
              questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence2') &&
              <Form.Item label={AnswerModeLabels.text2}>
                <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence2 : '' } style={{ width: '80%' }} autoSize/>
              </Form.Item>
            }
            <Form.Item label={markTool.classifyName}>
              {
                getFieldDecorator('labelResult', {
                  initialValue: questionInfo.labelResult,
                })(
                  <TagSelect expandable multiple={markTool.multiple}>
                    {markTool.options.map(option => <TagSelect.Option value={option.optionName}>{option.optionName}</TagSelect.Option>)}
                  </TagSelect>)
              }
            </Form.Item>
            {
              roleId === 'inspector' &&
              <Fragment>
                <Form.Item label={AnswerModeLabels.reviewResult}>
                  {
                    getFieldDecorator('reviewResult', {
                      initialValue: questionInfo.reviewResult,
                    })(
                      <Radio.Group>
                        <Radio.Button value="approve">通过</Radio.Button>
                        <Radio.Button value="reject">拒绝</Radio.Button>
                      </Radio.Group>)
                  }
                </Form.Item>
                <Form.Item label={AnswerModeLabels.remark}>
                  {
                    getFieldDecorator('remark', {
                      initialValue: questionInfo.remark,
                    })(<TextArea style={{ width: '80%' }} autoSize/>)
                  }
                </Form.Item>
              </Fragment>
            }
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
              <Button onClick={this.handlePrevQuestion}>上一题</Button>
              <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleNextQuestion}>下一题</Button>
              {
                roleId === 'labeler' &&
                getFieldDecorator('invalid', {
                  initialValue: questionInfo.invalid,
                  valuePropName: 'checked',
                })(
                  <Checkbox style={{ marginLeft: '16px' }}>无效数据</Checkbox>)
              }
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ClassifyAnswerView);
