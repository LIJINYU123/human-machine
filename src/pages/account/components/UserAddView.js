import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels } = ItemData;

@connect(({ userList, loading }) => ({
  userList,
  submitting: loading.effects['userList/updateDetail'],
}))
class UserAddView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    const departmentId = localStorage.getItem('DepartmentId');
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const fieldValues = {
          ...values,
          departmentId,
        };
        dispatch({
          type: 'userList/updateDetail',
          payload: fieldValues,
          callback: onCancel,
        })
      }
    });
  };

  checkUserId = (rule, value, callback) => {
    if (!value) {
      callback('请选择添加的用户');
    } else {
      callback();
    }
  };

  checkRole = (rule, value, callback) => {
    if (!value) {
      callback('请选择角色');
    } else {
      callback();
    }
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, noDepAccounts, roleInfos, form: { getFieldDecorator }, submitting } = this.props;

    const accountOptions = noDepAccounts.map(account => <Option key={account.userId}>{`${account.userId}(${account.name})`}</Option>);
    // eslint-disable-next-line max-len
    const roleOptions = roleInfos.map(roleInfo => <Option key={roleInfo.roleId}>{roleInfo.roleName}</Option>);

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
        title="添加用户"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
      >
        <Form {...formItemLayout}>
          <Form.Item label={FieldLabels.userId}>
            {
              getFieldDecorator('userId', {
                rules: [
                  {
                    validator: this.checkUserId,
                  },
                ],
              })(
                <Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请添加用户"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {accountOptions}
                </Select>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleId', {
                rules: [
                  {
                    validator: this.checkRole,
                  },
                ],
              })(
                <Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择角色"
                >
                  {roleOptions}
                </Select>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(UserAddView);
