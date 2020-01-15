import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal, Select } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels } = ItemData;

@connect(({ departmentList, loading }) => ({
  departmentList,
  submitting: loading.effects['departmentList/updateDepartment'],
}))
class DepDetailView extends Component {
  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'departmentList/updateDepartment',
          payload: values,
          callback: onCancel,
        });
      }
    });
  };

  render() {
    // eslint-disable-next-line max-len
    const { visible, onCancel, departmentInfo, noDepAccounts, form: { getFieldDecorator }, submitting } = this.props;
    // eslint-disable-next-line max-len
    const accountOptions = noDepAccounts.map(account => <Option key={account.userId}>{`${account.userId}(${account.name})`}</Option>);
    // eslint-disable-next-line max-len
    accountOptions.push(<Option key={departmentInfo.administrator}>{`${departmentInfo.administrator}(${departmentInfo.adminName})`}</Option>);

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
        title="部门详情"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.departmentId}>
            {
              getFieldDecorator('departmentId', {
                initialValue: departmentInfo.departmentId,
              })(<Input disabled/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.departmentName}>
            {
              getFieldDecorator('departmentName', {
                initialValue: departmentInfo.departmentName,
              })(<Input/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.administrator}>
            {
              getFieldDecorator('administrator', {
                initialValue: departmentInfo.administrator,
              })(
                <Select
                  dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                  showSearch
                  filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {accountOptions}
                </Select>)
            }
          </Form.Item>
          <Form.Item label={departmentInfo.createdTime}>
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
