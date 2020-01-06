import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels } = ItemData;

@connect(({ userList, loading }) => ({
  userList,
  submitting: loading.effects['userList/updateDetail'],
}))
class UserDetailView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'userList/updateDetail',
          payload: values,
          callback: onCancel,
        })
      }
    });
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, userInfo, roleInfos, form: { getFieldDecorator }, submitting } = this.props;
    // eslint-disable-next-line max-len
    const roleSelects = roleInfos.map(roleInfo => <Option key={roleInfo.roleId}>{roleInfo.roleName}</Option>);

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
      <Modal
        title="用户信息"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <Form.Item label={FieldLabels.userId}>
            {
              getFieldDecorator('userId', {
                initialValue: userInfo.userId,
              })(<Input disabled/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.name}>
            {
              getFieldDecorator('name', {
                initialValue: userInfo.name,
              })(<Input disabled/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleId', {
                initialValue: userInfo.roleName,
              })(
                <Select dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}>
                  {roleSelects}
                </Select>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.registerTime}>
            {
              getFieldDecorator('registerTime', {
                initialValue: userInfo.registerTime,
              })(<Input disabled/>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserDetailView);
