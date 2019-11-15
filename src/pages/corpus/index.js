import React, { Component } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import {
  Button,
  Form,
  Card,
  Row,
  Col,
  Input,
  Select,
  InputNumber,
  TreeSelect,
  Tag,
  Icon,
  Divider,
  DatePicker
} from 'antd';
import FooterToolbar from '../form/advanced-form/components/FooterToolbar';
import EditableGroupTag from './components/EditableTagGroup';
import MultipleDialogField from './components/MultipleDialogFields';
import styles from './style.less';

const { Option } = Select;

const fieldLabels = {
  sex: '性别',
  age: '年龄',
  appearance: '外貌',
  emotion: '情感',
  profession: '职业',
  attendant: '随从',
  customize: '自定义',
  dialog: '对话时间',
  remark: '对话备注',
  videoUrl: '视频链接',
};

@connect(({ loading }) => ({
  submitting: loading.effects['formCorpusForm/submitCorpusForm'],
}))
class CorpusForm extends Component {
  state = {
    width: '100%',
  };

  componentDidMount() {
    window.addEventListener('resize', this.resizeFooterToolbar, {
      passive: true,
    });
    this.resizeFooterToolbar();
  }

  componentWillUnmount() {
    window.addEventListener('resize', this.resizeFooterToolbar);
  }

  resizeFooterToolbar = () => {
    requestAnimationFrame(() => {
      const sider = document.querySelectorAll('.ant-layout-sider')[0];

      if (sider) {
        const width = `calc(100% - ${sider.style.width})`;
        const { width: stateWidth } = this.state;
        if (stateWidth !== width) {
          this.setState({ width });
        }
      }
    });
  };

