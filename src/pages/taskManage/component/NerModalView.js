import React, { Component } from 'react';
import { connect } from 'dva/index';
import { Modal, Form, Select, Input, Radio } from 'antd/lib/index';
import ItemData from '../map';

const { FieldLabels } = ItemData;
const { Option } = Select;

@connect(({ textMark }) => ({
  data: textMark.nerData,
  markTool: textMark.markTool,
}))
class NerModalView extends Component {
  state = {
    selectOptionName: '',
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
      selectOptionName: value,
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
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch, taskId, dataId, data, onCancel, onRefresh, word, startIndex, endIndex } = this.props;
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

        const filterData = data.list.filter(item => item.dataId === dataId);
        let prevResult = filterData[0].labelResult;
        prevResult = prevResult.filter(r => r.word !== values.word);
        prevResult.push(values);

        dispatch({
          type: 'textMark/saveTextMarkResult',
          payload: { taskId, dataId, labelResult: prevResult },
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
    const { visible, markTool, form: { getFieldDecorator }, submitting } = this.props;
    const { selectOptionName, saveType, addWordEntry } = this.state;

    const entityOptions = Object.keys(markTool).length ? markTool.options.map(option => <Option value={option.optionName}>{option.optionName}</Option>) : [];
    let wordEntryOptions = [];
    if (selectOptionName !== '') {
      const filterOptions = markTool.options.filter(option => option.optionName === selectOptionName);
      // eslint-disable-next-line max-len
      wordEntryOptions = filterOptions[0].extraInfo.map(wordEntry => <Option key={wordEntry}>{wordEntry}</Option>);
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
              getFieldDecorator('optionName', {
                rules: [
                  {
                    required: true,
                    message: '请选择实体类别',
                  },
                ],
              })(
                <Select showSearch
                        dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} onChange={this.handleSelectChange}
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

export default Form.create()(NerModalView);
