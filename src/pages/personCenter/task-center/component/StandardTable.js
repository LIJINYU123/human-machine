import React, { Component, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './style.less';

class StandardTable extends Component {
  handleTableChange = (pagination, filters, sorter, ...rest) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter, ...rest);
    }
  };

  render() {
    const { data, ...rest } = this.props;
    const { list = [], pagination = false } = data || {};
    const paginationProps = pagination ? {
      showSizeChanger: true, showQuickJumper: true, ...pagination,
    } : false;

    return (
      <div className={styles.standardTable}>
        <Table
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
