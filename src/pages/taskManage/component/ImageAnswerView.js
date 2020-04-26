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
  Icon,
  ConfigProvider,
  Empty,
  Tag,
} from 'antd'
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import 'tui-image-editor/dist/tui-image-editor.css'
import ImageEditor from '@toast-ui/react-image-editor'
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
    shapeId: '',
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
        const { questionInfo } = this.props;
        const editorInstance = this.editorRef.current.getInstance();
        editorInstance.addShape('rect', {
          fill: '',
          stroke: 'blue',
          strokeWidth: 3,
          width: 100,
          height: 50,
          left: 100,
          top: 50,
        });
      },
    });
  }

  handleGoBack = () => {
    router.goBack();
  };

  handleNextQuestion = () => {
    const { basicInfo, roleId } = this.state;
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

  getInfo = () => {
    const editorInstance = this.editorRef.current.getInstance();
    console.log(editorInstance.getObjectPosition(null, 'left', 'top'));
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

  handleMoved = () => {
    console.log('fdfdfdf');
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
                          path: 'https://t8.baidu.com/it/u=1484500186,1503043093&fm=79&app=86&size=h300&n=0&g=4n&f=jpeg?sec=1588315105&t=ed577b96f4f9a0b688d569c4b4789268',
                          name: 'SampleImage',
                        },
                        menu: ['shape'],
                        uiSize: { height: '700px' },
                      }}
                      cssMaxWidth={700}
                      cssMaxHeight={500}
                      selectionStyle={{ cornerSize: 5, rotatingPointOffset: 20 }}
                      onObjectMoved={this.handleMoved}
                    />
                  </Col>
                </Row>
                <Row>
                  <Form.Item label="物体">
                    <Fragment>
                      {
                        ['家电', '家具', '人物'].map(item => <Tag color="blue" style={{ cursor: 'pointer' }}>{item}</Tag>)
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
                    <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.getInfo}>获取信息</Button>
                    <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.handleAddShape}>增加形状</Button>
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
            </Row>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ImageAnswerView);
