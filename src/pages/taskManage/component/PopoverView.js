import React, { Component } from 'react';
import { Button, Form } from 'antd';
import TagSelect from '@/components/TagSelect';
import { connect } from 'dva';

@connect(({ textMark }) => ({
  textMark,
}))
class PopoverView extends Component {
  onValidateForm = () => {
    // eslint-disable-next-line max-len
    const { form: { validateFieldsAndScroll, getFieldsValue }, taskId, dataId, onClose, onRefresh, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'textMark/saveTextMarkResult',
          payload: { taskId, dataId, labelResult: values.result },
          callback: () => {
            onClose();
            onRefresh();
          },
        });
      }
    });
  };

  render() {
    const { markTool, onClose, labelValues, form: { getFieldDecorator } } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Form {...formItemLayout}>
        <Form.Item label={markTool.classifyName}>
          {
            getFieldDecorator('result', {
              // eslint-disable-next-line max-len
              initialValue: labelValues,
            })(
              // eslint-disable-next-line max-len
              <TagSelect expandable style={{ minWidth: '400px' }} multiple={markTool.multiple}>
                {/* eslint-disable-next-line max-len */}
                {markTool.options.map(option => <TagSelect.Option value={option.optionName}>{option.optionName}</TagSelect.Option>)}
              </TagSelect>)
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
          }} label=""
        >
          <Button type="primary" size="small" onClick={this.onValidateForm}>确定</Button>
          <Button size="small" style={{ marginLeft: '8px' }} onClick={onClose}>取消</Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(PopoverView);
