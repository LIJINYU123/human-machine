import React, { Component } from 'react';
import { Button, Form } from 'antd';
import TagSelect from './TagSelect';
import { connect } from 'dva';

@connect(({ textMark }) => ({
  textMark,
}))
class PopoverView extends Component {
  onValidateForm = () => {
    // eslint-disable-next-line max-len
    const { form: { validateFieldsAndScroll, getFieldsValue }, dataId, onClose, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'textMark/saveTextMarkResult',
          payload: { dataId, labelResult: values },
          callback: () => {
            onClose();
          },
        });
      }
    });
  };

  render() {
    const { markTools, onClose, form: { getFieldDecorator } } = this.props;

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
      <Form {...formItemLayout}>
        {
          markTools.map(markTool => (
            <Form.Item label={markTool.toolName}>
              {
                getFieldDecorator(markTool.toolId)(
                  <TagSelect expandable>
                    {/* eslint-disable-next-line max-len */}
                    {markTool.options.map(option => <TagSelect.Option value={option.optionId}>{option.optionName}</TagSelect.Option>)}
                  </TagSelect>)
              }
            </Form.Item>
          ))
        }
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
