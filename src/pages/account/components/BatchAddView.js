import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal, Select, Input, InputNumber } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels } = ItemData;

@connect(({ userList, loading }) => ({
  userList,
  submitting: loading.effects['userList/batchAddUsers'],
}))
class BatchAddView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'userList/batchAddUsers',
          payload: values,
          callback: () => {
            dispatch({
              type: 'userList/fetchUsers',
              payload: { sorter: 'registerTime_descend' },
            });
            onCancel();
          },
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
    const { visible, onCancel, roleInfos, form: { getFieldDecorator }, submitting } = this.props;

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
        title="新建账户"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleId', {
                rules: [
                  {
                    required: true,
                    message: '请选择角色',
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
          <Form.Item label={FieldLabels.amount}>
            {
              getFieldDecorator('amount', {
                rules: [
                  {
                    required: true,
                    message: '请输入批量新建账户数量',
                  },
                ],
              })(<InputNumber style={{ width: '100%' }}/>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(BatchAddView);
