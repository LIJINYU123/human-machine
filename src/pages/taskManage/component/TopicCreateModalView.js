import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import EditableTagGroup from './EditableTagGroup';

const { Option } = Select;

const TopicCreateModalView = props => {
  const { records, visible, onClose, onConfirm, form } = props;
  const { getFieldDecorator } = form;

  const options = records.map((_, index) => <Option value={index}>{`No${index + 1}`}</Option>);

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
        // console.log(values);
        onConfirm(values);
        onClose();
      }
    });
  };


  return (
    <Modal
      title="关联话题"
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
      onOk={handleConfirm}
      destroyOnClose
    >
      <Form {...formItemLayout}>
        <Form.Item label="话题">
          {
            getFieldDecorator('topic', {
              rules: [
                {
                  required: true,
                  message: '请输入话题名称',
                },
              ],
            })(<Input/>)
          }
        </Form.Item>
        <Form.Item label="开始位置">
          {
            getFieldDecorator('startIndex', {
              rules: [
                {
                  required: true,
                  message: '请选择开始位置',
                },
              ],
            })(<Select>{options}</Select>)
          }
        </Form.Item>
        <Form.Item label="结束位置">
          {
            getFieldDecorator('endIndex', {
              rules: [
                {
                  required: true,
                  message: '请选择结束位置',
                },
              ],
            })(<Select>{options}</Select>)
          }
        </Form.Item>
        <Form.Item label="话题标签">
          {
            getFieldDecorator('tags', {
              initialValue: [],
            })(
              <EditableTagGroup form={form} fieldName="tags"/>)
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(TopicCreateModalView);
