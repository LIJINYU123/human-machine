import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Form, Row, DatePicker, Select, Button } from 'antd';
import styles from './style.less';

const { RangePicker } = DatePicker;
const { Option } = Select;

@connect(({ historyRecordList, loading }) => ({
  historyRecordList,
  loading: loading.models.historyRecordList,
}))
class HistoryList extends Component {
  state = {
    selectedRows: [],
    formValues: {},
    disabled: true,
  };

  componentDidMount() {
    const { dispath } = this.props;
    dispath({
      type: 'historyRecordList/fetch',
    });

    dispath({
      type: 'historyRecordList/fetchName',
    });
  }

  handleSearch = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldValues) => {
      if (err) return;
      this.setState({
        formValues: fieldValues,
      });
      dispatch({
        type: 'historyRecordList/fetch',
        payload: fieldValues,
      });
    });
  };

  handleDelete = () => {

  };

  handleFormRest = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'historyRecordList/fetch',
    });
  };

  renderForm() {
    const { form: { getFieldDecorator }, historyRecordList: { editors } } = this.props;
    return (
      <Form onSubmit={this.handleSearch} layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={8} sm={24}>
            <Form.Item label="录入时间">
              {
                getFieldDecorator('recordDate')(
                  <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />,
                )
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="对话时间">
              {
                getFieldDecorator('dialogDate')(
                  <RangePicker style={{ width: '100%' }} placeholder={['开始时间', '结束时间']} />,
                )
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="录入者">
              {
                getFieldDecorator('editor')(
                  <Select showSearch allowClear optionFilterProp="children" style={{ width: '100%' }} placeholder="请选择录入者" >
                    {editors.map(editor => <Option key={editor.id}>{editor.name}</Option>)}
                  </Select>)
              }
            </Form.Item>
          </Col>
        </Row>
        <div style={{ float: 'right', marginBottom: 24 }}>
          <Button type="primary" htmlType="submit">
            查询
          </Button>
          <Button style={{ marginLeft: 8 }} onClick={this.handleFormRest}>
            重置
          </Button>
        </div>
      </Form>
    );
  }


  render() {
    const { historyRecordList: { data }, loading } = this.props;
    const { selectedRows, formValues } = this.props;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="delete" type="danger" onClick={}>

              </Button>
            </div>
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

