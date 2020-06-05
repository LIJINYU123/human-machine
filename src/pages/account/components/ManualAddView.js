import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Modal, Row, Col, Input, Select, Icon, Button } from 'antd';
import ItemData from './map';

const { Option } = Select;
const { FieldLabels } = ItemData;

let count = 1;

@connect(({ userList, loading }) => ({
  userList,
  submitting: loading.effects['userList/manualAddUsers'],
}))
class ManualAddView extends Component {
  state = {
    userKeys: [count],
  };

  handleConform = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'userList/manualAddUsers',
          payload: { users: values.users.filter(item => item) },
          callback: () => {
            count = 1;
            this.setState({
              userKeys: [count],
            });

            dispatch({
              type: 'userList/fetchUsers',
              payload: { sorter: 'updatedTime_descend' },
            });
            onCancel();
          },
        });
      }
    });
  };

  handleCancel = () => {
    const { onCancel } = this.props;
    onCancel();
    count = 1;
    this.setState({
      userKeys: [count],
    });
  };

  handleAdd = () => {
    const { userKeys } = this.state;
    count += 1;
    this.setState({
      userKeys: userKeys.concat(count),
    });
  };

  handleDelete = index => {
    const { userKeys } = this.state;
    const temKeys = [];
    userKeys.forEach((key, i) => {
      if (i !== index) {
        temKeys.push(key);
      }
    });
    this.setState({
      userKeys: temKeys,
    });
  };

  checkUserId = (rule, value, callback) => {
    const { form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    const { users } = values;
    const existUsers = users.filter(user => user.userId === value);

    if (!value.trim()) {
      callback('请输入用户名');
    } else if (existUsers.length === 2) {
      callback('存在重复的用户名，请重新输入');
    } else {
      callback();
    }
  };

  render() {
    const { form: { getFieldDecorator }, visible, roleInfos, groupInfos, submitting } = this.props;

    const { userKeys } = this.state;

    const roleOptions = roleInfos.map(roleInfo => <Option key={roleInfo.roleId}>{roleInfo.roleName}</Option>);

    const groupOptions = groupInfos.map(groupInfo => <Option key={groupInfo.groupId}>{groupInfo.groupName}</Option>);

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
        title="新建账户"
        maskClosable={false}
        visible={visible}
        onCancel={this.handleCancel}
        onOk={this.handleConform}
        confirmLoading={submitting}
        style={{ minWidth: '1000px' }}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          {
            userKeys.map((key, index) => (
              <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
                <Col md={8} sm={24}>
                  <Form.Item label={FieldLabels.userId}>
                    {
                      getFieldDecorator(`users[${key}].userId`, {
                        rules: [
                          {
                            required: true,
                            validator: this.checkUserId,
                          },
                        ],
                        initialValue: '',
                      })(<Input/>)
                    }
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label={FieldLabels.role}>
                    {
                      getFieldDecorator(`users[${key}].roleId`, {
                        rules: [
                          {
                            required: true,
                            message: '请选择角色',
                          },
                        ],
                        initialValue: '',
                      })(
                        <Select
                          dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                        >
                          {roleOptions}
                        </Select>)
                    }
                  </Form.Item>
                </Col>
                <Col md={8} sm={24}>
                  <Form.Item label={FieldLabels.group}>
                    {
                      getFieldDecorator(`users[${key}].groupId`)(
                        <Select
                          mode="multiple"
                          dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                          style={{ width: '80%' }}
                        >
                          {groupOptions}
                        </Select>)
                    }
                    {
                      <Icon type="delete" style={{ marginLeft: '16px', fontSize: '16px', cursor: 'pointer' }} onClick={() => this.handleDelete(index)} />
                    }
                  </Form.Item>
                </Col>
              </Row>
            ))
          }
          <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
            <Col md={8} sm={24}>
              <Form.Item
                wrapperCol={{
                  xs: {
                    span: 24,
                    offset: 0,
                  },
                  sm: {
                    span: formItemLayout.wrapperCol.sm.span,
                    offset: formItemLayout.labelCol.sm.span,
                  },
                }}
              >
                <Button icon="plus" type="primary" onClick={this.handleAdd}>添加</Button>
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>

    );
  }
}


export default Form.create()(ManualAddView);
