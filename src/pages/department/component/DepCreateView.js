import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select } from 'antd';
import ItemData from './map';

const { FieldLabels, Privileges } = ItemData;
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
    const { visible, onCancel, noDepAccounts, form: { getFieldDecorator }, submitting } = this.props;
    // eslint-disable-next-line max-len
    const accountOptions = noDepAccounts.map(account => <Option key={account.userId}>{`${account.userId}(${account.name})`}</Option>);

    // eslint-disable-next-line max-len
    const privilegeOptions = Privileges.map(privilege => <Option key={privilege.id}>{privilege.name}</Option>);

    const formItenLayout = {
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
        title="创建机构"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItenLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.departmentId}>
            {
              getFieldDecorator('departmentId', {
                rules: [
                  {
                    validator: this.checkDepId,
                  },
                ],
              })(<Input/>)
            }
          </Form.Item>
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
          <Form.Item label={FieldLabels.privilege}>
            {
              getFieldDecorator('privilege', {
                rules: [
                  {
                    required: true,
                    message: '请选择机构权限',
                  },
                ],
              })(<Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                  mode="multiple"
                >
                  {privilegeOptions}
                </Select>)
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
              })(
                <Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                  placeholder="请选择管理员"
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {accountOptions}
                </Select>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DepCreateView);
