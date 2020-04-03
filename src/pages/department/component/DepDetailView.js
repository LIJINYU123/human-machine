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
          payload: { departmentId: departmentInfo.departmentId, ...values },
          callback: onCancel,
        });
      }
    });
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, departmentInfo, form: { getFieldDecorator }, submitting } = this.props;

    const typeOptions = DepartmentType.map(type => <Option key={type.id}>{type.name}</Option>);

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
        title="机构详情"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.departmentName}>
            {
              getFieldDecorator('departmentName', {
                initialValue: departmentInfo.departmentName,
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
                initialValue: departmentInfo.privilege,
              })(<TreeSelect treeData={Privileges} treeCheckable treeDefaultExpandAll/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.administrator}>
            {
              getFieldDecorator('administrator', {
                initialValue: departmentInfo.administrator,
              })(<Input />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.createdTime}>
            {
              getFieldDecorator('createdTime', {
                initialValue: departmentInfo.createdTime,
              })(<Input disabled/>)
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(DepDetailView);
