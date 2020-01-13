import React, { Component } from 'react';
import { Button, Col, Form, Icon, Input, Popconfirm, Row } from 'antd';
import styles from './DynamicFieldStyle.less';

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
    const { setFieldsValue } = this.props.form;
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
      const temp = {};
      temp[`${dialogId}-userKeys`] = userKeys;
      temp[`${dialogId}-customKeys`] = customKeys;
      temp[`${dialogId}-reverse`] = questioner !== 'customer';
      setFieldsValue(temp);

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
    const { getFieldValue, setFieldsValue } = this.props.form;
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
    const { dialogId, disabled } = this.props;
    const { detailDialogInfos } = this.state;
    let userKeys = [];
    if (Object.keys(detailDialogInfos).length > 0) {
      userKeys = getFieldValue(`${dialogId}-userKeys`);
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
              <Input placeholder="请输入用户回答" defaultValue={detailDialogInfos[userKey]} disabled={disabled}/>
              {userKeys.length > 1 ? (!disabled &&
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
    const { dialogId, disabled } = this.props;
    const { detailDialogInfos } = this.state;

    let customKeys = [];
    if (Object.keys(detailDialogInfos).length > 0) {
      customKeys = getFieldValue(`${dialogId}-customKeys`);
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
                  <Input placeholder="请输入客服回答" defaultValue={detailDialogInfos[customKey]} disabled={disabled}/>
              {customKeys.length > 1 ? (!disabled &&
                <Icon className={styles.dynamicDeleteButton} type="minus-circle" onClick={() => this.handleCustomerRemove(customKey)}/>) : null}
                </span>)
          }
        </Form.Item>
      </Col>
    ));
  };

  getDialogFields = (disabled, isReverse) => {
    if (isReverse) {
      return (
        <div>
          <Row gutter={24} type="flex">
            {this.getUserFields()}
            <Col span={8}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Button type="dashed" onClick={this.handleUserAdd} icon="plus" disabled={disabled}>新增</Button>
              </div>
            </Col>
          </Row>
          <br/>
          <Row gutter={24} type="flex">
            {this.getCustomerFields()}
            <Col span={8}>
              <div style={{ display: 'flex', flex: 1 }}>
                <Button type="dashed" onClick={this.handleCustomerAdd} icon="plus" disabled={disabled}>新增</Button>
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
              <Button type="dashed" onClick={this.handleCustomerAdd} icon="plus" disabled={disabled}>新增</Button>
            </div>
          </Col>
        </Row>
        <br/>
        <Row gutter={24} type="flex">
          {this.getUserFields()}
          <Col span={8}>
            <div style={{ display: 'flex', flex: 1 }}>
              <Button type="dashed" onClick={this.handleUserAdd} icon="plus" disabled={disabled}>新增</Button>
            </div>
          </Col>
        </Row>
      </div>
    );
  };

  handleUserAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const { detailDialogInfos } = this.state;
    const userKeys = getFieldValue(`${dialogId}-userKeys`);

    let { userId } = this.state;
    userId += 1;

    const nextUserKeys = userKeys.concat(`${dialogId}-user-${userId}`);
    const needSetFieldValue = {};
    needSetFieldValue[`${dialogId}-userKeys`] = nextUserKeys;
    setFieldsValue(needSetFieldValue);

    detailDialogInfos[`${dialogId}-user-${userId}`] = '';

    this.setState({
      userId,
      detailDialogInfos,
    });
  };

  handleCustomerAdd = () => {
    const { getFieldValue, setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const { detailDialogInfos } = this.state;
    const customKeys = getFieldValue(`${dialogId}-customKeys`);

    let { customId } = this.state;
    customId += 1;

    const nextCustomKeys = customKeys.concat(`${dialogId}-custom-${customId}`);
    const needSetFieldsVaule = {};
    needSetFieldsVaule[`${dialogId}-customKeys`] = nextCustomKeys;
    setFieldsValue(needSetFieldsVaule);

    this.setState({
      customId,
    });

    detailDialogInfos[`${dialogId}-custom-${customId}`] = '';

    this.setState({
      customId,
      detailDialogInfos,
    });
  };

  handleReverse = () => {
    const { setFieldsValue } = this.props.form;
    const { dialogId } = this.props;
    const { isReverse } = this.state;
    const needSetFieldsVaule = {};

    needSetFieldsVaule[`${dialogId}-reverse`] = !isReverse;
    setFieldsValue(needSetFieldsVaule);
    this.setState({
      isReverse: !isReverse,
    });
  };


  render() {
    const { getFieldDecorator } = this.props.form;
    const { dialogId, disabled } = this.props;
    const { isReverse } = this.state;
    getFieldDecorator(`${dialogId}-userKeys`, { initialValue: [`${dialogId}-user-0`] });
    getFieldDecorator(`${dialogId}-customKeys`, { initialValue: [`${dialogId}-custom-0`] });
    getFieldDecorator(`${dialogId}-reverse`, { initialValue: false });

    return (
      <div className={styles.dialogForm}>
        {this.getDialogFields(disabled, isReverse)}
        <Row>
          <Col span={24} style={{ textAlign: 'right' }}>
            <Button onClick={() => this.handleReverse(isReverse)} disabled={disabled}>反转</Button>
          </Col>
        </Row>
      </div>
    );
  }
}
