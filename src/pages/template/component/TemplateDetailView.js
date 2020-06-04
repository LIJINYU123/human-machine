import React, { Component, Fragment } from 'react';
import { Button, Modal, Form, Input, InputNumber, Popover, Radio, Tooltip, Icon } from 'antd';
import { SketchPicker } from 'react-color';
import update from 'immutability-helper';
import { connect } from 'dva';
import ItemData from '../map';
import DragSortingTable from './DragSortingTable';
import OptionDetailView from './OptionDetailView';
import styles from './style.less';

const { TextArea } = Input;
const { FieldLabels, labelTypeName } = ItemData;

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

@connect(({ updateTemplate, templateManage, loading }) => ({
  updateTemplate,
  templateManage,
  submitting: loading.effects['updateTemplate/updateTemplate'],
}))
class TemplateDetailView extends Component {
  state = {
    optionName: '',
    modalVisible: false,
    minValue: null,
    maxValue: null,
    validateStatus: 'success',
    help: '',
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.templateInfo.setting.hasOwnProperty('minValue') && prevState.minValue !== nextProps.templateInfo.setting.minValue) {
      return { minValue: nextProps.templateInfo.setting.minValue, maxValue: nextProps.templateInfo.setting.maxValue }
    }

    return null;
  }

  handleMoveRow = (dragIndex, hoverIndex) => {
    const { updateTemplate: { optionData }, dispatch } = this.props;
    const dragRow = optionData[dragIndex];
    dispatch({
      type: 'updateTemplate/saveOptions',
      payload: update(optionData, {
        $splice: [[dragIndex, 1], [hoverIndex, 0, dragRow]],
      }),
    });
  };

  handleChange = color => {
    const { optionName } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: 'updateTemplate/saveColor',
      payload: {
        optionName,
        color: color.hex,
      },
    });
  };

  handleDeleteOption = optionName => {
    const { dispatch } = this.props;
    dispatch({
      type: 'updateTemplate/deleteOption',
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
    const { form: { validateFieldsAndScroll, getFieldsValue }, updateTemplate: { optionData }, dispatch, onCancel, templateInfo } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const values = getFieldsValue();
        const { templateName, description, classifyName } = values;
        const setting = {};
        if (templateInfo.labelType === 'textExtension') {
          const { minValue, maxValue } = this.state;
          setting.minValue = minValue;
          setting.maxValue = maxValue;
        } else if (templateInfo.labelType === 'sequenceLabeling') {
          const { saveType } = values;
          setting.saveType = saveType;
          setting.options = optionData;
        } else {
          const { multiple } = values;
          setting.multiple = multiple;
          setting.options = optionData;
        }

        setting.classifyName = classifyName;

        dispatch({
          type: 'updateTemplate/modifyTemplate',
          payload: {
            templateId: templateInfo.templateId,
            templateName,
            description,
            setting,
          },
          callback: () => {
            dispatch({
              type: 'templateManage/fetchTemplate',
              payload: { sorter: 'updatedTime_descend' },
            });
            onCancel();
            this.setState({
              minValue: null,
              maxValue: null,
            });
          },
        });
      }
    });
  };

  checkTemplateName = (rule, value, callback) => {
    const { templateManage: { data }, templateInfo } = this.props;
    if (!value.trim()) {
      callback('请输入模板名称');
    } else if (data.filter(item => item.templateName !== templateInfo.templateName && item.templateName === value).length) {
      callback('该模板名称已经存在');
    } else {
      callback();
    }
  };

  render() {
    const { form: { getFieldDecorator }, visible, onCancel, templateInfo, updateTemplate: { optionData }, submitting } = this.props;
    const { modalVisible, minValue, maxValue, validateStatus, help } = this.state;
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
        title="标注模板详情"
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
                initialValue: labelTypeName[templateInfo.labelType],
              })(<Input style={{ width: '50%' }} disabled/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.templateName} {...formItemLayout}>
            {
              getFieldDecorator('templateName', {
                rules: [
                  {
                    required: true,
                    validator: this.checkTemplateName,
                  },
                ],
                initialValue: templateInfo.templateName,
              })(<Input className={styles.formItem}/>)
            }
          </Form.Item>
          <Form.Item label={FieldLabels.description} {...formItemLayout}>
            {
              getFieldDecorator('description', {
                initialValue: templateInfo.description,
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
                    whitespace: true,
                  },
                ],
                initialValue: templateInfo.setting.classifyName,
              })(<Input className={styles.formItem}/>)
            }
          </Form.Item>
          {
            templateInfo.labelType === 'sequenceLabeling' &&
            <Form.Item label={FieldLabels.saveType} {...formItemLayout}>
              {
                getFieldDecorator('saveType', {
                  initialValue: templateInfo.setting.saveType,
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
            templateInfo.labelType === 'textExtension' &&
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
            templateInfo.labelType === 'textClassify' &&
            <Form.Item label={FieldLabels.multiple} {...formItemLayout}>
              {
                getFieldDecorator('multiple', {
                  initialValue: templateInfo.setting.multiple,
                })(
                  <Radio.Group name="multiple">
                    <Radio value>是</Radio>
                    <Radio value={false}>否</Radio>
                  </Radio.Group>)
              }
            </Form.Item>
          }
          {
            templateInfo.labelType !== 'textExtension' &&
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
        <OptionDetailView visible={modalVisible} onCancel={this.handleCancelModal} />
      </Modal>
    );
  }
}

export default Form.create()(TemplateDetailView);
