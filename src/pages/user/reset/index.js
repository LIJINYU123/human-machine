import React, { Component } from 'react';
import Link from 'umi/link';
import router from 'umi/router';
import md5 from 'md5';
import { connect } from 'dva';
import { Button, Form, Input, Popover, Progress, message } from 'antd';
import styles from './style.less';

const passwordStatusMap = {
  ok: <div className={styles.success}>强度：强</div>,
  pass: <div className={styles.warning}>强度：中</div>,
  poor: <div className={styles.error}>强度：太短</div>,
};

@connect(({ resetPassword, loading }) => ({
  resetPassword,
  submitting: loading.effects['resetPassword/submit'],
}))
class ResetPassword extends Component {
  state = {
    popVisible: false,
    help: '',
    confirmDirty: false,
  };

  jumpToResult = () => {
    const { resetPassword, form } = this.props;
    const account = form.getFieldValue('jobNumber');

    if (resetPassword.status === 'ok') {
      router.push({
        pathname: '/user/reset-result',
        state: {
          account,
        },
      });
    } else {
      message.error(resetPassword.message);
    }
  };

  handleSubmit = event => {
    event.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFields(
      {
        force: true,
      },
      (err, values) => {
        if (!err) {
          dispatch({
            type: 'resetPassword/submit',
            payload: { ...values, password: md5(values.password), confirm: md5(values.confirm) },
            callback: this.jumpToResult,
          });
        }
      },
    );
  };

  checkUserId = (_, value, callback) => {
    if (!value) {
      callback('请输入账户ID');
    } else {
      callback();
    }
  };

  checkPassword = (_, value, callback) => {
    const { popVisible, confirmDirty } = this.state;

    if (!value) {
      this.setState({
        help: '请输入密码！',
        popVisible: true,
      });
      callback('error');
    } else {
      this.setState({
        help: '',
      });

      if (!popVisible) {
        this.setState({
          popVisible: true,
        });
      }

      if (value.length < 6) {
        callback('error');
      } else {
        const { form } = this.props;

        if (value && confirmDirty) {
          form.validateFields(['confirm'], {
            force: true,
          });
        }

        callback();
      }
    }
  };

  checkConfirm = (_, value, callback) => {
    const { form } = this.props;
    if (value && value !== form.getFieldValue('password')) {
      callback('两次输入的密码不匹配');
    } else {
      callback();
    }
  };

  getPasswordStatus = () => {
    const { getFieldValue } = this.props.form;
    const value = getFieldValue('password');

    if (value && value.length > 9) {
      return 'ok';
    }

    if (value && value.length > 5) {
      return 'pass';
    }

    return 'poor';
  };

  renderPasswordProgress = () => {
    const { getFieldValue } = this.props.form;
    const value = getFieldValue('password');
    const passwordStatus = this.getPasswordStatus();
    return value && value.length ? (
      <Progress
        status={passwordStatusMap[passwordStatus]}
        strokeWidth={6}
        percent={value.length * 10 > 100 ? 100 : value.length * 10}
        showInfo={false}
      />
    ) : null;
  };

  render() {
    const { form, submitting } = this.props;
    const { getFieldDecorator } = form;
    const { popVisible, help } = this.state;

    return (
      <div className={styles.main}>
        <h3>重置密码</h3>
        <Form onSubmit={this.handleSubmit}>
          <Form.Item>
            {getFieldDecorator('userId', {
              rules: [
                {
                  validator: this.checkUserId,
                },
              ],
            })(<Input size="large" placeholder="账户ID" />)}
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('name', {
              rules: [
                {
                  required: true,
                  message: '请输入真实姓名',
                },
              ],
            })(<Input size="large" placeholder="真实姓名" />)}
          </Form.Item>
          <Form.Item help={help}>
            <Popover
              getPopupContainer={node => {
                if (node && node.parentNode) {
                  return node.parentNode;
                }

                return node;
              }}
              content={
                <div style={{ padding: '40px 0' }}>
                  {passwordStatusMap[this.getPasswordStatus()]}
                  {this.renderPasswordProgress()}
                  <div style={{ marginTop: 10 }}>
                    请至少输入6个字符，请不要使用容易被猜到的密码。
                  </div>
                </div>
              }
              overlayStyle={{ width: 240 }}
              placement="right"
              visible={popVisible}
            >
              {getFieldDecorator('password', {
                rules: [
                  {
                    validator: this.checkPassword,
                  },
                ],
              })(<Input size="large" type="password" placeholder="至少6位密码，区分大小写" />)}
            </Popover>
          </Form.Item>
          <Form.Item>
            {getFieldDecorator('confirm', {
              rules: [
                {
                  required: true,
                  message: '请确认密码！',
                },
                {
                  validator: this.checkConfirm,
                },
              ],
            })(<Input size="large" type="password" placeholder="确认密码" />)}
          </Form.Item>
          <Form.Item>
            <Button
              size="large"
              loading={submitting}
              style={{ width: '50%' }}
              type="primary"
              htmlType="submit"
            >
              重置密码
            </Button>
            <Link className={styles.login} to="/user/login">
              使用已有账号登录
            </Link>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(ResetPassword);
