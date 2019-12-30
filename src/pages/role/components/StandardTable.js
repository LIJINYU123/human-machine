import React from 'react';
import styles from './style.less';
import { Table, Col, Row, Tag } from 'antd';

const options = {
  historyRecord: '历史记录',
  dialogInput: '语料录入',
  roleManage: '角色管理',
  userManage: '用户管理',
  add: '新增',
  modify: '修改',
  query: '查询',
  delete: '删除',
};

function StandardTable(props) {
  const { data, rowKey, ...rest } = props;

  const renderPrivileges = privileges => (
      <Row type="flex" gutter={[16, 16]}>
        {Object.keys(privileges).map(item => (
            <Col lg={12} md={24} sm={24}>
              {options[item]}:&nbsp;&nbsp;&nbsp;&nbsp;{privileges[item].map(privilege => <Tag color="cyan" key={privilege}>{options[privilege]}</Tag>)}
            </Col>
          ))}
      </Row>);

  return (
    <div className={styles.standardTable}>
      <Table
        rowKey="roleId"
        dataSource={data}
        pagination={false}
        expandedRowRender={role => renderPrivileges(role.privileges)}
        {...rest}
      />
    </div>
  );
}

export default StandardTable;
