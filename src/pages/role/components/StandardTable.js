import React from 'react';
import { Table, Col, Row, Tag } from 'antd';
import styles from './style.less';
import ItemData from './map';

const { FieldLabels, operateName } = ItemData;

function StandardTable(props) {
  const { data, ...rest } = props;

  const renderPrivileges = privileges => (
      <Row type="flex" gutter={[16, 16]}>
        {Object.keys(privileges).map(item => (
            <Col lg={12} md={24} sm={24}>
              {FieldLabels[item]}:&nbsp;&nbsp;&nbsp;&nbsp;{privileges[item].map(privilege => <Tag color="cyan" key={privilege}>{operateName[privilege]}</Tag>)}
            </Col>
          ))}
      </Row>);

  return (
    <div className={styles.standardTable}>
      <Table
        rowKey="roleId"
        dataSource={data}
        pagination={{ showSizeChanger: true, showQuickJumper: true }}
        expandedRowRender={role => renderPrivileges(role.privileges)}
        {...rest}
      />
    </div>
  );
}

export default StandardTable;
