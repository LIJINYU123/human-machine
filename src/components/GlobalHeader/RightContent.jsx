import React, { useState, useEffect } from 'react';
import { Dropdown, Icon, Menu } from 'antd';
import { connect } from 'dva';
import Avatar from './AvatarDropdown';
import styles from './index.less';
import NoticeIconView from './NoticeIconView';
import HeaderDropdown from '../HeaderDropdown';

const GlobalHeaderRight = props => {
  const { theme, layout, agencies, currentAgency, dispatch } = props;
  let className = styles.right;

  if (theme === 'dark' && layout === 'topmenu') {
    className = `${styles.right}  ${styles.dark}`;
  }

  const changeAgency = (item, key) => {
    localStorage.setItem('DepartmentId', key);
    dispatch({
      type: 'global/changeAgency',
      payload: item.props.children,
    });
  };

  const menu = (
    <Menu onClick={({ item, key }) => changeAgency(item, key)}>
      {
        agencies.map(agency => <Menu.Item key={agency.departmentId}>{agency.departmentName}</Menu.Item>)
      }
    </Menu>
  );

  const roleId = localStorage.getItem('RoleID');

  return (
    <div className={className}>
      {
        roleId === 'superAdmin' &&
        <HeaderDropdown overlay={menu}>
        <span className={styles.action}>
          <span>{currentAgency} <Icon type="down"/></span>
        </span>
        </HeaderDropdown>
      }
      <Avatar />
    </div>
  );
};

export default connect(({ settings, global }) => ({
  theme: settings.navTheme,
  layout: settings.layout,
  agencies: global.agencies,
  currentAgency: global.currentAgency,
}))(GlobalHeaderRight);
