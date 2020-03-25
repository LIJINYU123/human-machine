import React, { Component, Fragment } from 'react';
import {
  Button,
  Modal,
  Form,
  Cascader,
  Input,
  InputNumber,
  Popover,
  Radio,
  Tooltip,
  Icon,
} from 'antd';
import { SketchPicker } from 'react-color';
import update from 'immutability-helper';
import { connect } from 'dva';
import ItemData from '../map';
import DragSortingTable from './DragSortingTable';
import OptionCreateView from './OptionCreateView';
import styles from './style.less';

const { TextArea } = Input;
const { FieldLabels, labelTypes } = ItemData;

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

const prestColors = ['#F5222D', '#FA541C', '#FA8C16', '#FAAD14', '#FADB14', '#A0D911', '#52C41A', '#13C2C2',
  '#1890FF', '#2F54EB', '#722ED1', '#EB2F96', '#FF4D4F', '#FF7A45', '#FFA940', '#FFC53D',
  '#FFEC3D', '#BAE637', '#73D13D', '#36CFC9', '#40A9FF', '#597EF7', '#9254DE', '#F759AB',
  '#CF1322', '#D4380D', '#D46B08', '#D48806', '#D4B106', '#7CB305', '#389E0D', '#08979C',
  '#096DD9', '#1D39C4', '#531DAB', '#C41D7F',
];

@connect(({ createTemplate, loading }) => ({
  createTemplate,
  submitting: loading.effects['createTemplate/addTemplate'],
}))
class TemplateCreateView extends Component {
  state = {
    optionName: '',
    modalVisible: false,
    minValue: null,
    maxValue: null,
    labelType: [],
    validateStatus: 'success',
    help: '',
  };

  handleMoveRow = (dragIndex, hoverIndex) => {
    const { createTemplate: { optionData }, dispatch } = this.props;
    const dragRow = optionData[dragIndex];
    dispatch({
      type: 'createTemplate/saveOptions',
      payload: update(optionData, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      }),
    });
  };

  handleChange = color => {
    const { optionName } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'createTemplate/saveColor',
      payload: {
        optionName,
        color: color.hex,
      },
    });
  };

  handleCascaderChange = (value, _) => {
    this.setState({
      labelType: value,
    });
  };

  handleDeleteOption = optionName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'createTemplate/deleteOption',
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

  handleMinChange = value => {
    this.setState({ minValue: value });
  };

  handleMaxChange = value => {
    this.setState({ maxValue: value })
  };

  onValidateForm = () => {
    const { form: { validateFieldsAndScroll, getFieldsValue }, createTemplate: { optionData }, dispatch, onCancel } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { labelType, templateName, description, classifyName } = values;
        const setting = {};
        if (labelType.slice(-1)[0] === 'textExtension') {
          const { minValue, maxValue } = this.state;
          setting.minValue = minValue;
          setting.maxValue = maxValue;
        } else if (labelType.slice(-1)[0] === 'sequenceLabeling') {
          const { saveType } = values;
          setting.saveType = saveType;
          setting.optionData = optionData;
        } else {
          const { multiple } = values;
          setting.multiple = multiple;
          setting.optionData = optionData;
        }

        setting.classifyName = classifyName;

        dispatch({
          type: 'createTemplate/addTemplate',
          payload: {
            labelType: labelType.slice(-1)[0],
            templateName,
            description,
            setting,
          },
          callback: () => {
            dispatch({
              type: 'templateManage/fetchTemplate',
              payload: { sorter: 'createdTime_descend' },
            });
            onCancel();
            this.setState({
              labelType: [],
            });
          },
        });
      }
    });
  };

  render() {
    const { form: { getFieldDecorator }, visible, onCancel, createTemplate: { optionData }, submitting } = this.props;
    const { modalVisible, minValue, maxValue, validateStatus, help, labelType } = this.state;

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
      <Modal
        title="新建标注模板"
        maskClosable={false}
        visible={visible}
        onCancel={onCancel}
        onOk={this.onValidateForm}
        style={{ minWidth: '800px' }}
        confirmLoading={submitting}
        destroyOnClose
      >
        <Form>
          <Form.Item label={FieldLabels.labelType} {...formItemLayout}>
            {
              getFieldDecorator('labelType', {
                rules: [
                  {
                    required: true,
                    message: '请选择工具类型',
                  },
                ],
              })(<Cascader onChange={this.handleCascaderChange} options={labelTypes} style={{ width: '50%' }}/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.templateName} {...formItemLayout}>
            {
              getFieldDecorator('templateName', {
                rules: [
                  {
                    required: true,
                    message: '请输入模板名称',
                  },
                ],
              })(<Input className={styles.formItem}/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.description} {...formItemLayout}>
            {
              getFieldDecorator('description', {
                initialValue: '',
              })(<TextArea autoSize className={styles.formItem} />)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.classifyName} {...formItemLayout}>
            {
              getFieldDecorator('classifyName', {
                rules: [
                  {
                    required: true,
                    message: '请输入类别名称',
                  },
                ],
              })(<Input className={styles.formItem}/>)
            }
          </Form.Item>
          {
            labelType.length > 0 && labelType.slice(-1)[0] === 'sequenceLabeling' &&
            <Form.Item label={FieldLabels.saveType} {...formItemLayout}>
              {
                getFieldDecorator('saveType', {
                  initialValue: 'nomal',
                })(
                  <Radio.Group name="saveType">
                    <Radio value="nomal">普通</Radio>
                    <Radio value="dict">词典</Radio>
                  </Radio.Group>)
              }
              {
                <Tooltip title="词典方式存在词条名和同义词的概念，多用于实体识别中，即从某个句子中划出的词，是作为标准词条名，还是作为某个现有词条的同义词。" trigger="hover" ><Icon type="question-circle" style={{ fontSize: '16px', cursor: 'pointer' }} /></Tooltip>
              }
            </Form.Item>
          }
          {
            labelType.length > 0 && labelType.slice(-1)[0] === 'textExtension' &&
            <Fragment>
              <Form.Item label={FieldLabels.numberRange} {...formItemLayout} help={help} validateStatus={validateStatus}>
                <Fragment>
                  <InputNumber value={minValue} onChange={this.handleMinChange} placeholder="min" style={{ width: '24%' }}/>
                  <span> ~ </span>
                  <InputNumber value={maxValue} onChange={this.handleMaxChange} placeholder="max" style={{ width: '24%' }}/>
                </Fragment>
              </Form.Item>
            </Fragment>
          }
          {
            labelType.length > 0 && labelType.slice(-1)[0] === 'textClassify' &&
            <Form.Item label={FieldLabels.multiple} {...formItemLayout}>
              {
                getFieldDecorator('multiple', {
                  initialValue: true,
                })(
                  <Radio.Group name="multiple">
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>)
              }
            </Form.Item>
          }
          {
            labelType.length > 0 && labelType.slice(-1)[0] !== 'textExtension' &&
            <Fragment>
              <Button style={{ marginBottom: '16px' }} icon="plus" type="primary" onClick={this.handleAddOption}>选项</Button>
              <DragSortingTable
                data={optionData}
                columns={columns}
                onMoveRow={this.handleMoveRow}
              />
            </Fragment>
          }
        </Form>
        <OptionCreateView visible={modalVisible} onCancel={this.handleCancelModal} />
      </Modal>
    );
  }
}

export default Form.create()(TemplateCreateView);
