import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Form, Row, DatePicker, Select, Button } from 'antd';
import styles from './style.less';
import StandardTable from './components/StandardTable';

const { RangePicker } = DatePicker;
const { Option } = Select;

const getValue = obj => Object.keys(obj).map(key => obj[key]).join(',');

@connect(({ historyRecordList, loading }) => ({
  historyRecordList,
  loading: loading.models.historyRecordList,
}))
class HistoryList extends Component {
  state = {
    selectedRows: [],
    formValues: {},
  };

  columns = [
    {
      title: '录入时间',
      dataIndex: 'recordTime',
    },
    {
      title: '对话时间',
      dataIndex: 'dialogTime',
    },
    {
      title: '用户标签',
      dataIndex: 'tag',
    },
  ];

  componentDidMount() {
    const { dispatch, historyRecordList: { editors } } = this.props;
    dispatch({
      type: 'historyRecordList/fetch',
    });

    dispatch({
      type: 'historyRecordList/fetchName',
    });

    const filterOptions = editors.map(editor => ({
      text: editor.name,
      value: editor.id,
    }));
    this.columns.push({
      title: '录入者',
      dataIndex: 'editor',
      filters: filterOptions,
    })
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

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});
    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'listAndtableAndlist/fetch',
      payload: params,
    });
  };

  handleDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'historyRecordList/delete',
      payload: {
        key: selectedRows.map(row => row.key),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleFormRest = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    dispatch({
      type: 'historyRecordList/fetch',
    });
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
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
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }} onClick={this.handleFormRest}>
              重置
            </Button>
          </Col>
        </Row>
      </Form>
    );
  }


  render() {
    const { historyRecordList: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="export" type="primary">导出</Button>
              <Button icon="delete" type="danger" onClick={this.handleDelete}>删除</Button>
            </div>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={this.columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(HistoryList);
