import React, { Component, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './style.less';

class StandardTable extends Component {
  static getDerivedStateFromProps(nextProps) {
    if (nextProps.selectedRows.length === 0) {
      return {
        selectedRowKeys: [],
      }
    }

    return null;
  }

  constructor(props) {
    super(props);
    this.state = {
      selectedRowKeys: [],
    };
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({
      selectedRowKeys,
    });
  };

  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  cleanSelectedKeys = () => {
    if (this.handleRowSelectChange) {
      this.handleRowSelectChange([], []);
    }
  };

  render() {
    const { selectedRowKeys } = this.state;
    const { data, ...rest } = this.props;
    const paginationProps = {
      showSizeChanger: true, showQuickJumper: true,
    };

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
    };

    return (
      <div className={styles.standardTable}>
        <div className={styles.tableAlert}>
          <Alert message={
            <Fragment>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}项&nbsp;&nbsp;<a onClick={this.cleanSelectedKeys}>清空</a>
            </Fragment>
          } type="info" showIcon/>
        </div>
        <Table
          rowKey="taskId"
          rowSelection={rowSelection}
          dataSource={data}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
