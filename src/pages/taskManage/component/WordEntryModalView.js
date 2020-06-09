import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, Input, Radio } from 'antd';
import ItemData from '../map';

const { FieldLabels } = ItemData;
const { Option } = Select;

@connect(({ sequenceMark }) => ({
  markTool: sequenceMark.markTool,
}))
class WordEntryModalView extends Component {
  state = {
    saveType: 'wordEntry',
    addWordEntry: false,
  };

  componentDidMount() {
    const { projectId, dispatch } = this.props;
    dispatch({
      type: 'sequenceMark/fetchMarkTool',
      payload: { projectId },
    });
  }

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

  handleClose = () => {
    const { onCancel } = this.props;
    this.setState({
      saveType: 'wordEntry',
      addWordEntry: false,
    });
    onCancel();
  };

  handleConfirm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, onConfirm, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        onConfirm(values.saveType, values.hasOwnProperty('wordEntry') ? values.wordEntry : '', values.hasOwnProperty('newWordEntry') ? values.newWordEntry : '');
        onCancel();
        this.setState({
          saveType: 'wordEntry',
          addWordEntry: false,
        });
      }
    });
  };

  render() {
    const { visible, markTool, optionName, form: { getFieldDecorator } } = this.props;
    const { saveType, addWordEntry } = this.state;
    const filterOptions = markTool.options.filter(option => option.optionName === optionName);
    let wordEntryOptions = [];
    if (markTool.saveType === 'dict' && filterOptions.length) {
      wordEntryOptions = filterOptions[0].hasOwnProperty('extraInfo') ? filterOptions[0].extraInfo.map(wordEntry => <Option key={wordEntry}>{wordEntry}</Option>) : [];
    }

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
        onOk={this.handleConfirm}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
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
                    {wordEntryOptions}
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

export default Form.create()(WordEntryModalView);
