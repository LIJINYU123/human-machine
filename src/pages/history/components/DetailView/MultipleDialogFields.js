import React, { Component } from 'react';
import { Button, Form } from 'antd';
import DynamicFieldSet from './DynamicFieldSet';
import NewDynamicFieldSet from './NewDynamicFieldSet';

let dialogId = 0;

export default class MultipleDialogField extends Component {
  state = {
    dialogKeys: ['dialog-0'],
    newDialogKeys: [],
  };

  componentWillReceiveProps(nextProps, _) {
    const { dialogInfos } = nextProps;
    // console.log(dialogInfos);
    const dialogKeys = dialogInfos.map((_, index) => `dialog-${index}`);
    this.setState({
      dialogKeys,
    });
    dialogId = dialogInfos.length > 0 ? dialogInfos.length - 1 : 0;
  }

  handleAdd = () => {
    const { newDialogKeys } = this.state;
    const nextDialogKey = newDialogKeys.concat(`dialog-${++dialogId}`);
    this.setState({
      newDialogKeys: nextDialogKey,
    });
  };

  handleRemove = dialogKey => {
    const { dialogKeys, newDialogKeys } = this.state;
    this.setState({
      dialogKeys: dialogKeys.filter(key => key !== dialogKey),
    });
    this.setState({
      newDialogKeys: newDialogKeys.filter(key => key !== dialogKey),
    });
  };

  getMulipleDialogField = () => {
    const { dialogKeys, newDialogKeys } = this.state;

    let allDialogForms = dialogKeys.map(dialogKey => (
      <Form.Item key={dialogKey}>
        {
          // eslint-disable-next-line max-len
          <DynamicFieldSet dialogId={dialogKey} {...this.props} onRemove={this.handleRemove}
                           dialogLength={dialogKeys.length} key={dialogKey}/>
        }
      </Form.Item>
    ));
    const newDialogForms = newDialogKeys.map(dialogKey => (
      <Form.Item key={dialogKey}>
        {
          // eslint-disable-next-line max-len
          <NewDynamicFieldSet dialogId={dialogKey} {...this.props} onRemove={this.handleRemove} key={dialogKey} />
        }
      </Form.Item>
    ));
    if (newDialogForms.length > 0) {
      allDialogForms = allDialogForms.concat(newDialogForms);
    }
    return allDialogForms;
  };

  render() {
    return (
      <div>
        {this.getMulipleDialogField()}
        <Button type="primary" style={{ float: 'right', marginRight: '24px' }} onClick={this.handleAdd}>新增</Button>
      </div>

    );
  }
}
