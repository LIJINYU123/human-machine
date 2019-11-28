import { Button, Result } from 'antd';
import Link from 'umi/link';
import React from 'react';
import styles from './style.less';

const actions = (
  <div className={styles.actions}>
    <Link to="/user/login">
      <Button size="large">返回登录</Button>
    </Link>
  </div>
);

const ResetResult = ({ location }) => (
  <Result
    className={styles.resetResult}
    status="success"
    title={
      <div className={styles.title} >
        你的账户：{location.state ? location.state.account : 'SY0111'}&nbsp;密码重置成功
      </div>
    }
    extra={actions}
  />
);

export default ResetResult;
