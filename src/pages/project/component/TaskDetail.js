import React, { Component } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { connect } from 'dva';
import { Input, Button, Icon, Statistic, Descriptions, Card, Steps, Tag } from 'antd';
import StandardTable from './StandardTable';
import styles from './style.less';
import Highlighter from 'react-highlight-words';
import ItemData from '../map';
import router from 'umi/router';

const { Step } = Steps;

const { reviewLabel, taskStatusName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const reviewFilters = Object.keys(reviewLabel).map(key => ({
  text: reviewLabel[key],
  value: key,
}));

@connect(({ textTaskDetail, loading }) => ({
  data: textTaskDetail.data,
  basicInfo: textTaskDetail.basicInfo,
  loading: loading.effects['textTaskDetail/fetchDetail'],
}))
class TaskDetail extends Component {
  state = {
    taskId: undefined,
    selectedRows: [],
    filteredInfo: {},
    searchText: '',
    searchedColumn: '',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'textTaskDetail/fetchDetail',
      payload: location.state.taskId,
    });

    dispatch({
      type: 'textTaskDetail/fetchLabelData',
      payload: { taskId: location.state.taskId },
    });

    this.setState({
      taskId: location.state.taskId,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch } = this.props;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      taskId: this.state.taskId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'textTaskDetail/fetchLabelData',
      payload: params,
    });
  };

  getColumnSearchProps = dataIndex => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input ref={node => { this.searchInput = node; }}
               placeholder={`搜索 ${dataIndex}`}
               value={selectedKeys[0]}
               onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
               onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
               style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (<Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />),
    onFilterDropdownVisibleChange: visible => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: text => (this.state.searchedColumn === dataIndex ? (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ) : text),
  });

  handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();

    this.setState({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  handleReset = clearFilters => {
    clearFilters();
    this.setState({
      searchText: '',
    });
  };

  handleDelete = sentenceInfo => {
    const { dispatch } = this.props;
    const { taskId } = this.state;
    dispatch({
      type: 'textTaskDetail/deleteLabelData',
      payload: {
        taskId,
        sentenceIds: [sentenceInfo.sentenceId],
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { taskId, selectedRows } = this.state;
    dispatch({
      type: 'textTaskDetail/deleteLabelData',
      payload: {
        taskId,
        sentenceIds: selectedRows.map(row => row.sentenceId),
      },
      callback: () => {
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleGoBack = () => {
    router.goBack();
  };

  render() {
    const { data, basicInfo, loading } = this.props;
    const { selectedRows } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value={taskStatusName[basicInfo.status]}/>
        <Statistic title="标注进度" value={basicInfo.schedule} suffix="%"/>
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="标注员">{basicInfo.labelerName}</Descriptions.Item>
        <Descriptions.Item label="质检员">{basicInfo.inspectorName}</Descriptions.Item>
      </Descriptions>
    );

    const stepDesc1 = () => (
        <div>
          {basicInfo.labelerName}
        </div>
      );

    const stepDesc2 = () => (
        <div>
          {basicInfo.inspectorName}
        </div>
      );

    const stepCurrent = () => {
      if (basicInfo.status === 'initial') {
        return 0;
      }

      if (['labeling', 'reject'].includes(basicInfo.status)) {
        return 1;
      }

      if (basicInfo.status === 'review') {
        return 2;
      }

      return 3;
    };

    const action = (
      <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleGoBack}>返回</Button>
    );

    const columns = [
      {
        title: '标注结果',
        dataIndex: 'labelResult',
        render: val => {
          if (val.length) {
            return val.map(value => (<Tag color="blue">{value}</Tag>));
          }
          return '';
        },
      },
      {
        title: '质检结果',
        dataIndex: 'reviewResult',
        render: val => reviewLabel[val],
        filters: reviewFilters,
        filteredValue: filteredInfo.reviewResult || null,
      },
      {
        title: '备注',
        dataIndex: 'remark',
      },
      {
        title: '操作',
        render: (_, sentenceInfo) => (
          <a onClick={() => this.handleDelete(sentenceInfo)}>删除</a>
        ),
      },
    ];
    if (data.list.length && data.list[0].data.hasOwnProperty('sentence')) {
      columns.splice(0, 0, {
        title: '文本',
        dataIndex: 'sentence',
        ...this.getColumnSearchProps('sentence'),
      });
    } else {
      columns.splice(0, 0, {
        title: '文本1',
        dataIndex: 'sentence1',
        ...this.getColumnSearchProps('sentence1'),
      });
      columns.splice(1, 0, {
        title: '文本2',
        dataIndex: 'sentence2',
        ...this.getColumnSearchProps('sentence2'),
      });
    }

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card title="流程进度" className={styles.card} bordered={false}>
          <Steps
            progressDot
            current={stepCurrent()}
          >
            <Step title="未领取"/>
            <Step title="标注" description={stepDesc1()}/>
            <Step title="质检" description={stepDesc2()}/>
            <Step title="完成"/>
          </Steps>
        </Card>
        <Card title="标注数据" className={styles.card} bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleBatchDelete}>删除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={data}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TaskDetail;
