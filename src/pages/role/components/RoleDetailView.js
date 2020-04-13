import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, Checkbox } from 'antd';
import ItemData from './map';

const { TextArea } = Input;
// eslint-disable-next-line max-len
const { FieldLabels, roleManageOptions, userManageOptions, projectManageOptions, templateManageOptions, dataMarkOptions } = ItemData;

@connect(({ roleList, loading }) => ({
  roleList,
  submitting: loading.effects['roleList/updateDetail'],
}))
class RoleDetailView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, roleInfo, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { roleName, description, ...rest } = values;
        const fieldValues = {
          roleId: roleInfo.roleId,
          roleName,
          description,
          privileges: { ...rest },
        };

        dispatch({
          type: 'roleList/updateDetail',
          payload: fieldValues,
          callback: () => {
            dispatch({
              type: 'roleList/fetchRole',
              payload: { sorter: 'updatedTime_descend' },
            });
            onCancel();
          },
        });
      }
    });
  };

  render() {
    const { visible, onCancel, roleInfo, form: { getFieldDecorator }, submitting } = this.props;

    const { privileges } = roleInfo;
    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
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
        style={{ minWidth: '600px' }}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
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
          <Form.Item label={FieldLabels.projectManage}>
            {
              getFieldDecorator('projectManage', {
                initialValue: privileges ? privileges.projectManage : [],
              })(<Checkbox.Group options={projectManageOptions} disabled={['projectAdmin', 'labeler', 'inspector'].includes(roleInfo.roleId)} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.templateManage}>
            {
              getFieldDecorator('templateManage', {})(
                <Checkbox.Group options={templateManageOptions} disabled={['projectAdmin', 'labeler', 'inspector'].includes(roleInfo.roleId)} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleManage}>
            {
              getFieldDecorator('roleManage', {
                initialValue: privileges ? privileges.roleManage : [],
              })(<Checkbox.Group options={roleManageOptions} disabled={['projectAdmin', 'labeler', 'inspector'].includes(roleInfo.roleId)} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.userManage}>
            {
              getFieldDecorator('userManage', {
                initialValue: privileges ? privileges.userManage : [],
              })(<Checkbox.Group options={userManageOptions} disabled={['projectAdmin', 'labeler', 'inspector'].includes(roleInfo.roleId)} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.dataMark}>
            {
              getFieldDecorator('dataMark', {
                initialValue: privileges ? privileges.dataMark : [],
              })(<Checkbox.Group options={dataMarkOptions} disabled={['projectAdmin', 'labeler', 'inspector'].includes(roleInfo.roleId)} />)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(RoleDetailView);
