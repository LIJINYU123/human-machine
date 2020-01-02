import React, { Component, Fragment } from 'react';
import styles from './style.less';
import { Table, Alert } from 'antd';


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
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination ? {
      showSizeChanger: true, showQuickJumper: true, ...pagination,
    } : false;

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
              <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}项&nbsp;&nbsp;<a
              onClick={this.cleanSelectedKeys}>清空</a>
            </Fragment>
          } type="info" showIcon/>
        </div>
        <Table
          rowKey="userId"
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
        />
      </div>
    );
  }
}

export default StandardTable;
