import React, { Component } from 'react';
import styles from './DynamicFieldStyle.less';
import { Button, Col, Form, Icon, Input, Popconfirm, Row } from 'antd';

export default class DynamicFieldSet extends Component {
  state = {
    userId: 0,
    customId: 0,
    isReverse: false,
    detailDialogInfos: {},
    isReceiveAllProps: false,
  };

  componentWillReceiveProps(nextProps, _) {
    const { dialogInfos } = nextProps;
    const { dialogId } = this.props;
    const findDialogNumPattern = /dialog-(\d{1,})/g;
    findDialogNumPattern.lastIndex = 0;
    const result = findDialogNumPattern.exec(dialogId);
    const dialogInfo = dialogInfos[result[1].toString()];
    const { user, customer, questioner } = dialogInfo;
    const userKeys = user.map((_, index) => `${dialogId}-user-${index}`);
    const customKeys = customer.map((_, index) => `${dialogId}-custom-${index}`);


    if (!this.state.isReceiveAllProps) {
      const needSetFieldValue = {};
      userKeys.forEach((userKey, index) => {
        needSetFieldValue[userKey] = user[index];
      });
      customKeys.forEach((customKey, index) => {
        needSetFieldValue[customKey] = customer[index];
      });
      needSetFieldValue[`${dialogId}-userKeys`] = userKeys;
      needSetFieldValue[`${dialogId}-customKeys`] = customKeys;
      this.setState({
        userId: userKeys.length > 0 ? userKeys.length - 1 : 0,
        customId: customKeys.length > 0 ? customKeys.length - 1 : 0,
        isReverse: questioner !== 'customer',
        detailDialogInfos: needSetFieldValue,
        isReceiveAllProps: true,
      });
      console.log('call componentWillReceiveProps');
    }
  }

  handleUserRemove = userKey => {
    const { dialogId } = this.props;
    const { detailDialogInfos } = this.state;
    const userKeys = detailDialogInfos[`${dialogId}-userKeys`];

    if (userKeys.length === 1) {
      return;
    }

    detailDialogInfos[`${dialogId}-userKeys`] = userKeys.filter(key => key !== userKey);
    delete detailDialogInfos[userKey];

    console.log(detailDialogInfos);
    this.setState({
      detailDialogInfos,
    });
  };

  handleCustomerRemove = customKey => {
    const { dialogId } = this.props;
    const { detailDialogInfos } = this.state;
    const customKeys = detailDialogInfos[`${dialogId}-customKeys`];

    if (customKeys.length === 1) {
      return;
    }

    detailDialogInfos[`${dialogId}-customKeys`] = customKeys.filter(key => key !== customKey);
    delete detailDialogInfos[customKey];
    console.log(detailDialogInfos);
    this.setState({
      detailDialogInfos,
    });
  };

  getUserFields = () => {
    const { getFieldDecorator } = this.props.form;
    const { detailDialogInfos } = this.state;
    const { dialogId } = this.props;
    let userKeys = [];
    if (dialogId > 0) {
      userKeys.push(`${dialogId}-user-0`);
    }
    if (Object.keys(detailDialogInfos).length > 0) {
      userKeys = detailDialogInfos[`${dialogId}-userKeys`];
    }

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
              initialValue: detailDialogInfos[userKey],
            })(<div style={{ display: 'flex' }}>
              <Input placeholder="请输入用户回答" defaultValue={detailDialogInfos[userKey]}/>
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
    const { getFieldDecorator } = this.props.form;
    const { detailDialogInfos } = this.state;
    const { dialogId } = this.props;
    let customKeys = [];
    if (dialogId > 0) {
      customKeys.push(`${dialogId}-custom-0`);
    }
    if (Object.keys(detailDialogInfos).length > 0) {
      customKeys = detailDialogInfos[`${dialogId}-customKeys`];
    }

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
              initialValue: detailDialogInfos[customKey],
            })(<span style={{ display: 'flex' }}>
                  <Input placeholder="请输入客服回答" defaultValue={detailDialogInfos[customKey]} />
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
    const { dialogId } = this.props;
    const { detailDialogInfos } = this.state;

    const userKeys = detailDialogInfos[`${dialogId}-userKeys`];

    let { userId } = this.state;
    userId += 1;

    detailDialogInfos[`${dialogId}-userKeys`] = userKeys.concat(`${dialogId}-user-${userId}`);
    detailDialogInfos[`${dialogId}-user-${userId}`] = '';

    console.log(dialogId);
    console.log(detailDialogInfos);

    this.setState({
      userId,
      detailDialogInfos,
    });
  };

  handleCustomerAdd = () => {
    const { dialogId } = this.props;
    const { detailDialogInfos } = this.state;
    const customKeys = detailDialogInfos[`${dialogId}-customKeys`];

    let { customId } = this.state;
    customId += 1;
    this.setState({
      customId,
    });

    detailDialogInfos[`${dialogId}-customKeys`] = customKeys.concat(`${dialogId}-customer-${customId}`);
    detailDialogInfos[`${dialogId}-customer-${customId}`] = '';

    this.setState({
      customId,
      detailDialogInfos,
    });
  };

  handleReverse = () => {
    const { isReverse } = this.state;
    this.setState({
      isReverse: !isReverse,
    });
  };


  render() {
    const { onRemove, dialogId, dialogLength } = this.props;
    const { isReverse } = this.state;

    return (
      <div className={styles.dialogForm}>
        {this.getDialogFields(isReverse)}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button onClick={() => this.handleReverse(isReverse)}>反转</Button>
            {
              dialogLength > 1 &&
              <Popconfirm title="你确定删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => onRemove(dialogId)} >
                <Button type="danger" style={{ marginLeft: '8px' }}>删除</Button>
              </Popconfirm>
            }
          </Col>
        </Row>
      </div>
    );
  }
}
