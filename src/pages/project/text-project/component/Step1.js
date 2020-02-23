import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select, InputNumber, DatePicker } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { FieldLabels, labelTypeName } = ItemData;

// eslint-disable-next-line max-len
const labelTypeOptions = Object.keys(labelTypeName).map(key => <Option key={key}>{labelTypeName[key]}</Option>);

@connect(({ textProjectFormData, loading }) => ({
  textProjectFormData,
  submitting: loading.effects['textProjectFormData/saveStepOneData'],
}))
class Step1 extends Component {
  state = {
    selectTaskType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/fetchMarkTool',
    });
  }

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'textProjectFormData/saveStepOneData',
          payload: values,
        });
      }
    });
  };

  render() {
    // eslint-disable-next-line max-len
    const { form: { getFieldDecorator } } = this.props;

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
      <Form hideRequiredMark>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.projectName} {...formItemLayout} >
              {
                getFieldDecorator('taskName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入任务名称',
                    },
                  ],
                  initialValue: '',
                })(<Input className={styles.formItem}/>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.labelType} {...formItemLayout} >
              {
                getFieldDecorator('labelType', {
                  initialValue: '',
                })(
                  <Select
                    dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '80%' }}
                    onChange={this.handleSelectChange}
                  >
                    {labelTypeOptions}
                  </Select>)
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
                  initialValue: 0,
                })(<InputNumber min={0} max={100} formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                className={styles.formItem}/>)
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
                  initialValue: 0,
                })(<InputNumber min={0} max={100} formatter={value => `${value}%`}
                                parser={value => value.replace('%', '')}
                                className={styles.formItem}/>)
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
                  initialValue: 'SY0123',
                })(<Select
                  dropdownMenuStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }} style={{ width: '80%' }}
                >
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
                  initialValue: 'SY0111',
                })(<Select
                  dropdownMenuStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }} style={{ width: '80%' }}
                >
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
                })(<InputNumber className={styles.formItem}/>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.projectPeriod} {...formItemLayout}>
              {
                getFieldDecorator('projectPeriod', {
                  rules: [
                    {
                      required: true,
                      message: '请选择项目周期',
                    },
                  ],
                })(
                  <RangePicker className={styles.formItem} allowClear={false} placeholder={['开始时间', '结束时间']}/>)
              }
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.description} {...formItemLayout}>
              {
                getFieldDecorator('description', {})(<TextArea autoSize className={styles.formItem}/>)
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
              <Button type="primary" onClick={this.onValidateForm}>下一步</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Step1);
