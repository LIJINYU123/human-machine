import React, { Component } from 'react';
import { connect } from 'dva';
import { Modal, Form, Select, Input, Radio } from 'antd';
import ItemData from '../map';

const { FieldLabels } = ItemData;
const { Option } = Select;

@connect(({ textMark }) => ({
  markTools: textMark.markTools,
}))
class NerModalView extends Component {
  state = {
    selectToolId: '',
    saveType: 'wordEntry',
    addWordEntry: false,
  };

  componentDidMount() {
    const { projectId, dispatch } = this.props;
    dispatch({
      type: 'textMark/fetchMarkTool',
      payload: { projectId },
    });
  }

  handleSelectChange = (value, _) => {
    this.setState({
      selectToolId: value.key,
    });
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
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, taskId, dataId, onCancel, onRefresh, word, startIndex, endIndex } = this.props;
    this.setState({
      saveType: 'wordEntry',
      addWordEntry: false,
    });
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        values.word = word;
        values.startIndex = startIndex;
        values.endIndex = endIndex;
        values.tool = { toolId: values.tool.key, toolName: values.tool.label };
        if (values.hasOwnProperty('wordEntry')) {
          values.wordEntry = { wordId: values.wordEntry.key, wordName: values.wordEntry.label };
        }

        if (values.hasOwnProperty('newWordEntry') && values.hasOwnProperty('wordEntry')) {
          delete values.wordEntry;
        }

        dispatch({
          type: 'textMark/saveTextMarkResult',
          payload: { taskId, dataId, result: values },
          callback: () => {
            onCancel();
            onRefresh();
          },
        });
      }
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
    const { visible, markTools, form: { getFieldDecorator }, submitting } = this.props;
    const { selectToolId, saveType, addWordEntry } = this.state;

    const toolOptions = markTools.map(tool => <Option key={tool.toolId}>{tool.toolName}</Option>);
    let wordEntryOptioins = [];
    if (selectToolId !== '') {
      const filterTools = markTools.filter(tool => tool.toolId === selectToolId);
      // eslint-disable-next-line max-len
      wordEntryOptioins = filterTools[0].options.map(option => <Option key={option.optionId}>{option.optionName}</Option>);
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
        title="实体识别"
        maskClosable={false}
        visible={visible}
        onCancel={this.handleClose}
        onOk={this.onValidateForm}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form {...formItemLayout} hideRequiredMark>
          <Form.Item label={FieldLabels.toolName}>
            {
              getFieldDecorator('tool', {
                rules: [
                  {
                    required: true,
                    message: '请选择实体类别',
                  },
                ],
              })(
                <Select labelInValue
                        showSearch
                        dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} onChange={this.handleSelectChange}
                        filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                >
                  {toolOptions}
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
                  <Select labelInValue
                          showSearch
                          dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                          filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                  >
                    {wordEntryOptioins}
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