import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select, Cascader, InputNumber, DatePicker } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { Option } = Select;
const { RangePicker } = DatePicker;
const { TextArea } = Input;
const { FieldLabels, labelType } = ItemData;

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
        values.startTime = values.projectPeriod && values.projectPeriod[0].format('YYYY-MM-DD HH:mm:ss');
        values.endTime = values.projectPeriod && values.projectPeriod[1].format('YYYY-MM-DD HH:mm:ss');
        delete values.projectPeriod;

        dispatch({
          type: 'textProjectFormData/saveStepOneData',
          payload: values,
        });
      }
    });
  };

  render() {
    // eslint-disable-next-line max-len
    const { form: { getFieldDecorator }, textProjectFormData } = this.props;

    const { members: { labelers, inspectors } } = textProjectFormData;

    const labelerOptions = labelers.map(item => <Option key={item.userId}>{item.userName}</Option>);

    // eslint-disable-next-line max-len
    const inspectorOptions = inspectors.map(item => <Option key={item.userId}>{item.userName}</Option>);

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
                getFieldDecorator('projectName', {
                  rules: [
                    {
                      required: true,
                      message: '请输入项目名称',
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
                })(<Cascader options={labelType} style={{ width: '80%' }}/>)
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
                  initialValue: 0,
                })(<InputNumber min={0} max={100} formatter={value => `${value}%`}
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
                  initialValue: [],
                })(<Select
                  dropdownMenuStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }} style={{ width: '80%' }}
                  mode="multiple"
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
                  initialValue: [],
                })(<Select
                  dropdownMenuStyle={{
                    maxHeight: 400,
                    overflow: 'auto',
                  }} style={{ width: '80%' }}
                  mode="multiple"
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
                })(<InputNumber style={{ width: '80%' }}/>)
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
