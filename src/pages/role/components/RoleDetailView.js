import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Button, Form, Input, Divider, Checkbox } from 'antd';
import ItemData from './map';

const { TextArea } = Input;
// eslint-disable-next-line max-len
const { FieldLabels, dialogInputOptions, historyRecordOptions, roleManageOptions, userManageOptions } = ItemData;

@connect(({ roleList, loading }) => ({
  roleList,
  submitting: loading.effects['roleList/updateDetail'],
}))
class RoleDetailView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'roleList/updateDetail',
          payload: values,
          callback: onCancel,
        });
      }
    });
  };

  render() {
    const { visible, onCancel, roleInfo, form: { getFieldDecorator }, submitting } = this.props;

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
        title="角色详情"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.roleId}>
            {
              getFieldDecorator('roleId', {
                initialValue: roleInfo.roleId,
              })(<Input disabled/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleName', {
                rules: [
                  {
                    required: true,
                    message: '请输入角色名称',
                  },
                ],
                initialValue: roleInfo.roleName,
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.description}>
            {
              getFieldDecorator('description', {
                initialValue: roleInfo.description,
              })(<TextArea rows={3}/>)
            }
          </Form.Item>
          <Divider/>
          <Form.Item label={FieldLabels.dialogInput}>
            {
              getFieldDecorator('dialogInput', {
                initialValue: roleInfo.dialogInput,
              })(<Checkbox.Group options={dialogInputOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.historyRecord}>
            {
              getFieldDecorator('historyRecord', {
                initialValue: roleInfo.historyRecord,
              })(<Checkbox.Group options={historyRecordOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleManage}>
            {
              getFieldDecorator('roleManage', {
                initialValue: roleInfo.roleManage,
              })(<Checkbox.Group options={roleManageOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.userManage}>
            {
              getFieldDecorator('userManage', {
                initialValue: roleInfo.userManage,
              })(<Checkbox.Group options={userManageOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(RoleDetailView);
