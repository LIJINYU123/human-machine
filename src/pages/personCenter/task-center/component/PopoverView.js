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
    const { form: { validateFieldsAndScroll, getFieldsValue }, taskId, dataId, onClose, markTools, onRefresh, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        let result = [];
        Object.keys(values).forEach(key => {
          if (values[key].length === 0) {
            delete values[key];
          } else {
            const tool = markTools.filter(markTool => markTool.toolId === key)[0];
            result = tool.options.filter(option => values[key].includes(option.optionId));
          }
        });

        dispatch({
          type: 'textMark/saveTextMarkResult',
          payload: { taskId, dataId, result },
          callback: () => {
            onClose();
            onRefresh();
          },
        });
      }
    });
  };

  render() {
    const { markTools, onClose, labelIds, form: { getFieldDecorator } } = this.props;

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
        {
          markTools.map(markTool => (
            <Form.Item label={markTool.toolName}>
              {
                getFieldDecorator(markTool.toolId, {
                  // eslint-disable-next-line max-len
                  initialValue: labelIds,
                })(
                  // eslint-disable-next-line max-len
                  <TagSelect expandable style={{ minWidth: '400px' }}>
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
