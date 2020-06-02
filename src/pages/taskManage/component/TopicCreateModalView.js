import React from 'react';
import { Form, Input, Modal, Select } from 'antd';
import EditableTagGroup from './EditableTagGroup';


const TopicCreateModalView = props => {
  const { visible, onClose, onConfirm, form } = props;
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


  return (
    <Modal
      title="关联话题"
      maskClosable={false}
      visible={visible}
      onCancel={onClose}
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
            })(<Select/>)
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
            })(<Select/>)
          }
        </Form.Item>
        {/*<Form.Item label="话题标签">*/}
        {/*  {*/}
        {/*    getFieldDecorator('tags', {*/}
        {/*      initialValue: [],*/}
        {/*    })(*/}
        {/*      <EditableTagGroup form={form} fieldName="tags"/>)*/}
        {/*  }*/}
        {/*</Form.Item>*/}
      </Form>
    </Modal>
  );
};

export default Form.create()(EditableTagGroup);
