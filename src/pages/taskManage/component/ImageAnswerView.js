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
import 'tui-image-editor/dist/tui-image-editor.css';
import ImageEditor from '@toast-ui/react-image-editor';
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
  };

  editorRef = React.createRef();

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
        const { questionInfo, form: { setFieldsValue } } = this.props;
        const { labelResult } = questionInfo;
        const editorInstance = this.editorRef.current.getInstance();

        labelResult.forEach(item => setTimeout(() => {
          editorInstance.addShape('rect', {
            fill: '',
            stroke: item.color,
            strokeWidth: 3,
            width: item.objProps.width,
            height: item.objProps.height,
            left: item.objProps.left,
            top: item.objProps.top,
          }).then(objectProps => {
            item.id = objectProps.id;
          });
        }));

        setFieldsValue({
          labelResult,
        });
      },
    });
  }

  handleGoBack = () => {
    router.goBack();
  };

  handleNextQuestion = () => {
    // 清除当前题目的图片中标注的内容
    const editorInstance = this.editorRef.current.getInstance();

    const { basicInfo, roleId } = this.state;
    const { dispatch, questionInfo, form: { getFieldsValue, setFieldsValue } } = this.props;
    const { labelResult } = questionInfo;
    labelResult.forEach(item => {
      const location = {
        left: editorInstance.getObjectPosition(item.id, 'left', 'top').x.toFixed(2),
        top: editorInstance.getObjectPosition(item.id, 'left', 'top').y.toFixed(2),
        right: editorInstance.getObjectPosition(item.id, 'right', 'bottom').x.toFixed(2),
        bottom: editorInstance.getObjectPosition(item.id, 'right', 'bottom').y.toFixed(2),
      };
      item.location = location;
      item.objProps = editorInstance.getObjectProperties(item.id, ['left', 'top', 'width', 'height'])
    });

    editorInstance.clearObjects();

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
          });
        } else if (roleId === 'inspector') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
          });
        }

        editorInstance.loadImageFromURL(questionInfo.data.url, 'SampleImage');

        // 根据新获取的标注结果渲染图片标注内容
        labelResult.forEach(item => setTimeout(() => {
          editorInstance.addShape('rect', {
            fill: '',
            stroke: item.color,
            strokeWidth: 3,
            width: item.objProps.width,
            height: item.objProps.height,
            left: item.objProps.left,
            top: item.objProps.top,
          }).then(objectProps => {
            item.id = objectProps.id;
          });
        }));

        editorInstance.stopDrawingMode();

        setFieldsValue({
          questionInfo,
        });
      },
    });
  };

  handleAddShape = () => {
    const editorInstance = this.editorRef.current.getInstance();
    editorInstance.addShape('rect', {
      fill: '',
      stroke: 'blue',
      strokeWidth: 3,
      width: 100,
      height: 50,
      left: 100,
      top: 150,
    }).then(objectProps => {
      console.log(objectProps.id);
      console.log(editorInstance.getObjectPosition(objectProps.id, 'left', 'top'));
      console.log(editorInstance.getObjectPosition(objectProps.id, 'right', 'bottom'));
    });
  };

  handlePrevQuestion = () => {
    // 清除当前题目的图片中标注的内容
    const editorInstance = this.editorRef.current.getInstance();
    editorInstance.clearObjects();

    const { basicInfo, roleId } = this.state;
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
          });
        } else if (roleId === 'inspector') {
          setFieldsValue({
            labelResult: questionInfo.labelResult,
            reviewResult: questionInfo.reviewResult,
            remark: questionInfo.remark,
          });
        }

        editorInstance.loadImageFromURL(questionInfo.data.url, 'SampleImage');

        // 根据新获取的标注结果渲染图片标注内容
        labelResult.forEach(item => setTimeout(() => {
          editorInstance.addShape('rect', {
            fill: '',
            stroke: item.color,
            strokeWidth: 3,
            width: item.objProps.width,
            height: item.objProps.height,
            left: item.objProps.left,
            top: item.objProps.top,
          }).then(objectProps => {
            item.id = objectProps.id;
          });
        }));

        setFieldsValue({
          questionInfo,
        });
      },
    });
  };

  handleTagClick = (optionName, color) => {
    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const values = getFieldsValue();
    const prevLabelResult = values.labelResult;
    const editorInstance = this.editorRef.current.getInstance();
    editorInstance.addShape('rect', {
      fill: '',
      stroke: color,
      strokeWidth: 3,
      width: 100,
      height: 50,
      left: 100,
      top: 150,
    }).then(objectProps => {
      const location = {
        left: editorInstance.getObjectPosition(objectProps.id, 'left', 'top').x,
        top: editorInstance.getObjectPosition(objectProps.id, 'left', 'top').y,
        right: editorInstance.getObjectPosition(objectProps.id, 'right', 'bottom').x,
        bottom: editorInstance.getObjectPosition(objectProps.id, 'right', 'bottom').y,
      };
      prevLabelResult.push({ id: objectProps.id, location, color, optionName, objProps: editorInstance.getObjectProperties(objectProps.id, ['left', 'top', 'width', 'height']) });
      setFieldsValue({
        labelResult: prevLabelResult,
      });
    });
  };

  handleDelete = index => {
    const editorInstance = this.editorRef.current.getInstance();

    const { form: { getFieldsValue, setFieldsValue } } = this.props;
    const values = getFieldsValue();

    const prevLabelResult = values.labelResult;
    editorInstance.removeObject(prevLabelResult[index].id);

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
        title: '结果',
        dataIndex: 'location',
        render: val => (typeof val !== 'undefined' ? `[${val.left}, ${val.top}] -> [${val.right}, ${val.bottom}]` : ''),
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
              <Col md={16} sm={24}>
                <Row gutter={[0, 32]}>
                  <Col md={{ span: formItemLayout.wrapperCol.sm.span, offset: formItemLayout.labelCol.sm.span }} sm={24}>
                    <ImageEditor
                      ref={this.editorRef}
                      includeUI={{
                        loadImage: {
                          path: questionInfo.data ? questionInfo.data.url : 'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=3252521864,872614242&fm=26&gp=0.jpg',
                          name: 'SampleImage',
                        },
                        menu: ['shape'],
                        uiSize: { height: '700px' },
                      }}
                      cssMaxWidth={700}
                      cssMaxHeight={500}
                      selectionStyle={{ cornerSize: 5, rotatingPointOffset: 20 }}
                    />
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col md={16} sm={24}>
                <Row>
                  <Form.Item label={markTool.classifyName}>
                    <Fragment>
                      {
                        markTool.options.map(item => <Tag color={item.color} style={{ cursor: 'pointer' }} onClick={() => this.handleTagClick(item.optionName, item.color)}>{item.optionName}</Tag>)
                      }
                    </Fragment>
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
