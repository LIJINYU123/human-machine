import React, { Component } from 'react';
import { Button, Modal, Form, Steps } from 'antd';
import { connect } from 'dva';
import Step1 from './Step1';
import styles from './style.less';

const { Step } = Steps;

@connect(({ textTaskList }) => ({
  current: textTaskList.current,
}))
class TaskCreateView extends Component {
  render() {
    const { visible, onCancel, current } = this.props;
    let stepComponent;
    if (current === 0) {
      stepComponent = <Step1/>
    }

    return (
      <Modal
        title="创建任务"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>
            返回
          </Button>]}
        style={{ minWidth: '600px' }}
        destroyOnClose
      >
        <Steps current={current} className={styles.steps}>
          <Step title="基本信息"/>
          <Step title="分配人员"/>
          <Step title="上传数据"/>
        </Steps>
        {stepComponent}
      </Modal>
    );
  }
}

export default Form.create()(TaskCreateView);
