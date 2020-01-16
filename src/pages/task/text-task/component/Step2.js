import React, { Component } from 'react';
import { Button, Form, Select } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';

const { Option } = Select;
const { FieldLabels } = ItemData;

@connect(({ textTask, loading }) => ({
  stepTwo: textTask.stepTwo,
  members: textTask.members,
  submitting: loading.effects['textTask/saveStepTwoData'],
}))
class Step2 extends Component {
  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'textTask/fetchMembers',
    });
  }

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'textTask/saveStepTwoData',
          payload: values,
        });
      }
    });
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textTask/stepTwoPrevious',
    });
  };

  render() {
    const { stepTwo: { labeler, assessor, acceptor }, form: { getFieldDecorator }, members: { labelers, assessors, acceptors }, submitting } = this.props;

    // eslint-disable-next-line max-len
    const markerOptions = labelers.map(marker => <Option key={marker.userId}>{marker.userName}</Option>);
    // eslint-disable-next-line max-len
    const assessorOptions = assessors.map(assessor => <Option key={assessor.userId}>{assessor.userName}</Option>);
    // eslint-disable-next-line max-len
    const acceptorOptions = acceptors.map(acceptor => <Option key={acceptor.userId}>{acceptor.userName}</Option>);

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form {...formItemLayout} hideRequiredMark>
        <Form.Item label={FieldLabels.labeler}>
          {
            getFieldDecorator('labeler', {
              rules: [
                {
                  required: true,
                  message: '请选择标注员',
                },
              ],
              initialValue: labeler,
            })(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                style={{ width: '70%' }}
              >
                {markerOptions}
              </Select>)
          }
        </Form.Item>
        <Form.Item label={FieldLabels.assessor}>
          {
            getFieldDecorator('assessor', {
              rules: [
                {
                  required: true,
                  message: '请选择初审员',
                },
              ],
              initialValue: assessor,
            })(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                style={{ width: '70%' }}
              >
                {assessorOptions}
              </Select>)
          }
        </Form.Item>
        <Form.Item label={FieldLabels.acceptor}>
          {
            getFieldDecorator('acceptor', {
              rules: [
                {
                  required: true,
                  message: '请选择复审员',
                },
              ],
              initialValue: acceptor,
            })(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                style={{ width: '70%' }}
              >
                {acceptorOptions}
              </Select>)
          }
        </Form.Item>
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
          <Button type="primary" onClick={this.onValidateForm} loading={submitting}>
            下一步
          </Button>
          <Button onClick={this.onPrev} style={{ marginLeft: '8px' }}>
            上一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Step2);
