import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select, TreeSelect } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels, Privileges, DepartmentType } = ItemData;

@connect(({ departmentList, loading }) => ({
  departmentList,
  submitting: loading.effects['departmentList/updateDepartment'],
}))
class DepDetailView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, departmentInfo, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'departmentList/updateDepartment',
          payload: { departmentId: departmentInfo.departmentId, oldAdministrator: departmentInfo.administrator, ...values },
          callback: onCancel,
        });
      }
    });
  };

  checkDepName = (rule, value, callback) => {
    const { departmentList: { data }, departmentInfo } = this.props;
    if (!value.trim()) {
      callback('请输入机构名称');
    } else if (data.filter(department => department.departmentName !== departmentInfo.departmentName && department.departmentName === value).length) {
      callback('该机构名称已经存在');
    } else {
      callback();
    }
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, departmentInfo, form: { getFieldDecorator }, submitting } = this.props;

    const typeOptions = DepartmentType.map(type => <Option key={type.id}>{type.name}</Option>);

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
        title="机构编辑"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <Form.Item label={FieldLabels.departmentName}>
            {
              getFieldDecorator('departmentName', {
                rules: [
                  {
                    required: true,
                    validator: this.checkDepName,
                    whitespace: true,
                  },
                ],
                initialValue: departmentInfo.departmentName,
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
                initialValue: departmentInfo.departmentType,
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
                initialValue: departmentInfo.privilege,
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
                initialValue: departmentInfo.administrator,
              })(<Input />)
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
                initialValue: departmentInfo.dataAddress,
              })(<Input/>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DepDetailView);
