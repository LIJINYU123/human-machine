import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';
import TreeTransfer from './TreeTransfer';
import ItemData from './map';

const { FieldLabels } = ItemData;

@connect(({ groupList, loading }) => ({
  groupList,
  submitting: loading.effects['groupList/addGroup'],
}))
class GroupAddView extends Component {
  state = {
    targetKeys: [],
    treeData: [],
    treeMap: {},
    groupIds: [],
  };

  static getDerivedStateFromProps(nextProps) {
    if (nextProps.groups.length) {
      const groupIds = [];
      const treeMap = {};
      const treeData = nextProps.groups.map(group => {
        const children = group.userInfo.map(info => ({ key: info.userId, title: info.name }));
        groupIds.push(group.groupId);
        treeMap[`${group.groupId}`] = children.map(c => c.key);
        return { key: group.groupId, title: group.groupName, children };
      });
      return {
        treeData,
        treeMap,
        groupIds,
      }
    }

    return null;
  }

  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    const { targetKeys } = this.state;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'groupList/addGroup',
          payload: { ...values, userIds: targetKeys },
          callback: () => {
            dispatch({
              type: 'groupList/fetchGroups',
              payload: { sorter: 'updatedTime_descend' },
            });
            onCancel();
          },
        });
      }
    });
  };

  handleTreeTransferChange = targetKeys => {
    const { treeMap, groupIds } = this.state;
    let collectKeys = [];
    targetKeys.forEach(key => {
      if (groupIds.includes(key)) {
        collectKeys = collectKeys.concat(treeMap[key]);
      } else {
        collectKeys.push(key);
      }
    });
    this.setState({ targetKeys: collectKeys });
  };

  checkGroupName = (rule, value, callback) => {
    const { groupList: { groups } } = this.props;
    if (!value.trim()) {
      callback('请输入组别名称');
    } else if (groups.filter(group => group.groupName === value).length) {
      callback('该组别名称已经存在');
    } else {
      callback();
    }
  };

  render() {
    const { visible, onCancel, form: { getFieldDecorator }, submitting } = this.props;
    const { targetKeys, treeData } = this.state;

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
        title="创建组别"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout}>
          <Form.Item label={FieldLabels.groupName}>
            {
              getFieldDecorator('groupName', {
                rules: [
                  {
                    required: true,
                    validator: this.checkGroupName,
                  },
                ],
              })(<Input />)
            }
          </Form.Item>
        </Form>
        <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={this.handleTreeTransferChange} />
      </Modal>
    );
  }
}

export default Form.create()(GroupAddView);
