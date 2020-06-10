import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import ItemData from './map';

const { FieldLabels, Privileges, DepartmentType } = ItemData;
const { Option } = Select;

@connect(({ departmentList, loading }) => ({
  departmentList,
  submitting: loading.effects['departmentList/createDepartment'],
}))
class DepCreateView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'departmentList/createDepartment',
          payload: values,
          callback: () => {
            dispatch({
              type: 'departmentList/fetchDepartment',
              payload: { sorter: 'updatedTime_descend' },
            });

            dispatch({
              type: 'global/fetchAgency',
            });
            onCancel()
          },
        });
      }
    });
  };

  checkDepName = (rule, value, callback) => {
    const { departmentList: { data } } = this.props;
    if (typeof value === 'undefined' || !value.trim()) {
      callback('请输入机构名称');
    } else if (data.filter(department => department.departmentName === value).length) {
      callback('该机构名称已经存在');
    } else if (value.trim().length > 60) {
      callback('机构名称长度不能超过60个字符');
    } else {
      callback();
    }
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, form: { getFieldDecorator }, submitting } = this.props;

    const typeOptions = DepartmentType.map(type => <Option key={type.id}>{type.name}</Option>);

    const formItenLayout = {
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
        title="创建机构"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItenLayout}>
          <Form.Item label={FieldLabels.departmentName}>
            {
              getFieldDecorator('departmentName', {
                rules: [
                  {
                    required: true,
                    validator: this.checkDepName,
                  },
                ],
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.departmentType}>
            {
              getFieldDecorator('departmentType', {
                rules: [
                  {
                    required: true,
                    message: '请选择机构类型',
                  },
                ],
                initialValue: 'operationCenter',
              })(
                <Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                >
                  {typeOptions}
                </Select>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.privilege}>
            {
              getFieldDecorator('privilege', {
                rules: [
                  {
                    required: true,
                    message: '请选择机构权限',
                  },
                ],
              })(<TreeSelect treeData={Privileges} treeCheckable treeDefaultExpandAll/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.administrator}>
            {
              getFieldDecorator('administrator', {
                rules: [
                  {
                    required: true,
                    message: '请输入管理员账号',
                    whitespace: true,
                  },
                ],
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.dataAddress}>
            {
              getFieldDecorator('dataAddress', {
                rules: [
                  {
                    required: true,
                    message: '请输入数据存储地址',
                    whitespace: true,
                  },
                ],
                initialValue: 'localhost',
              })(<Input/>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DepCreateView);
