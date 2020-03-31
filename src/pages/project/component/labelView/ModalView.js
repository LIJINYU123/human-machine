import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, Input, Radio } from 'antd';
import ItemData from '../../map';

const { FieldLabels } = ItemData;
const { Option } = Select;

@connect()
class NerModalView extends Component {
  state = {
    saveType: 'wordEntry',
    addWordEntry: false,
  };

  handleRadioChange = event => {
    this.setState({
      saveType: event.target.value,
    });
  };

  addNewWordEntry = () => {
    this.setState({
      addWordEntry: true,
    });
  };

  onValidateForm = () => {
    // eslint-disable-next-line max-len
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, result, onCancel, word } = this.props;

    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        values.word = word;
        const prevResult = result.filter(r => r.word !== values.word);
        prevResult.push(values);
        dispatch({
          type: 'textProjectFormData/savePreLabelResult',
          payload: prevResult,
          callback: () => {
            onCancel();
          },
        });
      }
    });

    this.setState({
      saveType: 'wordEntry',
      addWordEntry: false,
    });
  };

  handleClose = () => {
    const { onCancel } = this.props;
    this.setState({
      saveType: 'wordEntry',
      addWordEntry: false,
    });
    onCancel();
  };

  render() {
    const { visible, markTool, form: { getFieldDecorator }, submitting } = this.props;
    const { saveType, addWordEntry } = this.state;

    const entityOptions = Object.keys(markTool).length ? markTool.options.map(option => <Option value={option.optionName}>{option.optionName}</Option>) : [];

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
        title="序列标注"
        maskClosable={false}
        visible={visible}
        onCancel={this.handleClose}
        onOk={this.onValidateForm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.wordEntry}>
            {
              getFieldDecorator('optionName', {
                rules: [
                  {
                    required: true,
                    message: '请选择类别',
                  },
                ],
              })(
                <Select showSearch
                        dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                        filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {entityOptions}
                </Select>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.saveType}>
            {
              getFieldDecorator('saveType', {
                initialValue: 'wordEntry',
              })(
                <Radio.Group name="saveType" onChange={this.handleRadioChange}>
                  <Radio value="wordEntry">词条名</Radio>
                  <Radio value="synonym">同义词</Radio>
                </Radio.Group>)
            }
          </Form.Item>
          {
            saveType === 'synonym' &&
            <Form.Item label={FieldLabels.wordEntryName}>
              {
                getFieldDecorator('wordEntry')(
                  <Select showSearch
                          dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                          filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                  >
                  </Select>)
              }
              {
                <a onClick={this.addNewWordEntry}>新建词条</a>
              }
            </Form.Item>
          }
          {
            addWordEntry &&
            <Form.Item label={FieldLabels.newWordEntry}>
              {
                getFieldDecorator('newWordEntry')(
                  <Input />)
              }
            </Form.Item>
          }
        </Form>
      </Modal>
    );
  }
}

export default Form.create()(NerModalView);
