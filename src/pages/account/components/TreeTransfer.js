import React, { Component } from 'react';
import { Transfer, Tree } from 'antd'

const { TreeNode } = Tree;


class TreeTransfer extends Component {
  isChecked = (selectedKeys, eventKey) => selectedKeys.indexOf(eventKey) !== -1;

  generateTree = (treeNodes = [], checkedKeys = []) => treeNodes.map(({ children, ...props }) => (
      <TreeNode {...props} disabled={checkedKeys.includes(props.key)} key={props.key}>
        {this.generateTree(children, checkedKeys)}
      </TreeNode>
    ));

  render() {
    const { dataSource, targetKeys, onChange } = this.props;
    const transferDataSource = dataSource.reduce((obj, item) => {
      const newObj = [...obj];
      if (item.hasOwnProperty('children')) {
        newObj.push(item);
        item.children.forEach(child => newObj.push(child));
      } else {
        newObj.push(item);
      }
      return newObj;
    }, []);

    return (
      <Transfer
        targetKeys={targetKeys}
        dataSource={transferDataSource}
        render={item => item.title}
        listStyle={{ width: 250 }}
        onChange={onChange}
      >
        {
          ({ direction, onItemSelect, selectedKeys }) => {
            if (direction === 'left') {
              const checkedKeys = [...selectedKeys, ...targetKeys];
              return (
                <Tree
                  blockNode
                  checkable
                  defaultExpandAll
                  checkedKeys={checkedKeys}
                  onCheck={(_, { node: { props: { eventKey } } }) => {
                    onItemSelect(eventKey, !this.isChecked(checkedKeys, eventKey));
                  }}
                  onSelect={(_, { node: { props: { eventKey } } }) => {
                    onItemSelect(eventKey, !this.isChecked(checkedKeys, eventKey));
                  }}
                >
                  {
                    this.generateTree(dataSource, targetKeys)
                  }
                </Tree>
              );
            }
            return null;
          }
        }
      </Transfer>
    );
  }
}

export default TreeTransfer;
