import React, { Component, Fragment } from 'react';
import { Button, Card, Checkbox, Descriptions, Form, Input, Radio, Tag, Row, Col, Table } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import TagSelect from '@/components/TagSelect';
import router from 'umi/router';
import { connect } from 'dva';
import styles from './style.less';
import ItemData from '../map';

const { TextArea } = Input;
const { AnswerModeLabels } = ItemData;

class SequenceAnswerView extends Component {
  state = {
    basicInfo: undefined,
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.basicInfo,
    });
  }

  goBackToSequenceMark = () => {
    router.push({
      pathname: '/task-manage/my-task/sequence-mark',
      state: {
        taskInfo: this.state.basicInfo,
      },
    });
  };

  // onPressEnter = () => {
  //   const input = document.getElementById('textArea');
  //   console.log(input.selectionStart);
  // };
  //
  // onTextAreaChange = () => {
  //   console.log('call onTextAreaChange');
  //   const input = document.getElementById('textArea');
  //   input.selectionStart = 0;
  //   input.selectionEnd = 0;
  // };

  handleClick = () => {
    const word = window.getSelection ? window.getSelection() : document.selection.createRange().text;
    console.log(word);
  };

  render() {
    const { form: { getFieldDecorator } } = this.props;
    const { basicInfo } = this.state;

    const action = (
      <Fragment>
        <Button icon="check">提交质检</Button>
        <Button type="primary" style={{ marginLeft: '16px' }} onClick={this.goBackToSequenceMark}>返回</Button>
      </Fragment>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={6}>
        <Descriptions.Item label="已答题数">100</Descriptions.Item>
        <Descriptions.Item label="剩余题数">50</Descriptions.Item>
        <Descriptions.Item label="无效题数">10</Descriptions.Item>
      </Descriptions>
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

    const formItemLayout2 = {
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
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
      >
        <Card bordered={false}>
          <Form>
            <Form.Item label="句式切分" {...formItemLayout}>
              <Tag color="blue">句子</Tag>
            </Form.Item>
            <Row>
              <Col md={12} sm={24}>
                <Form.Item label={AnswerModeLabels.text} {...formItemLayout2}>
                  <TextArea
                    id="textArea"
                    value="中新网客户端北京4月16日电(左宇坤)两天的周末，一觉醒来大半天没了，再来一觉周末过去了。假期不够用？想多来一点？近日，多地提出推行每周2.5天假期，“周末plus”真的要来了。为了促进疫情后消费市场复苏，4月11日，南京市召开战疫情扩内需稳增长“四新”行动动员发布会，提出“培育新消费，打造夜间经济品牌，试行每周2.5天休息制度”。" autoSize onClick={this.handleClick}
                  />
                </Form.Item>
              </Col>
              <Col md={{ span: 10, offset: 2 }} sm={24}>
                <Table bordered/>
              </Col>
            </Row>
            <Form.Item label={AnswerModeLabels.reviewResult} {...formItemLayout}>
              <Radio.Group>
                <Radio.Button value="approve">通过</Radio.Button>
                <Radio.Button value="reject">拒绝</Radio.Button>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={AnswerModeLabels.remark} {...formItemLayout}>
              <Input style={{ width: '80%' }}/>
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
              <Button type="primary" style={{ marginLeft: '16px' }}>下一题</Button>
              <Checkbox style={{ marginLeft: '16px' }}>无效数据</Checkbox>
            </Form.Item>
          </Form>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(SequenceAnswerView);
