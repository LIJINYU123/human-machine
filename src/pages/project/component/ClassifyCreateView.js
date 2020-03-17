import React, { Component } from 'react';
import { connect } from 'dva';
import ItemData from '../map';
import { Button, Modal, Form, Row, Col, Input, Popover, Icon } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './style.less';

const { FieldLabels } = ItemData;

@connect(({ textProjectFormData, loading }) => ({
  stepTwo: textProjectFormData.stepTwo,
  submitting: loading.effects['textProjectFormData/addClassify'],
}))
class ClassifyCreateView extends Component {
  state = {
    color: '#1890ff',
  };

  handleChange = color => {
    this.setState({ color: color.hex });
  };

  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, onCancel } = this.props;
    const { color } = this.state;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'textProjectFormData/addClassify',
          payload: { classifyName: values.classifyName, color },
          callback: onCancel,
        });
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, visible, onCancel, submitting } = this.props;
    const { color } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 4 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 20 },
      },
    };

    return (
      <Modal
        title="创建类别"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        centered
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.classifyName}>
            {
              getFieldDecorator('classifyName', {
                rules: [
                  {
                    required: true,
                    message: '请输入项目名称',
                  },
                ],
              })(<Input className={styles.formItem}/>)
            }
            {
              <Popover trigger="click" content={<SketchPicker color={color} onChange={this.handleChange}/>}>
                <Icon style={{ marginLeft: '20px', fontSize: '16px', color }} type="font-colors" />
              </Popover>
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(ClassifyCreateView);
