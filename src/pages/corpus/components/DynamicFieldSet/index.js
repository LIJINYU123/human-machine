import React, { Component } from 'react';
import { Form, Input, Icon, Button, Row, Col, Popconfirm } from 'antd';
import styles from './style.less';

export default class DynamicFieldSet extends Component {
  state = {
    userId: 0,
    customId: 0,
    isReverse: false,
  };

  handleUserRemove = userKey => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const userKeys = getFieldValue(`${dialogId}-userKeys`);

    if (userKeys.length === 1) {
      return;
    }

    const needSetFieldValue = {};
    needSetFieldValue[`${dialogId}-userKeys`] = userKeys.filter(key => key !== userKey);

    setFieldsValue(needSetFieldValue);
  };

  handleCustomerRemove = customKey => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const customKeys = getFieldValue(`${dialogId}-customKeys`);

    if (customKeys.length === 1) {
      return;
    }

    const needSetFieldValue = {};
    needSetFieldValue[`${dialogId}-customKeys`] = customKeys.filter(key => key !== customKey);

    setFieldsValue(needSetFieldValue);
  };

  getUserFields = () => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const { dialogId } = this.props;
    const userKeys = getFieldValue(`${dialogId}-userKeys`);

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
    const { dialogId } = this.props;
    const customKeys = getFieldValue(`${dialogId}-customKeys`);

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

  getDialogFields = isReverse => {
    if (isReverse) {
      return (
        <div>
          <Row gutter={24} type="flex">
            {this.getUserFields()}
            <Col span={8}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Button type="dashed" onClick={this.handleUserAdd}><Icon type="plus" key="user" />新增</Button>
              </div>
            </Col>
          </Row>
          <br/>
          <Row gutter={24} type="flex">
            {this.getCustomerFields()}
            <Col span={8}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Button type="dashed" onClick={this.handleCustomerAdd}><Icon type="plus" key="customer" />新增</Button>
              </div>
            </Col>
          </Row>
        </div>
      );
    }
    return (
      <div>
        <Row gutter={24} type="flex">
          {this.getCustomerFields()}
          <Col span={8}>
            <div style={{ display: 'flex', flex: 1 }}>
              <Button type="dashed" onClick={this.handleCustomerAdd}><Icon type="plus" key="customer" />新增</Button>
            </div>
          </Col>
        </Row>
        <br/>
        <Row gutter={24} type="flex">
          {this.getUserFields()}
          <Col span={8}>
            <div style={{ display: 'flex', flex: 1 }}>
              <Button type="dashed" onClick={this.handleUserAdd}><Icon type="plus" key="user" />新增</Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  handleUserAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const userKeys = getFieldValue(`${dialogId}-userKeys`);

    let { userId } = this.state;
    userId += 1;
    this.setState({
      userId,
    });
    const nextUserKeys = userKeys.concat(`${dialogId}-user-${userId}`);

    const needSetFieldValue = {};
    needSetFieldValue[`${dialogId}-userKeys`] = nextUserKeys;

    setFieldsValue(needSetFieldValue);
  };

  handleCustomerAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const customKeys = getFieldValue(`${dialogId}-customKeys`);

    let { customId } = this.state;
    customId += 1;
    this.setState({
      customId,
    });

    const nextCustomKeys = customKeys.concat(`${dialogId}-custom-${customId}`);
    const needSetFieldsVaule = {};
    needSetFieldsVaule[`${dialogId}-customKeys`] = nextCustomKeys;
    setFieldsValue(needSetFieldsVaule);
  };

  handleReverse = () => {
    const { setFieldsValue } = this.props.form;
    const { dialogId } = this.props;

    this.setState({
      isReverse: !this.state.isReverse,
    });
    const needSetFieldsVaule = {};
    needSetFieldsVaule[`${dialogId}-reverse`] = !this.state.isReverse;
    setFieldsValue(needSetFieldsVaule);
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { onRemove, dialogId, dialogLength } = this.props;
    getFieldDecorator(`${dialogId}-userKeys`, { initialValue: [`${dialogId}-user-0`] });
    getFieldDecorator(`${dialogId}-customKeys`, { initialValue: [`${dialogId}-custom-0`] });
    getFieldDecorator(`${dialogId}-reverse`, { initialValue: false });

    return (
      <div className={styles.dialogForm}>
        {this.getDialogFields(this.state.isReverse)}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button onClick={() => this.handleReverse(this.state.isReverse)}>反转</Button>
            {
              dialogLength > 1 &&
              <Popconfirm title="确认删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => onRemove(dialogId)} >
                <Button type="danger" style={{ marginLeft: '8px' }}>删除</Button>
              </Popconfirm>
            }
          </Col>
        </Row>
      </div>
    );
  }
}
