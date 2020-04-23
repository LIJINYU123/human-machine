import React, { Component, Fragment } from 'react';
import { Button, Card, Checkbox, Descriptions, Form, Input, Radio, Tag, Row, Col, Table, Popover, ConfigProvider, Empty } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import WordEntryModalView from './WordEntryModalView';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels } = ItemData;

@connect(({ sequenceMark }) => ({
  questionInfo: sequenceMark.questionInfo,
}))
class SequenceAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    popoverVisible: false,
    word: '',
    optionName: '',
    startIndex: '',
    endIndex: '',
    modalVisible: false,
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
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'sequenceMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
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
    const { basicInfo, roleId } = this.state;
    const { dispatch, questionInfo, form: { getFieldsValue, setFieldsValue } } = this.props;
    const values = getFieldsValue();
    dispatch({
      type: 'sequenceMark/fetchNext',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
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
        this.setState({
          popoverVisible: false,
        });
      },
    });
  };

  handlePrevQuestion = () => {
    const { basicInfo, roleId } = this.state;
    const { dispatch, questionInfo, form: { setFieldsValue } } = this.props;
    dispatch({
      type: 'sequenceMark/fetchPrev',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
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
        this.setState({
          popoverVisible: false,
        });
      },
    });
  };

  handleClick = () => {
    const { questionInfo } = this.props;
    // eslint-disable-next-line max-len
    const word = window.getSelection ? window.getSelection() : document.selection.createRange().text;
    // eslint-disable-next-line max-len
    if (questionInfo.data.hasOwnProperty('sentence') && questionInfo.data.sentence.substring(word.anchorNode.firstChild.selectionStart, word.anchorNode.firstChild.selectionEnd).length > 1) {
      this.setState({
        popoverVisible: true,
        // eslint-disable-next-line max-len
        word: questionInfo.data.sentence.substring(word.anchorNode.firstChild.selectionStart, word.anchorNode.firstChild.selectionEnd),
        startIndex: word.anchorNode.firstChild.selectionStart,
        endIndex: word.anchorNode.firstChild.selectionEnd,
      })
    } else if (questionInfo.data.hasOwnProperty('sentence1') && questionInfo.data.sentence1.substring(word.anchorNode.firstChild.selectionStart, word.anchorNode.firstChild.selectionEnd).length > 1) {
      this.setState({
        popoverVisible: true,
        // eslint-disable-next-line max-len
        word: questionInfo.data.sentence1.substring(word.anchorNode.firstChild.selectionStart, word.anchorNode.firstChild.selectionEnd),
        startIndex: word.anchorNode.firstChild.selectionStart,
        endIndex: word.anchorNode.firstChild.selectionEnd,
      })
    } else {
      this.setState({
        popoverVisible: false,
        word: '',
        startIndex: 0,
        endIndex: 0,
      })
    }
  };

  handleClickTag = optionName => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const { markTool, word, startIndex, endIndex } = this.state;
    if (markTool.saveType === 'nomal') {
      const values = getFieldsValue();
      const prevLabelResult = values.labelResult;
      prevLabelResult.push({ word, optionName, startIndex, endIndex });
      setFieldsValue({
        labelResult: prevLabelResult,
      });
      this.setState({
        optionName,
      });
    } else {
      this.setState({
        optionName,
        modalVisible: true,
        popoverVisible: false,
      })
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

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleConfirmModal = (saveType, wordEntry, newWordEntry) => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const { word, optionName, startIndex, endIndex } = this.state;
    const values = getFieldsValue();
    const prevLabelResult = values.labelResult;
    prevLabelResult.push({ word, optionName, startIndex, endIndex, saveType, wordEntry, newWordEntry });
    setFieldsValue({
      labelResult: prevLabelResult,
    });
  };

  render() {
    const { form: { getFieldDecorator }, questionInfo } = this.props;
    const { basicInfo, markTool, popoverVisible, modalVisible, optionName, roleId } = this.state;

    const action = (
      <Fragment>
        { roleId === 'labeler' && <Button icon="check">提交质检</Button> }
        { roleId === 'inspector' &&
          <Button.Group>
            <Button icon="close">驳回</Button>
            <Button icon="check">通过</Button>
          </Button.Group>
        }
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
        dataIndex: 'word',
        ellipsis: true,
      },
      {
        title: '选项',
        dataIndex: 'optionName',
        width: 100,
      },
      {
        title: '操作',
        width: 50,
        render: (_, record, index) => (
          <a onClick={() => this.handleDelete(index)}>删除</a>
        ),
      },
    ];

    const dictColumns = [
      {
        title: '结果',
        dataIndex: 'word',
        ellipsis: true,
      },
      {
        title: '选项',
        dataIndex: 'optionName',
        width: 100,
      },
      {
        title: '存储方式',
        dataIndex: 'saveType',
        width: 150,
        render: (val, record) => {
          if (val === 'wordEntry') {
            return '词条名';
          }
          if (record.newWordEntry !== '') {
            return `同义词：${record.newWordEntry}`;
          }
          return `同义词：${record.wordEntry}`;
        },
      },
      {
        title: '操作',
        width: 50,
        render: (_, record, index) => (
          <a onClick={() => this.handleDelete(index)}>删除</a>
        ),
      },
    ];

    const popoverContent = (
      markTool.options.map(option => <Tag color={option.color} style={{ cursor: 'pointer' }} onClick={() => this.handleClickTag(option.optionName)}>{option.optionName}</Tag>)
    );

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
              <Col md={12} sm={24}>
                <Row>
                  {
                    questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence') &&
                    <Form.Item label={AnswerModeLabels.text}>
                      <Popover visible={popoverVisible} content={popoverContent} placement="bottom">
                        <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence : ''} style={{ width: '80%' }} onClick={this.handleClick} autoSize/>
                      </Popover>
                    </Form.Item>
                  }
                </Row>
                <Row>
                  {
                    questionInfo.hasOwnProperty('data') && questionInfo.data.hasOwnProperty('sentence1') &&
                    <Form.Item label={AnswerModeLabels.text1}>
                      <Popover visible={popoverVisible} content={popoverContent} placement="bottom">
                        <TextArea value={Object.keys(questionInfo).length ? questionInfo.data.sentence1 : ''} style={{ width: '80%' }} onClick={this.handleClick} autoSize/>
                      </Popover>
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
                    <Fragment>
                      { markTool.options.map(option => <Tag color={option.color}>{option.optionName}</Tag>) }
                    </Fragment>
                  </Form.Item>
                </Row>
                <Row>
                  {
                    roleId === 'inspector' &&
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
                  }
                </Row>
                <Row>
                  {
                    roleId === 'inspector' &&
                    <Form.Item label={AnswerModeLabels.remark}>
                      {
                        getFieldDecorator('remark', {
                          initialValue: questionInfo.remark,
                        })(<TextArea style={{ width: '80%' }} autoSize/>)
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
                </Row>
              </Col>
              <Col md={12} sm={24}>
                <ConfigProvider renderEmpty={() => <Empty imageStyle={{ height: 10 }} />}>
                  <Form.Item wrapperCol={{ span: 24 }}>
                    {
                      getFieldDecorator('labelResult', {
                        initialValue: questionInfo.labelResult,
                        valuePropName: 'dataSource',
                      })(
                        <Table
                          size="small"
                          columns={markTool.saveType === 'nomal' ? columns : dictColumns}
                          pagination={false}
                          bordered
                        />)
                    }
                  </Form.Item>
                </ConfigProvider>
              </Col>
            </Row>
          </Form>
        </Card>
        <WordEntryModalView visible={modalVisible} onCancel={this.handleCancelModal} onConfirm={this.handleConfirmModal} projectId={basicInfo.projectId} optionName={optionName} />
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SequenceAnswerView);
