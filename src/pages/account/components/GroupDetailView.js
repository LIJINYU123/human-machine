import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';
import TreeTransfer from './TreeTransfer';
import ItemData from './map';

const { FieldLabels } = ItemData;

@connect(({ groupList, loading }) => ({
  targetKeys: groupList.targetKeys,
  submitting: loading.effects['groupList/modifyGroup'],
}))
class GroupDetailView extends Component {
  state = {
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
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel, currentGroup, targetKeys } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'groupList/modifyGroup',
          payload: { ...values, groupId: currentGroup.groupId, userIds: targetKeys },
          callback: () => {
            dispatch({
              type: 'groupList/fetchGroups',
              payload: { sorter: 'createdTime_descend' },
            });
            onCancel();
          },
        });
      }
    });
  };

  handleTreeTransferChange = targetKeys => {
    const { dispatch } = this.props;
    const { treeMap, groupIds } = this.state;
    let collectKeys = [];
    targetKeys.forEach(key => {
      if (groupIds.includes(key)) {
        collectKeys = collectKeys.concat(treeMap[key]);
      } else {
        collectKeys.push(key);
      }
    });
    dispatch({
      type: 'groupList/saveTargetKeys',
      payload: collectKeys,
    });
  };

  render() {
    const { visible, onCancel, form: { getFieldDecorator }, currentGroup, targetKeys, submitting } = this.props;
    const { treeData } = this.state;

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
        title="组别信息"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
      >
        <Form {...formItemLayout}>
          <Form.Item label={FieldLabels.groupName}>
            {
              getFieldDecorator('groupName', {
                rules: [
                  {
                    required: true,
                    message: '请输入组别名称',
                  },
                ],
                initialValue: currentGroup.groupName,
              })(<Input />)
            }
          </Form.Item>
        </Form>
        <TreeTransfer dataSource={treeData} targetKeys={targetKeys} onChange={this.handleTreeTransferChange} />
      </Modal>
    );
  }
}

export default Form.create()(GroupDetailView);