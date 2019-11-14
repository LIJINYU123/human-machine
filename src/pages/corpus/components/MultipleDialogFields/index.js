import React, { Component } from 'react';
import { Button, Form } from 'antd';
import DynamicFieldSet from '../DynamicFieldSet';

let dialogId = 0;

export default class MultipleDialogField extends Component {
  handleClick = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const dialogKeys = getFieldValue('dialogKeys');
    const nextDialogKey = dialogKeys.concat(`dialog-${++dialogId}`);
    setFieldsValue({
      dialogKeys: nextDialogKey,
    });
  };

  handleRemove = dialogKey => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const dialogKeys = getFieldValue('dialogKeys');
    setFieldsValue({
      dialogKeys: dialogKeys.filter(key => key !== dialogKey),
    });
  };

  getMulipleDialogField = () => {
    const { getFieldValue, getFieldDecorator } = this.props.form;
    const dialogKeys = getFieldValue('dialogKeys');

    return dialogKeys.map(dialogKey => (
      <Form.Item key={dialogKey}>
        {
          getFieldDecorator(dialogKey, {})(
            <DynamicFieldSet dialogId={dialogKey} {...this.props} onRemove={this.handleRemove} dialogLength={dialogKeys.length} />,
          )
        }
      </Form.Item>
    ));
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    getFieldDecorator('dialogKeys', { initialValue: ['dialog-0'] });

    return (
      <div>
        {this.getMulipleDialogField()}
        <Button type="primary" style={{ float: 'right', marginRight: '24px' }} onClick={this.handleClick}>新增</Button>
      </div>

    );
  }
}
