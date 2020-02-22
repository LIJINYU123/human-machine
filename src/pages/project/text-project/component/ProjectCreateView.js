import React, { Component } from 'react';
import { Button, Modal, Form, Steps } from 'antd';
import { connect } from 'dva';
import Step1 from './Step1';
import styles from './style.less';

const { Step } = Steps;

@connect(({ textProjectFormData }) => ({
  current: textProjectFormData.current,
}))
class ProjectCreateView extends Component {
  render() {
    const { visible, onCancel, current } = this.props;
    let stepComponent;
    if (current === 0) {
      stepComponent = <Step1/>
    }

    return (
      <Modal
        title="新建项目"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>返回</Button>]}
        style={{ minWidth: '700px' }}
        destroyOnClose
      >
        <Steps current={0} className={styles.steps}>
          <Step title="基本信息"/>
          <Step title="工具配置"/>
          <Step title="上传数据"/>
        </Steps>
        {stepComponent}
      </Modal>
    );
  }
}

export default Form.create()(ProjectCreateView);
