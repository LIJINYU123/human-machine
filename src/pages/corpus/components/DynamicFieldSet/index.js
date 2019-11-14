import React, { Component } from 'react';
import { Form, Input, Icon, Button, Row, Col, Popconfirm } from 'antd';
import styles from './style.less';

let userId = 0;
let customId = 0;

export default class DynamicFieldSet extends Component {
  handleUserRemove = userKey => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const userKeys = getFieldValue('userKeys');

    if (userKeys.length === 1) {
      return;
    }

    setFieldsValue({
      userKeys: userKeys.filter(key => key !== userKey),
    });
  };

  handleCustomerRemove = customKey => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const customKeys = getFieldValue('customKeys');

    if (customKeys.length === 1) {
      return;
    }

    setFieldsValue({
      customKeys: customKeys.filter(key => key !== customKey),
    });
  };

  getUserFields = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const userKeys = getFieldValue('userKeys');

    return userKeys.map((userKey, index) => (
      <Col span={8} style={{ height: '40px' }} key={userKey}>
        <Form.Item label={index === 0 ? '用户' : ''} key={userKey}>
          {
            getFieldDecorator(userKey, {
              rules: [
                {
                  required: true,
                  message: '请输入用户回答',
                }],
            })(<div style={{ display: 'flex' }}>
              <Input placeholder="请输入用户回答"/>
              {userKeys.length > 1 ? (
                <Icon className={styles.dynamicDeleteButton} type="minus-circle"
                      onClick={() => this.handleUserRemove(userKey)}/>) : null}
            </div>)
          }
        </Form.Item>
      </Col>
    ));
  };

  getCustomerFields = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const customKeys = getFieldValue('customKeys');

    return customKeys.map((customKey, index) => (
      <Col span={8} style={{ height: '40px' }} key={customKey}>
        <Form.Item label={index === 0 ? '客服' : ''} key={customKey}>
          {
            getFieldDecorator(customKey, {
              rules: [
                {
                  required: true,
                  message: '请输入客服回答',
                }],
            })(<span style={{ display: 'flex' }}>
                  <Input placeholder="请输入客服回答" />
              {customKeys.length > 1 ? (
                <Icon className={styles.dynamicDeleteButton} type="minus-circle" onClick={() => this.handleCustomerRemove(customKey)}/>) : null}
                </span>)
          }
        </Form.Item>
      </Col>
    ));
  };

  handleUserAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { groupNum } = this.props;
    const userKeys = getFieldValue('userKeys');

    const nextUserKeys = userKeys.concat(`group-${groupNum}-user-${userId++}`);
    setFieldsValue({
      userKeys: nextUserKeys,
    });
  };

  handleCustomerAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { groupNum } = this.props;
    const customKeys = getFieldValue('customKeys');

    const nextCustomKeys = customKeys.concat(`group-${groupNum}-customer-${customId++}`);
    setFieldsValue({
      customKeys: nextCustomKeys,
    });
  };


  render() {
    const { getFieldDecorator, groupNum } = this.props.form;
    getFieldDecorator('userKeys', { initialValue: [`group-${groupNum}-user-0`] });
    getFieldDecorator('customKeys', { initialValue: [`group-${groupNum}-custom-0`] });

    return (
      <div className={styles.dialogForm}>
        <Row gutter={24} type="flex">
          {this.getUserFields()}
          <Col span={8}>
            <Button type="dashed" onClick={this.handleUserAdd} style={{ width: '100%' }}><Icon type="plus" key="user" />新增</Button>
          </Col>
        </Row>
        <br/>
        <Row gutter={24} type="flex">
          {this.getCustomerFields()}
          <Col span={8}>
            <Button type="dashed" onClick={this.handleCustomerAdd} style={{ width: '100%' }}><Icon type="plus" key="customer" />新增</Button>
          </Col>
        </Row>
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Popconfirm title="你确定删除吗？" placement="top" okText="确认" cancelText="取消" >
              <Button type="danger">删除</Button>
            </Popconfirm>
          </Col>
        </Row>
      </div>
    );
  }
}
