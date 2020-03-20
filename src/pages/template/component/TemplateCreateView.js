import React, { Component } from 'react';
import { Button, Modal, Form, Cascader, Input, Popover, Radio } from 'antd';
import { SketchPicker } from 'react-color';
import update from 'immutability-helper';
import { connect } from 'dva';
import ItemData from '../map';
import styles from './style.less';
import DragSortingTable from './DragSortingTable';
import OptionCreateView from './OptionCreateView';

const { FieldLabels, labelTypes } = ItemData;

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

@connect(({ createTemplate, loading }) => ({
  createTemplate,
}))
class TemplateCreateView extends Component {
  state = {
    optionName: '',
    modalVisible: false,
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

  render() {
    const { form: { getFieldDecorator }, visible, onCancel, createTemplate: { optionData } } = this.props;
    const { modalVisible } = this.state;

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
        style={{ minWidth: '950px' }}
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
              })(<Cascader options={labelTypes} style={{ width: '50%' }}/>)
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
          <Button style={{ marginBottom: '16px' }} icon="plus" type="primary" onClick={this.handleAddOption}>选项</Button>
          <DragSortingTable
            data={optionData}
            columns={columns}
            onMoveRow={this.handleMoveRow}
          />
        </Form>
        <OptionCreateView visible={modalVisible} onCancel={this.handleCancelModal} />
      </Modal>
    );
  }
}

export default Form.create()(TemplateCreateView);
