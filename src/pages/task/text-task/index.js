import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Form, Row, Col, DatePicker, Button, Divider, Card } from 'antd';
import styles from './style.less';
import StandardTable from './component/StandardTable';

const { RangePicker } = DatePicker;

@connect(({ textTaskList, loading }) => ({
  textTaskList,
  loading: loading.models.textTaskList,
}))
class TextTaskList extends Component {
  state = {
    selectedRows: [],
  };

  componentDidMount() {
    const { dispatch } = this.props;

    const params = {
      sorter: 'createdTime_descend',
    };
    dispatch({
      type: 'textTaskList/fetchTask',
      payload: params,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleReviewDetails = task => {
    console.log(task);
  };

  renderForm() {
    const { form: { getFieldDecorator } } = this.props;
    return (
      <Form layout="inline">
        <Row gutter={{ md: 8, lg: 16, xl: 24 }}>
          <Col md={8} sm={24}>
            <Form.Item label="创建时间">
              {
                getFieldDecorator('createdTime')(
                  <RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['开始时间', '结束时间']}/>)
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Form.Item label="截止时间">
              {
                getFieldDecorator('deadline')(
                  <RangePicker style={{ width: '100%' }} allowClear={false} placeholder={['开始时间', '结束时间']} />)
              }
            </Form.Item>
          </Col>
          <Col md={8} sm={24}>
            <Button type="primary" htmlType="submit">
              查询
            </Button>
            <Button style={{ marginLeft: 8 }}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  }

  render() {
    const { textTaskList: { data }, loading } = this.props;
    const { selectedRows } = this.state;

    const columns = [
      {
        title: '任务名称',
        dataIndex: 'taskName',
      },
      {
        title: '任务类型',
        dataIndex: 'taskType',
      },
      {
        title: '标注员',
        dataIndex: 'labeler',
      },
      {
        title: '标注进度',
        dataIndex: 'schedule',
      },
      {
        title: '任务状态',
        dataIndex: 'status',
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '截止时间',
        dataIndex: 'deadline',
        sorter: true,
      },
      {
        title: '操作',
        render: (_, task) => (
          <Fragment>
            <a onClick={() => this.handleReviewDetails(task)}>详情</a>
            <Divider type="vertical"/>
            <a>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListForm}>{this.renderForm()}</div>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary">新增</Button>
            <Button icon="delete">删除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default Form.create()(TextTaskList);
