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
                initialValue: userInfo.userId,
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleId', {
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
