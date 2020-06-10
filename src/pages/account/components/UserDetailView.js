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
    // eslint-disable-next-line max-len
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel, userInfo } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { registerTime, ...rest } = values;
        dispatch({
          type: 'userList/updateDetail',
          payload: { ...rest, oldUserId: userInfo.userId },
          callback: () => {
            dispatch({
              type: 'userList/fetchUsers',
              payload: { sorter: 'updatedTime_descend' },
            });
            onCancel();
          },
        })
      }
    });
  };

  checkUserId = (rule, value, callback) => {
    if (typeof value === 'undefined' && !value.trim()) {
      callback('请输入用户名');
    } else if (!/^\w+$/.test(value.trim())) {
      callback('用户名只能包含字母、数字和下划线');
    } else if (value.trim().length < 5 || value.trim().length > 20) {
      callback('用户名长度范围在5~20之间');
    } else {
      callback();
    }
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, userInfo, roleInfos, groupInfos, form: { getFieldDecorator }, submitting } = this.props;
    // eslint-disable-next-line max-len
    const roleSelects = roleInfos.map(roleInfo => <Option key={roleInfo.roleId}>{roleInfo.roleName}</Option>);

    const groupSelects = groupInfos.map(info => <Option key={info.groupId}>{info.groupName}</Option>);

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
        title="账户编辑"
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
                rules: [
                  {
                    required: true,
                    validator: this.checkUserId,
                  },
                ],
                initialValue: userInfo.userId,
              })(<Input disabled/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleId', {
                rules: [
                  {
                    required: true,
                    message: '请选择角色',
                  },
                ],
                initialValue: userInfo.roleId,
              })(
                <Select dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}>
                  {roleSelects}
                </Select>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.group}>
            {
              getFieldDecorator('groupId', {
                initialValue: userInfo.groupId,
              })(<Select dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} mode="multiple">{groupSelects}</Select>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserDetailView);
