import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Divider, Checkbox } from 'antd';
import ItemData from './map';

const { TextArea } = Input;

// eslint-disable-next-line max-len
const { FieldLabels, projectManageOptions, templateManageOptions, dataMarkOptions, roleManageOptions, userManageOptions } = ItemData;

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
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 18 },
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
        style={{ minWidth: '600px' }}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
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
          <Form.Item label={FieldLabels.projectManage}>
            {
              getFieldDecorator('projectManage', {
                initialValue: [],
              })(<Checkbox.Group options={projectManageOptions} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.templateManage}>
            {
              getFieldDecorator('templateManage', {})(
                <Checkbox.Group options={templateManageOptions} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.roleManage}>
            {
              getFieldDecorator('roleManage', {
                initialValue: [],
              })(<Checkbox.Group options={roleManageOptions} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.userManage}>
            {
              getFieldDecorator('userManage', {
                initialValue: [],
              })(<Checkbox.Group options={userManageOptions} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.dataMark}>
            {
              getFieldDecorator('dataMark', {
                initialValue: [],
              })(<Checkbox.Group options={dataMarkOptions} />)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(RoleCreateView);
