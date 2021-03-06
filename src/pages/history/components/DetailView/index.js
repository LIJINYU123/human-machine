import React, { Component } from 'react';
import { connect } from 'dva';
import {
  Button,
  Card,
  Col,
  DatePicker,
  Divider,
  Drawer,
  Form, Input,
  InputNumber,
  Row,
  Select,
  TreeSelect,
} from 'antd';
import moment from 'moment';
import styles from './style.less';
import ItemData from './map';
import EditableGroupTag from './EditableTagGroup';
import MultipleDialogField from './MultipleDialogFields';
import FooterToolbar from '../../../form/advanced-form/components/FooterToolbar';


const { Option } = Select;
const { TextArea } = Input;
const { FieldLabels, TreeData, ProfessionData, AttendantMember, EmotionOptions } = ItemData;

@connect(({ historyRecordList, loading }) => ({
  historyRecordList,
  submitting: loading.effects['historyRecordList/submitDetailView'],
}))
class CorpusDrawer extends Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeDrawer, {
      passive: true,
    });
    this.resizeDrawer();
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.resizeDrawer);
  }

  resizeDrawer = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];

      if (sider) {
        const width = `calc(100% - ${sider.style.width} - 200px)`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    // eslint-disable-next-line max-len
    const { form: { validateFieldsAndScroll, getFieldsValue }, onClose, dispatch, historyRecordList: { key } } = this.props;
    validateFieldsAndScroll(error => {
      if (!error) {
        const fieldValues = {};
        const findDialogNumPattern = /dialog-(\d{1,})-userKeys/g;

        const values = getFieldsValue();

        fieldValues.dialogTime = values.dialogTime.format('YYYY-MM-DD HH:mm:ss');
        fieldValues.appearance = values.appearance;
        fieldValues.age = values.age;
        fieldValues.attendant = values.attendant;
        fieldValues.emotion = values.emotion;
        fieldValues.profession = values.profession;
        fieldValues.remark = values.remark;
        fieldValues.sex = values.sex;
        fieldValues.videoId = values.videoId;
        fieldValues.customize = values.customize;
        fieldValues.uniqueId = key;

        const dialogNumArray = [];
        Object.keys(values)
        // eslint-disable-next-line no-shadow
          .forEach(key => {
            if (key.indexOf('-userKeys') > 0) {
              findDialogNumPattern.lastIndex = 0;
              const result = findDialogNumPattern.exec(key.toString());
              dialogNumArray.push(result[1]);
            }
          });

        const dialogGroups = [];
        dialogNumArray.forEach(dialogNum => {
          const dialogUserKeys = `dialog-${dialogNum}-userKeys`;
          const dialogUserValues = values[dialogUserKeys];

          if (!values.hasOwnProperty(dialogUserValues[0])) {
            return;
          }

          const userDialogs = dialogUserValues.map(key => values[key]);

          const dialogCustomKeys = `dialog-${dialogNum}-customKeys`;
          const dialogCustomValues = values[dialogCustomKeys];
          const customDialogs = dialogCustomValues.map(key => values[key]);

          const dialogReverse = values[`dialog-${dialogNum}-reverse`];

          const questioner = dialogReverse === true ? 'user' : 'customer';
          dialogGroups.push({
            user: userDialogs,
            customer: customDialogs,
            questioner,
          });
        });

        fieldValues.dialogInfos = dialogGroups;
        console.log(fieldValues);
        dispatch({
          type: 'historyRecordList/submitDetailView',
          payload: fieldValues,
          callback: onClose,
        });
      }
    });
  };

  render() {
    const { width } = this.state;
    // eslint-disable-next-line max-len
    const { visible, onClose, form, detailInfo, disabled, form: { getFieldDecorator }, submitting } = this.props;
    return (
      <Drawer title="对话详情" width={this.state.width} visible={visible} onClose={onClose} bodyStyle={{ backgroundColor: '#f0f2f5' }} destroyOnClose>
        <Card title="用户信息" className={styles.card} bordered={false}>
          <Form layout="vertical" hideRequiredMark>
            <Row gutter={16}>
              <Col xl={6} lg={6} md={12} sm={24}>
                <Form.Item label={FieldLabels.sex}>
                  {
                    getFieldDecorator('sex', {
                      rules: [{
                        required: true,
                        message: '请选择性别',
                      }],
                      initialValue: detailInfo.sex,
                    })(
                      <Select labelInValue placeholder="请选择性别" disabled={disabled}>
                        <Option key="male">男</Option>
                        <Option key="female">女</Option>
                      </Select>)
                  }
                </Form.Item>
              </Col>
              <Col xl={6} lg={8} md={8} sm={24}>
                <Form.Item label={FieldLabels.age}>
                  {
                    getFieldDecorator('age', {
                      rules: [{
                        required: true,
                        message: '请输入年龄',
                      }],
                      initialValue: detailInfo.age,
                    })(<InputNumber style={{ width: '100%' }} disabled={disabled}/>)
                  }
                </Form.Item>
              </Col>
              <Col xl={6} lg={2} md={8} sm={24}>
                <Form.Item label={FieldLabels.profession}>
                  {
                    getFieldDecorator('profession', {
                      rules: [{
                        required: true,
                        message: '请选择职业',
                      },
                      ],
                      initialValue: detailInfo.profession,
                    })(
                      <Select labelInValue placeholder="请选择职业" dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} disabled={disabled}>
                        {ProfessionData}
                      </Select>)
                  }
                </Form.Item>
              </Col>
              <Col xl={6} lg={10} md={24} sm={24}>
                <Form.Item label={FieldLabels.appearance}>
                  {
                    getFieldDecorator('appearance', {
                      initialValue: detailInfo.appearance,
                    })(
                      <TreeSelect labelInValue placeholder="请选择外貌特征" treeData={TreeData} allowClear multiple disabled={disabled}/>)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col xl={6} lg={6} md={12} sm={24}>
                <Form.Item label={FieldLabels.attendant}>
                  {
                    getFieldDecorator('attendant', {
                      initialValue: detailInfo.attendant,
                    })(
                      <Select labelInValue placeholder="请选择随从人员" dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} disabled={disabled}>
                        {AttendantMember}
                      </Select>)
                  }
                </Form.Item>
              </Col>
              <Col xl={6} lg={3} md={24} sm={24}>
                <Form.Item label={FieldLabels.emotion}>
                  {
                    getFieldDecorator('emotion', {
                      initialValue: detailInfo.emotion,
                    })(
                      <Select labelInValue placeholder="请选择情感" dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }} disabled={disabled}>
                        {EmotionOptions}
                      </Select>)
                  }
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={24} sm={24}>
                <Form.Item label={FieldLabels.customize}>
                  {
                    getFieldDecorator('customize')(
                      // eslint-disable-next-line max-len
                      <EditableGroupTag form={form} mytags={detailInfo.customize} disabled={disabled}/>)
                  }
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Divider/>
              <Col xl={6} lg={6} md={12} sm={24}>
                <Form.Item label={FieldLabels.dialog}>
                  {
                    getFieldDecorator('dialogTime', {
                      rules: [{
                        required: true,
                        message: '请选择对话开始时间',
                      }],
                      initialValue: moment(detailInfo.dialogTime, 'YYYY-MM-DD HH:mm:ss'),
                    })(
                      <DatePicker showTime placeholder="请选择时间" disabled={disabled} style={{ width: '100%' }}/>)
                  }
                </Form.Item>
              </Col>
              <Col xl={6} lg={8} md={12} sm={24}>
                <Form.Item label={FieldLabels.videoId}>
                  {
                    getFieldDecorator('videoId', {
                      initialValue: detailInfo.videoId,
                    })(
                      <Input placeholder="请输入视频编号" disabled={disabled}/>)
                  }
                </Form.Item>
              </Col>
              <Col xl={12} lg={12} md={12} sm={24}>
                <Form.Item label={FieldLabels.remark}>
                  {
                    getFieldDecorator('remark', {
                      initialValue: detailInfo.remark,
                    })(
                      <TextArea placeholder="备注信息，例如营销结果等信息" disabled={disabled} autoSize/>)
                  }
                </Form.Item>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card title="对话记录" className={styles.card} bordered={false}>
          <Form hideRequiredMark>
            {/* eslint-disable-next-line max-len */}
            <MultipleDialogField form={form} dialogInfos={detailInfo.dialogInfos} disabled={disabled}/>
          </Form>
        </Card>
        <FooterToolbar style={{ width }}>
          <Button type="primary" onClick={this.validate} loading={submitting} disabled={disabled}>更新</Button>
        </FooterToolbar>
      </Drawer>
    );
  }
}

export default Form.create()(CorpusDrawer);
