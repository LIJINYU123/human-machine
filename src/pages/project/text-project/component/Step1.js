import React, { Component } from 'react';
import { Button, Col, Form, Input, Row, Select } from 'antd';
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
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
    };

    return (
      <Form {...formItemLayout} hideRequiredMark>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.projectName}>
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
              {
                <a style={{ marginLeft: '10px' }} onClick={this.autoComplete}>自动生成</a>
              }
            </Form.Item>
          </Col>
          <Col md={12} sm={24}>
            <Form.Item label={FieldLabels.labelType}>
              {
                getFieldDecorator('labelType', {
                  initialValue: '',
                })(
                  <Select
                    dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                    style={{ width: '70%' }}
                    onChange={this.handleSelectChange}
                  >
                    {labelTypeOptions}
                  </Select>)
              }
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Step1);
