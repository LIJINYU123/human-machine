import React, { Component, Fragment } from 'react';
import { Button, Form, Input, Select } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { Option } = Select;
const { FieldLabels, taskTypeMap } = ItemData;

// eslint-disable-next-line max-len
const taskTypeOptions = Object.keys(taskTypeMap).map(key => <Option key={key}>{taskTypeMap[key]}</Option>);

@connect(({ textTask, loading }) => ({
  textTask,
  submitting: loading.effects['textTask/saveStepOneData'],
}))
class Step1 extends Component {
  state = {
    selectTaskType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'textTask/fetchMarkTool',
    });
  }

  handleSelectChange = (value, _) => {
    const { setFieldsValue } = this.props.form;

    setFieldsValue({ markTool: [] });
    this.setState({
      selectTaskType: value,
    });
  };

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();

        dispatch({
          type: 'textTask/saveStepOneData',
          payload: values,
        });
      }
    });
  };

  render() {
    const { textTask: { stepOne, allMarkTools }, form: { getFieldDecorator }, submitting } = this.props;
    const { taskName, taskType, markTool } = stepOne;
    const { selectTaskType } = this.state;
    console.log(allMarkTools);
    let markToolOptions;
    if (selectTaskType === '') {
      markToolOptions = Object.keys(allMarkTools).length ? allMarkTools[taskType].map(option => <Option key={option.classifyId}>{option.classifyName}</Option>) : [];
    } else {
      markToolOptions = allMarkTools[selectTaskType].map(option => <Option key={option.classifyId}>{option.classifyName}</Option>);
    }

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    return (
      <Form {...formItemLayout} hideRequiredMark>
        <Form.Item label={FieldLabels.taskName}>
          {
            getFieldDecorator('taskName', {
              rules: [
                {
                  required: true,
                  message: '请输入任务名称',
                },
              ],
              initialValue: taskName,
            })(<Input className={styles.formItem}/>)
          }
          {
            <a style={{ marginLeft: '10px' }} >自动生成</a>
          }
        </Form.Item>
        <Form.Item label={FieldLabels.taskType}>
          {
            getFieldDecorator('taskType', {
              initialValue: taskType,
            })(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                style={{ width: '70%' }}
                onChange={this.handleSelectChange}
              >
                {taskTypeOptions}
              </Select>)
          }
        </Form.Item>
        <Form.Item label={FieldLabels.markTool}>
          {
            getFieldDecorator('markTool', {
              rules: [{
                required: true,
                message: '请选择标注工具',
              }],
              initialValue: markTool,
            })(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                style={{ width: '70%' }}
                showSearch
                filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                mode="multiple"
              >
                {markToolOptions}
              </Select>)
          }
        </Form.Item>
        <Form.Item
          wrapperCol={{
            xs: {
              span: 24,
              offset: 0,
            },
            sm: {
              span: formItemLayout.wrapperCol.sm.span,
              offset: formItemLayout.labelCol.sm.span,
            },
          }} label="">
          <Button type="primary" onClick={this.onValidateForm}>
            下一步
          </Button>
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Step1);
