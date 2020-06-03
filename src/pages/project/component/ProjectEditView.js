import React, { Component } from 'react';
import { Button, Modal, Form, Steps } from 'antd';
import { connect } from 'dva';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import styles from './style.less';

const { Step } = Steps;

@connect(({ textProjectFormData }) => ({
  current: textProjectFormData.current,
}))
class ProjectEditView extends Component {
  static getDerivedStateFromProps(nextProps) {
    const { dispatch } = nextProps;
    if (nextProps.projectId !== '' && nextProps.visible === true) {
      dispatch({
        type: 'textProjectFormData/fetchDetail',
        payload: nextProps.projectId,
      });
    }
    return null;
  }

  render() {
    const { visible, onCancel, current } = this.props;
    let stepComponent;
    if (current === 0) {
      stepComponent = <Step1 onCancel={onCancel}/>
    } else if (current === 1) {
      stepComponent = <Step2 onCancel={onCancel}/>
    } else if (current === 2) {
      stepComponent = <Step3 onCancel={onCancel}/>
    } else if (current === 3) {
      stepComponent = <Step4 onCancel={onCancel}/>
    }

    return (
      <Modal
        title="编辑项目"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        footer={[
          <Button key="back" onClick={onCancel}>返回</Button>]}
        style={{ minWidth: '950px' }}
        destroyOnClose
      >
        <Steps current={current} className={styles.steps}>
          <Step title="基本信息"/>
          <Step title="工具配置"/>
          <Step title="上传数据"/>
          <Step title="试标注并发布"/>
        </Steps>
        {stepComponent}
      </Modal>
    );
  }
}


export default Form.create()(ProjectEditView);
