import React, { useState, Fragment } from 'react';
import styles from './style.less';
import { Table, Alert } from 'antd';


function StandardTable(props) {
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const { data, ...rest } = props;
  const { list = [], pagination = false } = data || {};
  const paginationProps = pagination ? {
    showSizeChanger: true, showQuickJumper: true, ...pagination,
  } : false;

  const handleRowSelectChange = (rowKeys, selectedRows) => {
    const { onSelectRow } = props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    setSelectedRowKeys(rowKeys);
  };

  const handleTableChange = (page, filters, sorters, ...argRest) => {
    const { onChange } = props;
    if (onChange) {
      onChange(page, filters, sorters, ...argRest);
    }
  };

  const cleanSelectedKeys = () => {
    if (handleRowSelectChange) {
      handleRowSelectChange([], []);
    }
  };

  const rowSelection = {
    selectedRowKeys,
    onChange: handleRowSelectChange,
  };

  return (
    <div className={styles.standardTable}>
      <div className={styles.tableAlert}>
        <Alert message={
          <Fragment>
            已选择{' '}
            <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a>{' '}项&nbsp;&nbsp;<a onClick={cleanSelectedKeys}>清空</a>
          </Fragment>
        } type="info" showIcon />
      </div>
      <Table
        rowKey="userId"
        rowSelection={rowSelection}
        dataSource={list}
        pagination={paginationProps}
        onChange={handleTableChange}
        {...rest}
      />
    </div>
  );
}

export default StandardTable;
