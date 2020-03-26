import React, { Component } from 'react';
import { connect } from 'dva';
import { Form, Input, Modal } from 'antd';
import TreeTransfer from './TreeTransfer';
import ItemData from './map';

const { FieldLabels } = ItemData;

@connect(({ groupList, loading }) => ({
  groupList,
}))
class GroupAddView extends Component {
  state = {
    targetKeys: [],
    treeData: [],
    treeMap: {},
    groupIds: [],
  };

  componentDidMount() {
    const { groups } = this.props;
    const groupIds = [];
    const treeMap = {};
    const treeData = groups.map(group => {
      const children = group.userInfo.map(info => ({ key: info.userId, title: info.name }));
      groupIds.push(group.groupId);
      treeMap[`${group.groupId}`] = children.map(c => c.key);
      return { key: group.groupId, title: group.groupName, children };
    });
    this.setState({ treeData, treeMap, groupIds });
  }

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

  render() {
    const { visible, onCancel, form: { getFieldDecorator } } = this.props;
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
