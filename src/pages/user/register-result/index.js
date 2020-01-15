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

const RegisterResult = ({ location }) => (
  <Result
    className={styles.registerResult}
    status="success"
    title={
      <div className={styles.title} >
        你的账户：{location.state ? location.state.account : 'SY0111'}&nbsp;注册成功，请联系管理员添加到某一部门下
      </div>
    }
    extra={actions}
  />
);

export default RegisterResult;
