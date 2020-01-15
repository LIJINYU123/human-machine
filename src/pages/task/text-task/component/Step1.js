import React, { Component, Fragment } from 'react';
import { Form, Input, Select } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { Option } = Select;
const { FieldLabels, taskName } = ItemData;

// eslint-disable-next-line max-len
const taskTypeOptions = Object.keys(taskName).map(key => <Option key={key}>{taskName[key]}</Option>);

@connect((_, loading) => ({
  // submitting: loading.effects['textTaskList/'],
}))
class Step1 extends Component {

  render() {
    const { form: { getFieldDecorator }, submitting } = this.props;

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
            })(<Fragment><Input className={styles.formItem}/><a style={{ marginLeft: '10px' }} >自动生成</a></Fragment>)
          }
        </Form.Item>
        <Form.Item label={FieldLabels.taskType}>
          {
            getFieldDecorator('taskType', {
              initialValue: 'textClassify',
            })(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                style={{ width: '70%' }}
              >
                {taskTypeOptions}
              </Select>)
          }
        </Form.Item>
      </Form>
    );
  }
}

export default Form.create()(Step1);
