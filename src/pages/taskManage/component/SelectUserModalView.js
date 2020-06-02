import React from 'react';
import { Modal, Form, Select } from 'antd';

const { Option } = Select;

const SelectUserModalView = props => {
  const { users, visible, onClose, onConfirm, form } = props;
  const { getFieldDecorator } = form;

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
    const { validateFieldsAndScroll, getFieldsValue } = form;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        onConfirm(values.userId);

        onClose();
      }
    });
  };

  return (
    <Modal
      title="选择用户"
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      destroyOnClose
    >
      <Form {...formItemLayout}>
        <Form.Item label="用户">
          {
            getFieldDecorator('userId', {
              rules: [
                {
                  required: true,
                  message: '请选择用户',
                },
              ],
            })(
              <Select>
                {
                  users.map(item => <Option value={item.userId}>{item.userName}</Option>)
                }
              </Select>)
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(SelectUserModalView);
