import React, { Component } from 'react';
import { Button, Form, Select, Input, Popover, Radio, Checkbox, Icon, Tooltip } from 'antd';
import { connect } from 'dva';
import update from 'immutability-helper';
import { SketchPicker } from 'react-color';
import DragSortingTable from './DragSortingTable';
import OptionCreateView from './OptionCreateView';
import styles from './style.less';
import ItemData from '../map';

const { FieldLabels } = ItemData;
const { Option } = Select;

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

const prestColors = ['#F5222D', '#FA541C', '#FA8C16', '#FAAD14', '#FADB14', '#A0D911', '#52C41A', '#13C2C2',
  '#1890FF', '#2F54EB', '#722ED1', '#EB2F96', '#FF4D4F', '#FF7A45', '#FFA940', '#FFC53D',
  '#FFEC3D', '#BAE637', '#73D13D', '#36CFC9', '#40A9FF', '#597EF7', '#9254DE', '#F759AB',
  '#CF1322', '#D4380D', '#D46B08', '#D48806', '#D4B106', '#7CB305', '#389E0D', '#08979C',
  '#096DD9', '#1D39C4', '#531DAB', '#C41D7F',
];

@connect(({ textProjectFormData, loading }) => ({
  textProjectFormData,
  submitting: loading.effects['textProjectFormData/saveStepTwoData'],
}))
class Step2 extends Component {
  state = {
    optionName: '',
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch, textProjectFormData: { stepOne } } = this.props;
    const { labelType } = stepOne;
    dispatch({
      type: 'textProjectFormData/fetchTemplate',
      payload: { labelType: labelType[labelType.length - 1] },
    });
  }

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, dispatch } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        dispatch({
          type: 'textProjectFormData/saveStepTwoData',
          payload: values,
        });
      }
    });
  };

  handleSelectChange = (value, _) => {
    const { textProjectFormData: { templates }, form: { setFieldsValue }, dispatch } = this.props;
    if (typeof value !== 'undefined') {
      const filterTemplates = templates.filter(t => t.templateId === value);
      const { options } = filterTemplates[0];
      setFieldsValue({ classifyName: filterTemplates[0].classifyName });
      setFieldsValue({ multiple: filterTemplates[0].multiple });
      dispatch({
        type: 'textProjectFormData/saveOptions',
        payload: options,
      });
    }
  };

  onPrev = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/stepTwoPrevious',
    });
  };

  handleMoveRow = (dragIndex, hoverIndex) => {
    const { textProjectFormData: { optionData }, dispatch } = this.props;
    const dragRow = optionData[dragIndex];
    dispatch({
      type: 'textProjectFormData/saveOptions',
      payload: update(optionData, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      }),
    });
  };

  handleChange = color => {
    const { optionName } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/saveColor',
      payload: {
        optionName,
        color: color.hex,
      },
    });
  };

  handleDeleteOption = optionName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/deleteOption',
      payload: { optionName },
    });
  };

  handleAddOption = () => {
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
      optionName: record.optionName,
    });
  };

  handleCheckboxChange = event => {
    const { dispatch } = this.props;
    dispatch({
      type: 'textProjectFormData/saveCheckBox',
      payload: { saveTemplate: event.target.checked },
    });
  };

  render() {
    const { textProjectFormData: { templates, optionData, saveTemplate, stepOne, stepTwo }, form: { getFieldDecorator }, submitting } = this.props;
    const { labelType } = stepOne;
    const { templateName, classifyName, defaultTool, multiple, saveType } = stepTwo;
    const { modalVisible } = this.state;
    // eslint-disable-next-line max-len
    const templateOptions = templates ? templates.map(template => <Option key={template.templateId}>{template.templateName}</Option>) : [];

    const columns = [
      {
        title: '选项',
        dataIndex: 'optionName',
      },
      {
        title: '颜色',
        dataIndex: 'color',
        render: (val, record) => <Popover trigger="click" content={<SketchPicker presetColors={prestColors} color={val} onChange={this.handleChange}/>}><div className={styles.colorPicker} onClick={() => this.handleClickDiv(record)}><div className={styles.color} style={{ background: `${val}` }}></div></div></Popover>,
      },
      {
        title: '操作',
        render: (_, record) => (<a onClick={() => this.handleDeleteOption(record.optionName)}>删除</a>),
      },
    ];

    return (
      <Form>
        <Form.Item label={FieldLabels.defaultTool} {...formItemLayout}>
          {
            getFieldDecorator('defaultTool', {
              initialValue: defaultTool,
            })(
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
          {
            <Checkbox style={{ marginLeft: '16px' }} onChange={this.handleCheckboxChange} checked={saveTemplate}>保存模板</Checkbox>
          }
        </Form.Item>
        {
          saveTemplate && <Form.Item label={FieldLabels.templateName} {...formItemLayout}>
            {
              getFieldDecorator('templateName', {
                rules: [
                  {
                    required: true,
                    message: '请输入模板名称',
                  },
                ],
                initialValue: templateName,
              })(<Input style={{ width: '50%' }} />)
            }
          </Form.Item>
        }
        <Form.Item label={FieldLabels.classifyName} {...formItemLayout}>
          {
            getFieldDecorator('classifyName', {
              rules: [
                {
                  required: true,
                  message: '请输入类别名称',
                },
              ],
              initialValue: classifyName,
            })(<Input style={{ width: '50%' }} />)
          }
        </Form.Item>
        {
          labelType[labelType.length - 1] === 'sequenceLabeling' &&
          <Form.Item label={FieldLabels.saveType} {...formItemLayout}>
            {
              getFieldDecorator('saveType', {
                initialValue: saveType,
              })(
                <Radio.Group name="saveType">
                  <Radio value="nomal">普通</Radio>
                  <Radio value="dict">词典</Radio>
                </Radio.Group>)
            }
            {
              <Tooltip title="提示。。。。。" trigger="hover" ><Icon type="question-circle" style={{ fontSize: '16px', cursor: 'pointer' }} /></Tooltip>
            }
          </Form.Item>
        }
        <Form.Item label={FieldLabels.multiple} {...formItemLayout}>
          {
            getFieldDecorator('multiple', {
              initialValue: multiple,
            })(
              <Radio.Group name="multiple">
                <Radio value>是</Radio>
                <Radio value={false}>否</Radio>
              </Radio.Group>)
          }
        </Form.Item>
        <Button className={styles.tableListOperator} icon="plus" type="primary" onClick={this.handleAddOption}>选项</Button>
        <DragSortingTable
          data={optionData}
          columns={columns}
          onMoveRow={this.handleMoveRow}
        />
        <Button type="primary" onClick={this.onValidateForm} loading={submitting} style={{ marginTop: '16px' }}>下一步</Button>
        <Button style={{ marginLeft: '8px' }} onClick={this.onPrev}>上一步</Button>
        <OptionCreateView visible={modalVisible} onCancel={this.handleCancelModal} />
      </Form>
    );
  }
}

export default Form.create()(Step2);
