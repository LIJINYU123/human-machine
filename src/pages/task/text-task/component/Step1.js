import React, { Component } from 'react';
import { Button, Form, Input, Select, DatePicker } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';
import moment from 'moment';

const { Option } = Select;
const { FieldLabels, taskTypeName } = ItemData;

// eslint-disable-next-line max-len
const taskTypeOptions = Object.keys(taskTypeName).map(key => <Option key={key}>{taskTypeName[key]}</Option>);

@connect(({ textFormData, loading }) => ({
  textFormData,
  submitting: loading.effects['textFormData/saveStepOneData'],
}))
class Step1 extends Component {
  state = {
    selectTaskType: '',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'textFormData/fetchMarkTool',
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
          type: 'textFormData/saveStepOneData',
          payload: values,
        });
      }
    });
  };

  autoComplete = () => {
    const { textFormData: { stepOne }, form: { setFieldsValue } } = this.props;
    const { taskType } = stepOne;
    const { selectTaskType } = this.state;

    if (selectTaskType === '') {
      setFieldsValue({ taskName: `${taskTypeName[taskType]}_${moment().local('zh-cn').format('YYYYMMDDHHmm')}` })
    } else {
      setFieldsValue({ taskName: `${taskTypeName[selectTaskType]}_${moment().local('zh-cn').format('YYYYMMDDHHmm')}` })
    }
  };

  render() {
    const { textFormData: { stepOne, allMarkTools }, form: { getFieldDecorator }, submitting } = this.props;
    const { taskName, taskType, markTool, deadline } = stepOne;
    const { selectTaskType } = this.state;
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
            <a style={{ marginLeft: '10px' }} onClick={this.autoComplete}>自动生成</a>
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
        <Form.Item label={FieldLabels.deadline}>
          {
            getFieldDecorator('deadline', {
              rules: [{
                required: true,
                message: '请选择截止时间',
              }],
              initialValue: deadline,
            })(<DatePicker showTime style={{ width: '70%' }} />)
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
