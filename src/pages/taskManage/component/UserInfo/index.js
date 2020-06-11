import React, { useEffect } from 'react';
import { Input, InputNumber, Select, Form, Row, Col, TreeSelect } from 'antd';
import EditAbleTagGroup from '../EditableTagGroup';
import ItemData from '../../map';

const { Option } = Select;
const { FieldLabels, SexOptions, AppearanceTreeData, ProfessionOptions, EntourageOptions } = ItemData;


const UserInfo = props => {
  const { form, user, disabled } = props;
  const { getFieldDecorator } = form;

  useEffect(() => {
    getFieldDecorator(`userInfo[${user.userId}].userId`, {
      initialValue: user.userId,
    })(<Input/>);
  });

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

  const formItemLayout2 = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 2 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 20 },
    },
  };

  const dropdownStyle = { maxHeight: '400px', overflow: 'auto' };
  const colorGroups = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];

  return (
    <Form {...formItemLayout}>
      <Row>
        <Col md={8} sm={12}>
          <Form.Item label={FieldLabels.sex}>
            {
              getFieldDecorator(`userInfo[${user.userId}].sex`, {
                rules: [
                  {
                    required: true,
                    message: '请输入性别',
                  },
                ],
                initialValue: user.sex,
              })(<Select dropdownMenuStyle={dropdownStyle} disabled={disabled}>{SexOptions.map(option => <Option key={option.key} value={option.value}>{option.value}</Option>)}</Select>)
            }
          </Form.Item>
        </Col>
        <Col md={8} sm={12}>
          <Form.Item label={FieldLabels.age}>
            {
              getFieldDecorator(`userInfo[${user.userId}].age`, {
                rules: [
                  {
                    required: true,
                    message: '请输入年龄',
                  },
                ],
                initialValue: user.age,
              })(<InputNumber min={0} style={{ width: '100%' }} disabled={disabled}/>)
            }
          </Form.Item>
        </Col>
        <Col md={8} sm={12}>
          <Form.Item label={FieldLabels.appearance}>
            {
              getFieldDecorator(`userInfo[${user.userId}].appearance`, {
                rules: [
                  {
                    required: true,
                    message: '请选择外貌',
                  },
                ],
                initialValue: user.appearance,
              })(<TreeSelect treeData={AppearanceTreeData} multiple allowClear disabled={disabled}/>)
            }
          </Form.Item>
        </Col>
        <Col md={8} sm={12}>
          <Form.Item label={FieldLabels.profession}>
            {
              getFieldDecorator(`userInfo[${user.userId}].profession`, {
                rules: [
                  {
                    required: true,
                    message: '请选择职业',
                  },
                ],
                initialValue: user.profession,
              })(<Select dropdownMenuStyle={dropdownStyle} disabled={disabled}>{ProfessionOptions.map(option => <Option key={option.key} value={option.value}>{option.value}</Option>)}</Select>)
            }
          </Form.Item>
        </Col>
        <Col md={8} sm={12}>
          <Form.Item label={FieldLabels.figure}>
            {
              getFieldDecorator(`userInfo[${user.userId}].figure`, {
                rules: [
                  {
                    required: true,
                    message: '请输入形象气质',
                  },
                ],
                initialValue: user.figure,
              })(<Input disabled={disabled}/>)
            }
          </Form.Item>
        </Col>
        <Col md={8} sm={12}>
          <Form.Item label={FieldLabels.entourage}>
            {
              getFieldDecorator(`userInfo[${user.userId}].entourage`, {
                rules: [
                  {
                    required: 'true',
                    message: '请选择陪同人员',
                  },
                ],
                initialValue: user.entourage,
              })(<Select dropdownMenuStyle={dropdownStyle} disabled={disabled}>{EntourageOptions.map(option => <Option key={option.key} value={option.value}>{option.value}</Option>)}</Select>)
            }
          </Form.Item>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Item label={FieldLabels.userTag} {...formItemLayout2}>
            {
              getFieldDecorator(`userInfo[${user.userId}].userTag`, {
                initialValue: user.userTag,
              })(<EditAbleTagGroup form={form} fieldName={`userInfo[${user.userId}].userTag`} disabled={disabled}/>)
            }
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};


export default UserInfo;
