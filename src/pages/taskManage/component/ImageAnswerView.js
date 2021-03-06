import React, { Component, Fragment } from 'react';
import {
  Button,
  Card,
  Descriptions,
  Form,
  Input,
  Row,
  Col,
  Table,
  Radio,
  Checkbox,
  ConfigProvider,
  Empty,
  Tag,
  Progress,
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MultiCrops from '@/components/ImageEditor';
import TagSelect from '@/components/TagSelect';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels, Labeler, Inspector, Labeling, Review, Reject } = ItemData;

@connect(({ imageMark }) => ({
  questionInfo: imageMark.questionInfo,
}))
class ImageAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    roleId: '',
    coordinates: [],
    dataIdQueue: [],
    color: '#52c41a',
  };


  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.basicInfo,
      markTool: location.state.markTool,
      roleId: location.state.roleId,
      color: location.state.markTool.options.length ? location.state.markTool.options[0].color : '#52c41a',
    });
  }

  componentDidMount() {
    const { dispatch, location } = this.props;
    const { basicInfo, dataIdQueue } = this.state;
    dispatch({
      type: 'imageMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        dataId: location.state.dataId,
        labelType: basicInfo.labelType,
      },
      callback: () => {
        const { questionInfo } = this.props;
        dataIdQueue.push(questionInfo.dataId);
        this.setState({
          coordinates: questionInfo.labelResult,
        });
      },
    });
  }

  handleGoBack = () => {
    this.setState({
      dataIdQueue: [],
    });
    router.goBack();
  };

  handleNextQuestion = () => {
    const { basicInfo, roleId, markTool, dataIdQueue } = this.state;
    const { dispatch, questionInfo, form: { getFieldsValue, setFieldsValue } } = this.props;
    let nextDataId = '';
    const currentIndex = dataIdQueue.indexOf(questionInfo.dataId);
    if (currentIndex !== -1 && currentIndex < dataIdQueue.length - 1) {
      nextDataId = dataIdQueue[currentIndex + 1]
    }

    const values = getFieldsValue();
    dispatch({
      type: 'imageMark/fetchNext',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        dataId: questionInfo.dataId,
        labelType: basicInfo.labelType,
        reviewRounds: basicInfo.rejectTime + 1,
        nextDataId,
        labelResult: values.labelResult,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { questionInfo } = this.props;
        const { labelResult } = questionInfo;
        if (roleId === Labeler) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
            optionName: markTool.options.length ? [markTool.options[0].optionName] : [],
          });
        } else if (roleId === Inspector) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
            optionName: markTool.options.length ? [markTool.options[0].optionName] : [],
          });
        }
        if (!dataIdQueue.includes(questionInfo.dataId) && questionInfo.dataId !== '') {
          dataIdQueue.push(questionInfo.dataId);
        }
        this.setState({
          coordinates: labelResult,
          color: markTool.options.length ? markTool.options[0].color : '#52c41a',
        });
      },
    });
  };

  handlePrevQuestion = () => {
    const { basicInfo, roleId, markTool, dataIdQueue } = this.state;
    const { dispatch, questionInfo, form: { setFieldsValue } } = this.props;
    let prevDataId = '';
    const currentIndex = dataIdQueue.indexOf(questionInfo.dataId);
    if (currentIndex !== -1 && currentIndex !== 0) {
      prevDataId = dataIdQueue[currentIndex - 1];
    }

    dispatch({
      type: 'imageMark/fetchPrev',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        prevDataId,
        labelType: basicInfo.labelType,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { questionInfo } = this.props;
        const { labelResult } = questionInfo;
        if (roleId === Labeler) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
            optionName: markTool.options.length ? [markTool.options[0].optionName] : [],
          });
        } else if (roleId === Inspector) {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
            optionName: markTool.options.length ? [markTool.options[0].optionName] : [],
          });
        }
        this.setState({
          coordinates: labelResult,
          color: markTool.options.length ? markTool.options[0].color : '#52c41a',
        });
      },
    });
  };

  handleTagChange = value => {
    const { form: { setFieldsValue } } = this.props;
    const { markTool } = this.state;
    setFieldsValue({
      classifyName: value,
    });

    const filterItems = markTool.options.filter(item => item.optionName === value[0]);
    if (filterItems.length) {
      this.setState({
        color: filterItems[0].color,
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
    this.setState({
      coordinates: prevLabelResult,
    });
  };

  changeCoordinate = (coordinate, index, coordinates) => {
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    const { markTool } = this.state;
    const values = getFieldsValue();
    const prevLabelResult = values.labelResult;

    if (prevLabelResult.length < coordinates.length) {
      prevLabelResult.push({
        ...coordinate,
        right: coordinate.x + coordinate.width,
        bottom: coordinate.y + coordinate.height,
        optionName: values.optionName[0],
        color: markTool.options.filter(item => item.optionName === values.optionName[0])[0].color });
    } else {
      prevLabelResult.forEach(item => {
        if (coordinate.id === item.id) {
          item.x = coordinate.x;
          item.y = coordinate.y;
          item.width = coordinate.width;
          item.height = coordinate.height;
          item.right = coordinate.x + coordinate.width;
          item.bottom = coordinate.y + coordinate.height;
        }
      });
    }
    setFieldsValue({
      labelResult: prevLabelResult,
    });
    this.setState({
      coordinates,
    })
  };

  deleteCoordinate = (coordinate, index, coordinates) => {
    const { form: { setFieldsValue, getFieldsValue } } = this.props;
    const values = getFieldsValue();
    const prevLabelResult = values.labelResult;

    prevLabelResult.splice(index, 1);
    setFieldsValue({
      labelResult: prevLabelResult,
    });

    this.setState({
      coordinates,
    })
  };

  submitReview = () => {
    const { dispatch } = this.props;
    const { basicInfo, roleId } = this.state;
    dispatch({
      type: 'imageMark/updateStatus',
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
      type: 'imageMark/updateStatus',
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
      type: 'imageMark/updateStatus',
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
    const { form: { getFieldDecorator }, questionInfo } = this.props;
    const { basicInfo, markTool, color, roleId, dataIdQueue } = this.state;

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
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 22 },
      },
    };

    const columns = [
      {
        title: '序号',
        render: (_, record, index) => index + 1,
      },
      {
        title: '选项',
        dataIndex: 'optionName',
      },
      {
        title: '颜色',
        dataIndex: 'color',
        render: val => <div className={styles.colorPicker}><div className={styles.color} style={{ background: `${val}` }}/></div>,
        width: 60,
      },
      {
        title: '操作',
        width: 50,
        render: this.judgeDisabled(roleId, basicInfo.status) ? '' : (_, record, index) => (<a onClick={() => this.handleDelete(index)}>删除</a>),
      },
    ];

    // console.log(this.state.coordinates);

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
            <Row gutter={[0, 32]}>
              <Col md={16} sm={24}>
                <Row>
                  <Form.Item label={markTool.classifyName}>
                    <Fragment>
                      {
                        markTool.options.map(item => <Tag color={item.color}>{item.optionName}</Tag>)
                      }
                    </Fragment>
                  </Form.Item>
                </Row>
                <Row>
                  <Col md={{ span: formItemLayout.wrapperCol.sm.span, offset: formItemLayout.labelCol.sm.span }} sm={24}>
                    <MultiCrops
                      src={questionInfo.data ? questionInfo.data : ''}
                      coordinates={this.state.coordinates}
                      onChange={this.judgeDisabled(roleId, basicInfo.status) ? () => {} : this.changeCoordinate}
                      onDelete={this.judgeDisabled(roleId, basicInfo.status) ? () => {} : this.deleteCoordinate}
                      color={color}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <Row>
                  <Form.Item label={markTool.classifyName}>
                    {
                      getFieldDecorator('optionName', {
                        initialValue: [markTool.options[0].optionName],
                      })(
                        <TagSelect expandable multiple={false} onChange={this.handleTagChange}>
                          {markTool.options.map(option => <TagSelect.Option value={option.optionName}>{option.optionName}</TagSelect.Option>)}
                        </TagSelect>)
                    }
                  </Form.Item>
                </Row>
                <Row>
                  {
                    roleId === Inspector &&
                    <Form.Item label="质检">
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
              <Col md={8} sm={24}>
                <ConfigProvider renderEmpty={() => <Empty imageStyle={{ height: 10 }} />}>
                  <Form.Item wrapperCol={{ span: 24 }}>
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
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ImageAnswerView);
