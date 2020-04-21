import React, { Component, Fragment } from 'react';
import { Button, Card, Checkbox, Descriptions, Form, Input, Radio, Tag, Row, Col, Table } from 'antd';
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
class SequenceAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    markAuthority: false,
    reviewAuthority: false,
  };

  componentWillMount() {
    const { location } = this.props;
    const privilegeStr = localStorage.getItem('Privileges');
    const privileges = JSON.parse(privilegeStr);
    const { dataMark } = privileges;
    this.setState({
      basicInfo: location.state.basicInfo,
      markTool: location.state.markTool,
      markAuthority: dataMark.includes('mark'),
      reviewAuthority: dataMark.includes('review'),
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

  goBackToSequenceMark = () => {
    router.push({
      pathname: '/task-manage/my-task/sequence-mark',
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

  // onPressEnter = () => {
  //   const input = document.getElementById('textArea');
  //   console.log(input.selectionStart);
  // };
  //
  // onTextAreaChange = () => {
  //   console.log('call onTextAreaChange');
  //   const input = document.getElementById('textArea');
  //   input.selectionStart = 0;
  //   input.selectionEnd = 0;
  // };

  handleClick = () => {
    const word = window.getSelection ? window.getSelection() : document.selection.createRange().text;
    console.log(word);
  };

  render() {
    const { form: { getFieldDecorator }, questionInfo } = this.props;
    const { basicInfo, markTool, reviewAuthority } = this.state;

    const action = (
      <Fragment>
        <Button icon="check">提交质检</Button>
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.goBackToSequenceMark}>返回</Button>
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
          <Form>
            <Form.Item label={markTool.classifyName} {...formItemLayout}>
              <Fragment>
                { markTool.options.map(option => <Tag color="blue">{option.optionName}</Tag>) }
              </Fragment>
              <Tag color="blue">句子</Tag>
            </Form.Item>
            <Row>
              <Col md={12} sm={24}>
                <Form.Item label={AnswerModeLabels.text} {...formItemLayout2}>
                  <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence : '' } style={{ width: '80%' }} autoSize/>
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Table bordered/>
              </Col>
            </Row>
            {
              questionInfo.hasOwnProperty('question') &&
              <Form.Item label={AnswerModeLabels.question} {...formItemLayout2}>
                <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.question : '' } style={{ width: '80%' }} autoSize/>
              </Form.Item>
            }
            {
              reviewAuthority &&
              <Fragment>
                <Form.Item label={AnswerModeLabels.reviewResult} {...formItemLayout}>
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
                <Form.Item label={AnswerModeLabels.remark} {...formItemLayout}>
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
              <Button>上一题</Button>
              <Button type="primary" style={{ marginLeft: '16px' }}>下一题</Button>
              {
                !reviewAuthority &&
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

export default Form.create()(SequenceAnswerView);
