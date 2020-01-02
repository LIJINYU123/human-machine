import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, Checkbox } from 'antd';
import ItemData from './map';

const { TextArea } = Input;

// eslint-disable-next-line max-len
const { FieldLabels, dialogInputOptions, historyRecordOptions, roleManageOptions, userManageOptions } = ItemData;

@connect(({ roleList, loading }) => ({
  roleList,
  submitting: loading.effects['roleList/createRole'],
}))
class RoleCreateView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { roleId, roleName, description, ...rest } = values;
        const fieldValues = {
          roleId,
          roleName,
          description,
          privileges: { ...rest },
        };

        dispatch({
          type: 'roleList/createRole',
          payload: fieldValues,
          callback: onCancel,
        });
      }
    });
  };

  checkRoleId = (rule, value, callback) => {
    const { roles } = this.props;
    if (!value) {
      callback('请输入角色唯一标识');
    } else if (roles.filter(role => role.roleId === value).length) {
      callback('该角色唯一标识已经存在');
    } else {
      callback();
    }
  };

  checkRoleName = (rule, value, callback) => {
    const { roles } = this.props;
    if (!value) {
      callback('请输入角色名称');
    } else if (roles.filter(role => role.roleName === value).length) {
      callback('该角色名称已经存在');
    } else {
      callback();
    }
  };

  render() {
    const { visible, onCancel, form: { getFieldDecorator }, submitting } = this.props;

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
        title="创建角色"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.roleId}>
            {
              getFieldDecorator('roleId', {
                rules: [
                  {
                    validator: this.checkRoleId,
                  },
                ],
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleName}>
            {
              getFieldDecorator('roleName', {
                rules: [
                  {
                    validator: this.checkRoleName,
                  },
                ],
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.description}>
            {
              getFieldDecorator('description', {
                initialValue: '',
              })(<TextArea rows={3}/>)
            }
          </Form.Item>
          <Divider/>
          <Form.Item label={FieldLabels.dialogInput}>
            {
              getFieldDecorator('dialogInput', {
                initialValue: [],
              })(<Checkbox.Group options={dialogInputOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.historyRecord}>
            {
              getFieldDecorator('historyRecord', {
                initialValue: [],
              })(<Checkbox.Group options={historyRecordOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleManage}>
            {
              getFieldDecorator('roleManage', {
                initialValue: [],
              })(<Checkbox.Group options={roleManageOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.userManage}>
            {
              getFieldDecorator('userManage', {
                initialValue: [],
              })(<Checkbox.Group options={userManageOptions} style={{ width: '100%' }} />)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(RoleCreateView);
