import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Col, Form, Row, DatePicker, Button, Divider } from 'antd';
import styles from './style.less';
import StandardTable from './components/StandardTable';
import CorpusDrawer from './components/DetailView';

const { RangePicker } = DatePicker;

const getValue = obj => obj.join(',');

@connect(({ historyRecordList, loading }) => ({
  historyRecordList,
  loading: loading.models.historyRecordList,
}))
class HistoryList extends Component {
  state = {
    selectedRows: [],
    formValues: {},
    drawerVisible: false,
  };

  columns = [
    {
      title: '录入时间',
      dataIndex: 'recordTime',
      sorter: true,
      defaultSortOrder: 'descend',
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '对话时间',
      dataIndex: 'dialogTime',
      sorter: true,
      render: val => <span>{moment(val).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '用户标签',
      dataIndex: 'tag',
      ellipsis: true,
    },
  ];

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'historyRecordList/fetch',
    });

    dispatch({
      type: 'historyRecordList/fetchName',
    });
  }

  handleReviewDetails = record => {
    const { dispatch } = this.props;
    dispatch({
      type: 'historyRecordList/fetchDetail',
      payload: { key: record.id },
    });

    this.setState({
      drawerVisible: true,
    });
  };

  handleCloseDrawer = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  handleSearch = event => {
    event.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldValues) => {
      if (err) return;
      const values = {
        // eslint-disable-next-line max-len
        recordStartTime: fieldValues.recordTime && fieldValues.recordTime[0].format('YYYY-MM-DD HH:mm:ss'),
        recordEndTime: fieldValues.recordTime && fieldValues.recordTime[1].format('YYYY-MM-DD HH:mm:ss'),
        dialogStartTime: fieldValues.dialogTime && fieldValues.dialogTime[0].format('YYYY-MM-DD HH:mm:ss'),
        dialogEndTime: fieldValues.dialogTime && fieldValues.dialogTime[1].format('YYYY-MM-DD HH:mm:ss'),
      };
      this.setState({
        formValues: values,
      });
      dispatch({
        type: 'historyRecordList/fetch',
        payload: values,
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
      type: 'historyRecordList/fetch',
      payload: params,
    });
  };

  handleDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'historyRecordList/delete',
      payload: {
        keys: selectedRows.map(row => row.key),
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
                getFieldDecorator('recordTime')(
                  <RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['开始时间', '结束时间']} />,
                )
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="对话时间">
              {
                getFieldDecorator('dialogTime')(
                  <RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['开始时间', '结束时间']} />,
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
    const { historyRecordList: { data, editors, detailInfo }, loading } = this.props;
    const { selectedRows } = this.state;

    if (this.columns.length === 3 && editors.length) {
      const filterOptions = editors.map(editor => ({
        text: editor.name,
        value: editor.id,
      }));

      this.columns.push({
          title: '录入者',
          dataIndex: 'editor',
          filters: filterOptions,
        },
        {
          title: '操作',
          render: (_, record) => (
            <Fragment>
              <a onClick={() => this.handleReviewDetails(record)}>查看详情</a>
              <Divider type="vertical"/>
              <a>导出</a>
            </Fragment>
          ),
        },
      );
    }

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div>
            <div className={styles.tableListForm}>{this.renderForm()}</div>
            <div className={styles.tableListOperator}>
              <Button icon="export" type="primary" disabled={!selectedRows.length}>导出</Button>
              <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleDelete}>删除</Button>
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
        <CorpusDrawer visible={this.state.drawerVisible} onClose={this.handleCloseDrawer}
                      detailInfo={detailInfo}/>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(HistoryList);