  validate = () => {
    const { form: { validateFieldsAndScroll }, dispatch } = this.props;
    validateFieldsAndScroll((error, values) => {
      if (!error) {
        const fieldValues = {};
        const findDialogNumPattern = /dialog-(\d{1,})-userKeys/g;

        fieldValues.dialogTime = values.dialogTime.format('YYYY-MM-DD HH:mm:ss');
        fieldValues.appearance = values.appearance;
        fieldValues.age = values.age;
        fieldValues.attendant = values.attendant;

        const dialogNumArray = [];
        Object.keys(values)
          .forEach(key => {
            if (key.indexOf('-userKeys') > 0) {
              findDialogNumPattern.lastIndex = 0;
              const result = findDialogNumPattern.exec(key.toString());
              dialogNumArray.push(result[1]);
            }
          });

        console.log(dialogNumArray);
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
          dialogGroups.push({
            user: userDialogs,
            customer: customDialogs,
          });
        });

        console.log(dialogGroups);

        values.dialogTime = values.dialogTime.format('YYYY-MM-DD HH:mm:ss');
        // console.log(values);
        dispatch({
          type: 'formCorpusForm/submitCorpusForm',
          payload: values,
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    const { form: { getFieldDecorator }, submitting } = this.props;
    const { width } = this.state;
    const treeData = [
      {
        title: '面部特征',
        value: 'face',
        key: 'face',
        children: [
          {
            title: '发型',
            value: 'hairstyle',
            key: 'hairstyle',
            children: [
              {
                title: '长发',
                value: 'longhair',
                key: 'longhair',
              },
              {
                title: '短发',
                value: 'bingle',
                key: 'bingle',
              }],
          },
          {
            title: '眼镜',
            value: 'glass',
            key: 'glass',
            children: [
              {
                title: '近视镜',
                value: 'myopic',
                key: 'myopic',
              },
              {
                title: '太阳镜',
                value: 'sunglass',
                key: 'sunglass',
              },
              {
                title: '无眼镜',
                value: 'natural',
                key: 'natural',
              }] }],
      },
      {
        title: '身体特征',
        value: 'body',
        key: 'body',
        children: [
          {
            title: '体型',
            value: 'bodytype',
            key: 'bodytype',
            children: [
              {
                title: '苗条',
                value: 'hide',
                key: 'hide',
              },
              {
                title: '肥胖',
                value: 'fat',
                key: 'fat',
              },
              {
                title: '正常',
                value: 'normal',
                key: 'normal',
              }] },
          {
            title: '穿着',
            value: 'clothes',
            key: 'clothes',
            children: [
              {
                title: '普通',
                value: 'plain',
                key: 'plain',
              },
              {
                title: '时髦',
                value: 'fashion',
                key: 'fashion',
              },
              {
                title: '工装',
                value: 'frock',
                key: 'frock',
              }],
          }] }];

    const professionData = [
      <Option value="institution">企事业单位人员</Option>,
      <Option value="technology">专业技术人员</Option>,
      <Option value="officer">办事人员</Option>,
      <Option value="server">服务人员</Option>,
      <Option value="agriculture">农林牧渔业人员</Option>,
      <Option value="prudctor">生产制造人员</Option>,
      <Option value="soldier">军人</Option>,
      <Option value="other">其他从业人员</Option>];

    const attendantMember = [
      <Option value="child">孩子</Option>,
      <Option value="spouse">配偶</Option>,
      <Option value="friend">朋友</Option>,
      <Option value="parent">长辈</Option>,
      <Option value="none">无</Option>,
    ];

    const emotionOptions = [
      <Option value="anger">愤怒</Option>,
      <Option value="hate">厌恶</Option>,
      <Option value="fear">害怕</Option>,
      <Option value="sad">悲伤</Option>,
      <Option value="happy">高兴</Option>,
      <Option value="like">喜欢</Option>,
      <Option value="surprise">惊喜</Option>,
      <Option value="neutral">中性</Option>,
    ];

    return (
      <>
        <PageHeaderWrapper content="请根据视频内容录入用户和客服的对话信息">
          <Card title="用户信息" className={styles.card} bordered={false} >
            <Form layout="vertical" hideRequiredMark>
              <Row gutter={16}>
                <Col xl={3} lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.sex}>
                    {
                      getFieldDecorator('sex', {
                        rules: [{
                          required: true,
                          message: '请选择性别',
                        }],
                      })(
                        <Select labelInValue placeholder="请选择性别">
                          <Option value="male">男</Option>
                          <Option value="female">女</Option>
                        </Select>)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 3, offset: 2 }} lg={8} md={8} sm={24}>
                  <Form.Item label={fieldLabels.age}>
                    {
                      getFieldDecorator('age', {
                        rules: [{
                          required: true,
                          message: '请输入年龄',
                        }],
                      })(<InputNumber style={{ width: '100%' }}/>)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 3, offset: 2 }} lg={2} md={8} sm={24}>
                  <Form.Item label={fieldLabels.profession}>
                    {
                      getFieldDecorator('profession', {
                        rules: [{
                          required: true,
                          message: '请选择职业',
                        },
                        ],
                        initialValue: 'other',
                      })(
                        <Select labelInValue placeholder="请选择职业" dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}>
                          {professionData}
                        </Select>)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={10} md={24} sm={24}>
                  <Form.Item label={fieldLabels.appearance}>
                    {
                      getFieldDecorator('appearance')(
                        <TreeSelect labelInValue placeholder="请选择外貌特征" treeData={treeData} allowClear multiple treeDefaultExpandAll />)
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col xl={3} lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.attendant}>
                    {
                      getFieldDecorator('attendant', {
                        initialValue: 'none',
                      })(
                        <Select labelInValue placeholder="请选择随从人员" dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}>
                          {attendantMember}
                        </Select>)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 3, offset: 2 }} lg={3} md={24} sm={24}>
                  <Form.Item label={fieldLabels.emotion}>
                    {
                      getFieldDecorator('emotion', {
                        initialValue: 'neutral',
                      })(
                        <Select labelInValue placeholder="请选择情感" dropdownMenuStyle={{ maxHeight: 400, overflow: 'auto' }}>
                          {emotionOptions}
                        </Select>)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 14, offset: 2 }} lg={14} md={24} sm={24}>
                  <Form.Item label={fieldLabels.customize}>
                    {
                      getFieldDecorator('customize')(
                        <EditableGroupTag form={form} />)
                    }
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Divider/>
                <Col xl={3} lg={6} md={12} sm={24}>
                  <Form.Item label={fieldLabels.dialog}>
                    {
                      getFieldDecorator('dialogTime')(
                        <DatePicker showTime placeholder="请选择时间" />)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.videoUrl}>
                    {
                      getFieldDecorator('videoUrl')(
                        <Input placeholder="请输入视频URL"/>)
                    }
                  </Form.Item>
                </Col>
                <Col xl={{ span: 6, offset: 2 }} lg={8} md={12} sm={24}>
                  <Form.Item label={fieldLabels.remark}>
                    {
                      getFieldDecorator('remark')(
                        <Input placeholder="备注信息，例如营销结果等信息"/>)
                    }
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
          <Card title="对话记录" className={styles.card} bordered={false} >
            <Form hideRequiredMark>
              <MultipleDialogField form={form} />
            </Form>
          </Card>
        </PageHeaderWrapper>
        <FooterToolbar style={{ width }}>
          <Button type="primary" onClick={this.validate} loading={submitting}>提交</Button>
        </FooterToolbar>
      </>
    );
  }
}

export default Form.create()(CorpusForm);
