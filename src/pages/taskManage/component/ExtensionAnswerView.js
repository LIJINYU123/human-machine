import React, { Component, Fragment } from 'react';
import { Button, Card, Descriptions, Form, Input, Row, Col, Table, Radio, Checkbox, ConfigProvider, Empty } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels } = ItemData;

@connect(({ extensionMark }) => ({
  questionInfo: extensionMark.questionInfo,
}))
class ExtensionAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    roleId: '',
  };

  componentWillMount() {
    const { location } = this.props;
    const roleId = localStorage.getItem('RoleID');
    this.setState({
      basicInfo: location.state.basicInfo,
      markTool: location.state.markTool,
      roleId,
    });
  }

  componentDidMount() {
    const roleId = localStorage.getItem('RoleID');
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'extensionMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        roleId,
      },
    });
  }

  goBackToExtensionMark = () => {
    router.push({
      pathname: '/task-manage/my-task/extension-mark',
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
      type: 'extensionMark/fetchNext',
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
      type: 'extensionMark/fetchPrev',
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

  onPressEnter = () => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const values = getFieldsValue();
    const prevLabelResult = values.labelResult;
    if (values.extensionText !== '') {
      prevLabelResult.push(values.extensionText);
      console.log(prevLabelResult);
      setFieldsValue({
        labelResult: prevLabelResult,
        extensionText: '',
      });
    }
  };

  handleDelete = index => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const values = getFieldsValue();
    const prevLabelResult = values.labelResult;
    prevLabelResult.splice(index, 1);
    setFieldsValue({
      labelResult: prevLabelResult,
    });
  };

  render() {
    const { form: { getFieldDecorator }, questionInfo } = this.props;
    const { basicInfo, markTool, roleId } = this.state;
    const action = (
      <Fragment>
        <Button icon="check">提交质检</Button>
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.goBackToExtensionMark}>返回</Button>
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

    const columns = [
      {
        title: '结果',
        ellipsis: true,
      },
      {
        title: '操作',
        width: 50,
        render: (_, record, index) => (
          <a onClick={() => this.handleDelete(index)}>删除</a>
        ),
      },
    ];

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
                <span>{markTool.minValue}</span>
                <span>&nbsp;~&nbsp;</span>
                <span>{markTool.maxValue}</span>
              </Fragment>
            </Form.Item>
            <Row>
              <Col md={12} sm={24}>
                <Form.Item label={AnswerModeLabels.text} {...formItemLayout2}>
                  <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence : ''} style={{ width: '80%' }} autoSize/>
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <ConfigProvider renderEmpty={() => <Empty imageStyle={{ height: 10 }} />}>
                  <Form.Item>
                    {
                      getFieldDecorator('labelResult', {
                        initialValue: questionInfo.labelResult,
                        valuePropName: 'dataSource',
                      })(<Table
                        size="small"
                        columns={columns}
                        pagination={false}
                        bordered
                      />)
                    }
                  </Form.Item>
                </ConfigProvider>
              </Col>
            </Row>
            <Form.Item label={AnswerModeLabels.extension} {...formItemLayout}>
              {
                getFieldDecorator('extensionText')(
                  <Input onPressEnter={this.onPressEnter} style={{ width: '80%' }}/>)
              }
            </Form.Item>
            {
              roleId === 'inspector' &&
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

export default Form.create()(ExtensionAnswerView);
