import React, { Component } from 'react';
import { Button, Card, Statistic, Form, Row, Col, Descriptions, Input, Checkbox } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TagSelect from '@/components/TagSelect';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels } = ItemData;

@connect()
class ClassifyAnswerView extends Component {
  state = {
    basicInfo: undefined,
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.basicInfo,
    });
  }

  goBackToTextMark = () => {
    router.push({
      pathname: '/task-manage/my-task/text-mark',
      state: {
        taskInfo: this.state.basicInfo,
      },
    });
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { basicInfo } = this.state;

    const action = (
      <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.goBackToTextMark}>返回</Button>
    );

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 2 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 10 },
      },
    };

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
      >
        <Card bordered={false}>
          <Form {...formItemLayout}>
            <Form.Item label={AnswerModeLabels.text}>
              {/*<TextArea value="去外地出差应该用什么方式预订酒店" style={{ width: '80%' }} autoSize disabled/>*/}
              <h4>去外地出差应该用什么方式预订酒店</h4>
            </Form.Item>
            <Form.Item label="情感">
              {
                getFieldDecorator('result')(
                  <TagSelect>
                    {[{ optionName: '开心' }, { optionName: '愤怒' }, { optionName: '惊喜' }, { optionName: '中性' }, { optionName: '开心' }, { optionName: '愤怒' }, { optionName: '惊喜' }, { optionName: '中性' }].map(option => <TagSelect.Option value={option.optionName}>{option.optionName}</TagSelect.Option>)}
                  </TagSelect>)
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
              }}
            >
              <Button>上一题</Button>
              <Button type="primary" style={{ marginLeft: '8px' }}>下一题</Button>
              <Checkbox style={{ float: 'right' }}>无效数据</Checkbox>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(ClassifyAnswerView);
