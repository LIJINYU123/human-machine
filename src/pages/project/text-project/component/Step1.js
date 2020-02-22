import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select, InputNumber } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { Option } = Select;
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
                })(<Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} className={styles.formItem}
                >
                </Select>)
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.inspector} {...formItemLayout}>

            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Step1);
