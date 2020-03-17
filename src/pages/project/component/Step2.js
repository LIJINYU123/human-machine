import React, { Component, Fragment } from 'react';
import { Button, Form, Select, Row, Col, Divider, Input, Popover } from 'antd';
import { connect } from 'dva';
import update from 'immutability-helper';
import { SketchPicker } from 'react-color';
import DragSortingTable from './DragSortingTable';
import ClassifyCreateView from './ClassifyCreateView';
import styles from './style.less';
import ItemData from '../map';

const { FieldLabels } = ItemData;
const { Option } = Select;

let toolId = 0;
let optionId = 0;

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

@connect(({ textProjectFormData, loading }) => ({
  textProjectFormData,
  submitting: loading.effects['textProjectFormData/saveStepTwoData'],
}))
class Step2 extends Component {
  state = {
    toolKeys: [],
    optionKeys: [],
    classifyId: '',
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, textProjectFormData: { stepOne } } = this.props;
    const { labelType } = stepOne;
    dispatch({
      type: 'textProjectFormData/fetchTemplate',
      payload: { labelType },
    });
  }

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch } = this.props;
    const { optionKeys } = this.state;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const fieldValues = {};

        const options = optionKeys.map(key => ({
          optionName: values[`optionName-${key}`], optionId: values[`optionId-${key}`] }));

        fieldValues.defaultTool = values.defaultTool;
        fieldValues.toolName = values.toolName ? values.toolName : '';
        fieldValues.toolId = values.toolId ? values.toolId : '';
        fieldValues.options = options;

        dispatch({
          type: 'textProjectFormData/saveStepTwoData',
          payload: fieldValues,
        });
      }
    });
  };

  handleSelectChange = (value, _) => {
    const { textProjectFormData: { templates }, form: { setFieldsValue }, dispatch } = this.props;
    if (typeof value !== 'undefined') {
      const filterTemplates = templates.filter(t => t.templateId === value);
      const { classifies } = filterTemplates[0];
      setFieldsValue({ templateName: filterTemplates[0].templateName });
      dispatch({
        type: 'textProjectFormData/saveClassifies',
        payload: classifies,
      });
    }
  };

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
                    message: '请输入模板名称',
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
                    message: '请输入类别名称',
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
    const { toolKeys } = this.state;
    if (toolKeys.length > 0) {
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
                <Button icon="plus" type="primary" onClick={this.handleAddOption}>类别</Button>
              </Form.Item>
            </Col>
          </Row>
        </Fragment>
      );
    }
    return null;
  };

  checkDefaultTool = (rule, value, callback) => {
    const { form: { getFieldsValue } } = this.props;
    const values = getFieldsValue();
    if (!value && !values.hasOwnProperty('toolName')) {
      callback('请选择默认模板');
    } else {
      callback();
    }
  };

  handleMoveRow = (dragIndex, hoverIndex) => {
    const { textProjectFormData: { classifyData }, dispatch } = this.props;
    const dragRow = classifyData[dragIndex];
    dispatch({
      type: 'textProjectFormData/saveClassifies',
      payload: update(classifyData, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      }),
    });
  };

  handleChange = color => {
    const { classifyId } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/saveColor',
      payload: {
        classifyId,
        color: color.hex,
      },
    });
  };

  handleDeleteClassify = classifyName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/deleteClassify',
      payload: { classifyName },
    });
  };

  handleAddClassify = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleClickDiv = record => {
    this.setState({
      classifyId: record.classifyId,
    });
  };

  render() {
    const { textProjectFormData: { templates, classifyData }, form: { getFieldDecorator }, submitting } = this.props;
    const { modalVisible } = this.state;
    // eslint-disable-next-line max-len
    const templateOptions = templates ? templates.map(template => <Option key={template.templateId}>{template.templateName}</Option>) : [];

    const columns = [
      {
        title: '类别',
        dataIndex: 'classifyName',
      },
      {
        title: '颜色',
        dataIndex: 'color',
        render: (val, record) => <Popover trigger="click" content={<SketchPicker color={val} onChange={this.handleChange}/>}><div className={styles.colorPicker} onClick={() => this.handleClickDiv(record)}><div className={styles.color} style={{ background: `${val}` }}></div></div></Popover>,
      },
      {
        title: '操作',
        render: (_, record) => (<a onClick={() => this.handleDeleteClassify(record.classifyName)}>删除</a>),
      },
    ];

    return (
      <Form hideRequiredMark>
        <Form.Item label={FieldLabels.defaultTool} {...formItemLayout}>
          {
            getFieldDecorator('defaultTool', {})(
              <Select
                dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}
                showSearch
                allowClear
                filterOption={(input, option) => option.props.children.toLowerCase().includes(input.toLowerCase())}
                onChange={this.handleSelectChange}
                style={{ width: '50%' }}
              >
                {templateOptions}
              </Select>)
          }
        </Form.Item>
        <Form.Item label={FieldLabels.toolName} {...formItemLayout}>
          {
            getFieldDecorator('templateName', {
              rules: [
                {
                  required: true,
                  message: '请输入模板名称',
                },
              ],
            })(<Input style={{ width: '50%' }} />)
          }
        </Form.Item>
        <Button className={styles.tableListOperator} icon="plus" type="primary" onClick={this.handleAddClassify}>类别</Button>
        <DragSortingTable
          data={classifyData}
          columns={columns}
          onMoveRow={this.handleMoveRow}
        />
        <Button type="primary" onClick={this.onValidateForm} loading={submitting} style={{ marginTop: '16px' }}>下一步</Button>
        <Button style={{ marginLeft: '8px' }} onClick={this.onPrev}>上一步</Button>
        <ClassifyCreateView visible={modalVisible} onCancel={this.handleCancelModal} />
      </Form>
    );
  }
}

export default Form.create()(Step2);
