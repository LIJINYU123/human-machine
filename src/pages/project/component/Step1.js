import React, { Component } from 'react';
import {
  Button,
  Col,
  Form,
  Input,
  Row,
  Select,
  InputNumber,
  DatePicker,
  Radio,
} from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { FieldLabels, projectTypes } = ItemData;

@connect(({ textProjectFormData, loading }) => ({
  textProjectFormData,
  submitting: loading.effects['textProjectFormData/saveStepOneData'],
}))
class Step1 extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/fetchMembers',
    });
  }

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { labeler, inspector } = values;
        values.labeler = labeler.map(item => ({ userId: item.key, userName: item.label }));
        values.inspector = inspector.map(item => ({ userId: item.key, userName: item.label }));
        dispatch({
          type: 'textProjectFormData/saveStepOneData',
          payload: values,
        });
      }
    });
  };

  saveStepData = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, onCancel, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { labeler, inspector } = values;
        values.labeler = labeler.map(item => ({ userId: item.key, userName: item.label }));
        values.inspector = inspector.map(item => ({ userId: item.key, userName: item.label }));
        dispatch({
          type: 'textProjectFormData/saveStepOneData',
          payload: values,
          callback: () => {
            onCancel();
          },
        });
      }
    });
  };

  handleRadioClick = () => {
    const { textProjectFormData: { forever }, dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/saveRadio',
      payload: { forever: !forever },
    });
  };

  render() {
    // eslint-disable-next-line max-len
    const { form: { getFieldDecorator }, textProjectFormData: { stepOne, members, forever }, status } = this.props;
    const { projectName, projectType, passRate, checkRate, labeler, inspector, questionNum, projectPeriod, description } = stepOne;

    const { labelers, inspectors } = members;

    const labelerOptions = labelers.map(item => <Option key={item.userId}>{item.userName}</Option>);

    // eslint-disable-next-line max-len
    const inspectorOptions = inspectors.map(item => <Option key={item.userId}>{item.userName}</Option>);

    const projectTypeOptions = projectTypes.map(item => <Option key={item.label}>{item.label}</Option>);

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

    return (
      <Form>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.projectName} {...formItemLayout} >
              {
                getFieldDecorator('projectName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入项目名称',
                      whitespace: true,
                    },
                  ],
                  initialValue: projectName,
                })(<Input className={styles.formItem}/>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.projectType} {...formItemLayout}>
              {
                getFieldDecorator('projectType', {
                  rules: [
                    {
                      required: true,
                      message: '请选择项目类型',
                    },
                  ],
                  initialValue: projectType,
                })(
                  <Select dropdownMenuStyle={{
                  maxHeight: 400,
                  overflow: 'auto',
                }} style={{ width: '80%' }} disabled={status !== 'unPublish'}>{projectTypeOptions}</Select>)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.passRate} {...formItemLayout} >
              {
                getFieldDecorator('passRate', {
                  rules: [
                    {
                      required: true,
                      message: '请输入合格率',
                    },
                  ],
                  initialValue: passRate,
                })(<InputNumber min={0} max={100} formatter={value => `${value}%`} disabled={status !== 'unPublish'}
                                parser={value => value.replace('%', '')}
                                style={{ width: '80%' }}/>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.checkRate} {...formItemLayout}>
              {
                getFieldDecorator('checkRate', {
                  rules: [
                    {
                      required: true,
                      message: '请输入质检率',
                    },
                  ],
                  initialValue: checkRate,
                })(<InputNumber min={0} max={100} formatter={value => `${value}%`} disabled={status !== 'unPublish'}
                                parser={value => value.replace('%', '')}
                                style={{ width: '80%' }}/>)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.labeler} {...formItemLayout}>
              {
                getFieldDecorator('labeler', {
                  rules: [
                    {
                      required: true,
                      message: '请选择标注员',
                    },
                  ],
                  initialValue: labeler.map(item => ({ key: item.userId, label: item.userName })),
                })(<Select
                  labelInValue
                  dropdownMenuStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }} style={{ width: '80%' }}
                  mode="multiple"
                  disabled={status !== 'unPublish'}
                >
                  {labelerOptions}
                </Select>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.inspector} {...formItemLayout}>
              {
                getFieldDecorator('inspector', {
                  rules: [
                    {
                      required: true,
                      message: '请选择质检员',
                    },
                  ],
                  initialValue: inspector.map(item => ({ key: item.userId, label: item.userName })),
                })(<Select
                  labelInValue
                  dropdownMenuStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }} style={{ width: '80%' }}
                  mode="multiple"
                  disabled={status !== 'unPublish'}
                >
                  {inspectorOptions}
                </Select>)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.questionNum} {...formItemLayout}>
              {
                getFieldDecorator('questionNum', {
                  rules: [
                    {
                      required: true,
                      message: '请输入单任务题目数',
                    },
                  ],
                  initialValue: questionNum,
                })(<InputNumber style={{ width: '80%' }} disabled={status !== 'unPublish'}/>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.projectPeriod} {...formItemLayout}>
              {
                getFieldDecorator('projectPeriod', {
                  rules: [
                    {
                      required: !forever,
                      message: '请选择项目周期',
                    },
                  ],
                  initialValue: projectPeriod,
                })(
                  <RangePicker style={{ width: '70%' }} allowClear={false} placeholder={['开始时间', '结束时间']}/>)
              }
              {
                <Radio style={{ marginLeft: '8px' }} checked={forever} onClick={this.handleRadioClick}>永久</Radio>
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.description} {...formItemLayout}>
              {
                getFieldDecorator('description', {
                  initialValue: description,
                })(<TextArea autoSize className={styles.formItem}/>)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
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
              <Button onClick={this.saveStepData}>暂存</Button>
              <Button style={{ marginLeft: '8px' }} type="primary" onClick={this.onValidateForm}>下一步</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Step1);
