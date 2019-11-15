import React, { Component } from 'react';
import { Button, Form } from 'antd';
import DynamicFieldSet from '../DynamicFieldSet';

let dialogId = 0;

export default class MultipleDialogField extends Component {
  state = {
    dialogKeys: ['dialog-0'],
  };

  handleClick = () => {
    const { dialogKeys } = this.state;
    const nextDialogKey = dialogKeys.concat(`dialog-${++dialogId}`);
    this.setState({
      dialogKeys: nextDialogKey,
    });
  };

  handleRemove = dialogKey => {
    const { dialogKeys } = this.state;
    this.setState({
      dialogKeys: dialogKeys.filter(key => key !== dialogKey),
    });
  };

  getMulipleDialogField = () => {
    const { dialogKeys } = this.state;

    return dialogKeys.map(dialogKey => (
      <Form.Item key={dialogKey}>
        {
          <DynamicFieldSet dialogId={dialogKey} {...this.props} onRemove={this.handleRemove}
                           dialogLength={dialogKeys.length}/>
        }
      </Form.Item>
    ));
  };

  render() {
    return (
      <div>
        {this.getMulipleDialogField()}
        <Button type="primary" style={{ float: 'right', marginRight: '24px' }} onClick={this.handleClick}>新增</Button>
      </div>

    );
  }
}
