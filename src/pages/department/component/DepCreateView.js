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
          callback: onCancel,
        });
      }
    });
  };

  checkDepId = (rule, value, callback) => {
    const { departmentList: { data } } = this.props;
    if (!value) {
      callback('请输入机构唯一标识');
    } else if (data.filter(department => department.departmentId === value).length) {
      callback('该机构唯一标识已经存在');
    } else {
      callback();
    }
  };

  checkDepName = (rule, value, callback) => {
    const { departmentList: { data } } = this.props;
    if (!value) {
      callback('请输入机构名称');
    } else if (data.filter(department => department.departmentName === value).length) {
      callback('该机构名称已经存在');
    } else {
      callback();
    }
  };

  checkAdministrator = (rule, value, callback) => {
    if (!value) {
      callback('请选择管理员账号');
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
        <Form {...formItenLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.departmentName}>
            {
              getFieldDecorator('departmentName', {
                rules: [
                  {
                    validator: this.checkDepName,
                  },
                ],
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.departmentType}>
            {
              getFieldDecorator('departmentType', {
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
                    validator: this.checkAdministrator,
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
