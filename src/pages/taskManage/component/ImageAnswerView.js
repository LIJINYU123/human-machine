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
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import MultiCrops from '@/components/ImageEditor';
import TagSelect from '@/components/TagSelect';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels } = ItemData;

@connect(({ imageMark }) => ({
  questionInfo: imageMark.questionInfo,
}))
class ImageAnswerView extends Component {
  state = {
    basicInfo: undefined,
    markTool: undefined,
    roleId: '',
    coordinates: [],
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
      type: 'imageMark/fetchQuestion',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
      },
      callback: () => {
        const { questionInfo } = this.props;
        this.setState({
          coordinates: questionInfo.labelResult,
        });
      },
    });
  }

  handleGoBack = () => {
    router.goBack();
  };

  handleNextQuestion = () => {
    const { basicInfo, roleId, markTool } = this.state;
    const { dispatch, questionInfo, form: { getFieldsValue, setFieldsValue } } = this.props;

    const values = getFieldsValue();
    dispatch({
      type: 'imageMark/fetchNext',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        dataId: questionInfo.dataId,
        ...values,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { questionInfo } = this.props;
        const { labelResult } = questionInfo;
        if (roleId === 'labeler') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
            optionName: markTool.options.length ? markTool.options[0].optionName : '',
          });
        } else if (roleId === 'inspector') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
            optionName: markTool.options.length ? markTool.options[0].optionName : '',
          });
        }
        this.setState({
          coordinates: labelResult,
        });
      },
    });
  };

  handlePrevQuestion = () => {
    const { basicInfo, roleId, markTool } = this.state;
    const { dispatch, questionInfo, form: { setFieldsValue } } = this.props;
    dispatch({
      type: 'imageMark/fetchPrev',
      payload: {
        projectId: basicInfo.projectId,
        taskId: basicInfo.taskId,
        dataId: questionInfo.dataId,
      },
      callback: () => {
        // eslint-disable-next-line no-shadow
        const { questionInfo } = this.props;
        const { labelResult } = questionInfo;
        if (roleId === 'labeler') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            invalid: questionInfo.invalid,
            optionName: markTool.options.length ? markTool.options[0].optionName : '',
          });
        } else if (roleId === 'inspector') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
            optionName: markTool.options.length ? markTool.options[0].optionName : '',
          });
        }
        this.setState({
          coordinates: labelResult,
        });
      },
    });
  };

  handleTagChange = value => {
    const { form: { setFieldsValue } } = this.props;
    setFieldsValue({
      classifyName: value,
    });
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
        optionName: values.optionName,
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
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleGoBack}>返回</Button>
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
        render: (_, record, index) => (
          <a onClick={() => this.handleDelete(index)}>删除</a>
        ),
      },
    ];

    // console.log(this.state.coordinates);

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
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
                      src={questionInfo.data ? questionInfo.data.url : ''}
                      coordinates={this.state.coordinates}
                      onChange={this.changeCoordinate}
                      onDelete={this.deleteCoordinate}
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
                    roleId === 'inspector' &&
                    <Form.Item label="质检">
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
