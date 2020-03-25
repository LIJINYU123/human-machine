import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Input, Popover, Icon } from 'antd';
import { SketchPicker } from 'react-color';
import styles from './style.less';
import ItemData from '../map';

const { FieldLabels } = ItemData;

const prestColors = ['#F5222D', '#FA541C', '#FA8C16', '#FAAD14', '#FADB14', '#A0D911', '#52C41A', '#13C2C2',
  '#1890FF', '#2F54EB', '#722ED1', '#EB2F96', '#FF4D4F', '#FF7A45', '#FFA940', '#FFC53D',
  '#FFEC3D', '#BAE637', '#73D13D', '#36CFC9', '#40A9FF', '#597EF7', '#9254DE', '#F759AB',
  '#CF1322', '#D4380D', '#D46B08', '#D48806', '#D4B106', '#7CB305', '#389E0D', '#08979C',
  '#096DD9', '#1D39C4', '#531DAB', '#C41D7F',
];

@connect(({ updateTemplate, loading }) => ({
  updateTemplate,
  submitting: loading.effects['updateTemplate/addOption'],
}))
class OptionCreateView extends Component {
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
          type: 'updateTemplate/addOption',
          payload: { optionName: values.optionName, color },
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
        title="创建选项"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.handleConfirm}
        confirmLoading={submitting}
        centered
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.optionName}>
            {
              getFieldDecorator('optionName', {
                rules: [
                  {
                    required: true,
                    message: '请输入选项名称',
                  },
                ],
              })(<Input className={styles.formItem}/>)
            }
            {
              <Popover trigger="click" content={<SketchPicker presetColors={prestColors} color={color} onChange={this.handleChange}/>}>
                <Icon style={{ marginLeft: '20px', fontSize: '16px', color }} type="font-colors" />
              </Popover>
            }
          </Form.Item>
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(OptionCreateView);
