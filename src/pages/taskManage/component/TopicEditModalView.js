import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import EditableTagGroup from './EditableTagGroup';

const { Option } = Select;

const TopicEditModalView = props => {
  const { records, topic, index, visible, onClose, onConfirm, form } = props;
  const { getFieldDecorator } = form;

  const options = records.map((_, i) => <Option value={i}>{`No${i + 1}`}</Option>);

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
        onConfirm(values, index);
        onClose();
      }
    });
  };

  return (
    <Modal
      title="编辑话题"
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
              initialValue: topic.topic,
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
              initialValue: topic.startIndex,
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
              initialValue: topic.endIndex,
            })(<Select>{options}</Select>)
          }
        </Form.Item>
        <Form.Item label="话题标签">
          {
            getFieldDecorator('tags', {
              initialValue: topic.tags,
            })(
              <EditableTagGroup form={form} fieldName="tags"/>)
          }
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default Form.create()(TopicEditModalView);
