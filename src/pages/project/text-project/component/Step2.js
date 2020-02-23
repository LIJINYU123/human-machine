import React, { Component, Fragment } from 'react';
import { Button, Form, Select, Row, Col, Divider, Icon, Input } from 'antd';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';

const { FieldLabels } = ItemData;
const { Option } = Select;

let toolId = 0;
let optionId = 0;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

@connect(({ textProjectFormData, loading }) => ({
  textProjectFormData,
  submitting: loading.effects['textProjectFormData/saveStepTwoData'],
}))
class Step2 extends Component {
  state = {
    toolKeys: [],
    optionKeys: [],
  };

  componentDidMount() {
    const { dispatch, textProjectFormData: { stepOne } } = this.props;
    const { labelType } = stepOne;
    dispatch({
      type: 'textProjectFormData/fetchMarkTool',
      payload: { labelType },
    });
  }

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepTwoPrevious',
    });
  };

  handleAddTool = () => {
    const { toolKeys } = this.state;
    const newTool = toolKeys.concat(`tool-${++toolId}`);
    this.setState({
      toolKeys: newTool,
    });
  };

  handleDeleteTool = toolKey => {
    const { toolKeys } = this.state;
    this.setState({
      toolKeys: toolKeys.filter(key => key !== toolKey),
      optionKeys: [],
    });
  };

  getToolField = () => {
    const { toolKeys } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return toolKeys.map(toolKey => (
      <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
        <Col md={10} sm={24}>
          <Form.Item label={FieldLabels.toolName} {...formItemLayout}>
            {
              getFieldDecorator('toolName', {
                rules: [
                  {
                    required: true,
                    message: '请输入工具名称',
                  },
                ],
              })(<Input />)
            }
          </Form.Item>
        </Col>
        <Col md={10} sm={24}>
          <Form.Item label={FieldLabels.toolId} {...formItemLayout} >
            {
              getFieldDecorator('toolId', {
                rules: [
                  {
                    required: true,
                    message: '请输入工具标识',
                  },
                ],
              })(<Input />)
            }
          </Form.Item>
        </Col>
        <Col md={2} sm={24}>
          <Form.Item>
            <Button icon="delete" type="danger" onClick={() => this.handleDeleteTool(toolKey)}>删除</Button>
          </Form.Item>
        </Col>
      </Row>
    ));
  };

  getOptionField = () => {
    const { optionKeys } = this.state;
    const { form: { getFieldDecorator } } = this.props;
    return optionKeys.map(optionKey => (
      <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
        <Col md={10} sm={24}>
          <Form.Item label={FieldLabels.optionName} {...formItemLayout}>
            {
              getFieldDecorator(`optionName-${optionKey}`, {
                rules: [
                  {
                    required: true,
                    message: '请输入选项名称',
                  },
                ],
              })(<Input />)
            }
          </Form.Item>
        </Col>
        <Col md={10} sm={24}>
          <Form.Item label={FieldLabels.optionId} {...formItemLayout} >
            {
              getFieldDecorator(`optionId-${optionKey}`, {
                rules: [
                  {
                    required: true,
                    message: '请输入选项标识',
                  },
                ],
              })(<Input />)
            }
          </Form.Item>
        </Col>
        <Col md={2} sm={24}>
          <Form.Item>
            <Button icon="delete" type="danger" onClick={() => this.handleDeleteOption(optionKey)}>删除</Button>
          </Form.Item>
        </Col>
      </Row>
    ));
  };

  handleAddOption = () => {
    const { optionKeys } = this.state;
    const newOption = optionKeys.concat(`${++optionId}`);
    this.setState({
      optionKeys: newOption,
    });
  };

  handleDeleteOption = optionKey => {
    const { optionKeys } = this.state;
    this.setState({
      optionKeys: optionKeys.filter(key => key !== optionKey),
    });
  };

  getOptionButton = () => {
    const { textProjectFormData: { stepOne } } = this.props;
    const { toolKeys } = this.state;
    const { labelType } = stepOne;
    if (labelType !== 'ner' && toolKeys.length > 0) {
      return (
        <Fragment>
          <Divider style={{ marginTop: '0px', marginBottom: '8px' }}/>
          <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
            <Col md={10} sm={24}>
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
                <Button icon="plus" type="primary" onClick={this.handleAddOption}>选项</Button>
              </Form.Item>
            </Col>
          </Row>
        </Fragment>
      );
    }
    return null;
  };

  render() {
    const { textProjectFormData: { markTools, stepOne }, form: { getFieldDecorator } } = this.props;
    const { toolKeys } = this.state;
    const { labelType } = stepOne;
    // eslint-disable-next-line max-len
    const markToolOptions = markTools ? markTools.map(option => <Option key={option.toolId}>{option.toolName}</Option>) : [];

    return (
      <Form hideRequiredMark>
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={10} sm={24}>
            <Form.Item label={FieldLabels.defaultTool} {...formItemLayout}>
              {
                getFieldDecorator('defaultTool', {})(
                  <Select
                    dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                    showSearch
                    filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                    mode="multiple"
                  >
                    {markToolOptions}
                  </Select>)
              }
            </Form.Item>
          </Col>
          <Col md={10} sm={24}>
            <Form.Item>
              <Button icon="plus" type="primary" onClick={this.handleAddTool} disabled={labelType !== 'ner' && toolKeys.length === 1}>工具</Button>
            </Form.Item>
          </Col>
        </Row>
        <Divider style={{ marginTop: '0px', marginBottom: '8px' }}/>
        {this.getToolField()}
        {this.getOptionButton()}
        {this.getOptionField()}
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={10} sm={24}>
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
              <Button type="primary">下一步</Button>
              <Button style={{ marginLeft: '8px' }} onClick={this.onPrev}>上一步</Button>
            </Form.Item>
          </Col>
        </Row>
      </Form>
    );
  }
}

export default Form.create()(Step2);
