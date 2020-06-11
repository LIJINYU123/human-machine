import React from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';


const UserModifyView = props => {
  const { userInfo, visible, onCancel, form: { getFieldDecorator, validateFieldsAndScroll, getFieldsValue }, submitting, dispatch } = props;

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

  const handleConfirm = () => {
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'profile/modifyUserInfo',
          payload: values,
          callback: () => {
            dispatch({
              type: 'profile/fetchUserInfo',
              payload: { userId: values.userId },
            });
            onCancel();
          },
        });
      }
    });
  };

  return (
    <Modal
      title="资料编辑"
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      confirmLoading={submitting}
      onOk={handleConfirm}
      destroyOnClose
    >
      <Form {...formItemLayout}>
        <Form.Item label="用户名">
          {
            getFieldDecorator('userId', {
              initialValue: userInfo.userId,
            })(<Input disabled/>)
          }
        </Form.Item>
        <Form.Item label="角色">
          {
            <Input value={userInfo.roleName} disabled/>
          }
        </Form.Item>
        <Form.Item label="昵称">
          {
            getFieldDecorator('userName', {
              rules: [
                {
                  required: true,
                  message: '请输入昵称',
                  whitespace: true,
                },
              ],
              initialValue: userInfo.userName,
            })(<Input/>)
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default connect(({ profile, loading }) => ({
  userInfo: profile.userInfo,
  submitting: loading.effects['profile/modifyUserInfo'],
}))(Form.create()(UserModifyView));
