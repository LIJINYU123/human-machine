import React from 'react';
import { Button, Form, Input, Modal, Select, TreeSelect } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels, Privileges, DepartmentType } = ItemData;

const typeOptions = DepartmentType.map(type => <Option key={type.id}>{type.name}</Option>);

const DepEditView = props => {
  const { visible, onCancel, departmentInfo } = props;

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
      title="机构详情"
      maskClosable={false}
      visible={visible}
      onCancel={onCancel}
      footer={[
        <Button key="back" onClick={onCancel}>返回</Button>,
      ]}
      destroyOnClose
    >
      <Form {...formItemLayout}>
        <Form.Item label={FieldLabels.departmentName}>
          <Input value={departmentInfo.departmentName} disabled/>
        </Form.Item>
        <Form.Item label={FieldLabels.departmentType}>
          <Select value={departmentInfo.departmentType} disabled>
            {typeOptions}
          </Select>
        </Form.Item>
        <Form.Item label={FieldLabels.privilege}>
          <TreeSelect treeData={Privileges} treeCheckable value={departmentInfo.privilege} disabled/>
        </Form.Item>
        <Form.Item label={FieldLabels.administrator}>
          <Input value={departmentInfo.administrator} disabled/>
        </Form.Item>
        <Form.Item label={FieldLabels.dataAddress}>
          <Input value={departmentInfo.dataAddress} disabled/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default DepEditView;
