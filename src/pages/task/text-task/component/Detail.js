import React, { Component, Fragment } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Descriptions, Statistic, Steps, Input, Icon } from 'antd';
import Link from 'umi/link';
import { connect } from 'dva';
import Highlighter from 'react-highlight-words';
import StandardTable from './StandardTable';
import styles from './style.less';
import ItemData from '../map';

const { Step } = Steps;
const { ApproveLabel, statusName, taskTypeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const approveFilters = Object.keys(ApproveLabel).map(key => ({
  text: ApproveLabel[key],
  value: key,
}));

@connect(({ textTaskDetail, loading }) => ({
  data: textTaskDetail.data,
  basicInfo: textTaskDetail.basicInfo,
  loading: loading.effects['textTaskDetail/fetchDetail'],
}))
class TextTaskDetail extends Component {
  state = {
    selectedRows: [],
    filteredInfo: {},
    searchText: '',
    searchedColumn: '',
    taskId: undefined,
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

  render() {
    const { data, basicInfo, loading } = this.props;
    const { selectedRows } = this.state;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value={statusName[basicInfo.status]} />
        <Statistic title="标注进度" value={basicInfo.schedule} suffix="%"/>
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="任务类型">{taskTypeName[basicInfo.taskType]}</Descriptions.Item>
        <Descriptions.Item label="创建时间">{basicInfo.createdTime}</Descriptions.Item>
        <Descriptions.Item label="截止时间">{basicInfo.deadline}</Descriptions.Item>
        <Descriptions.Item label="标注员">{basicInfo.labelerName}</Descriptions.Item>
        <Descriptions.Item label="审核员">{basicInfo.assessorName}</Descriptions.Item>
        <Descriptions.Item label="验收员">{basicInfo.acceptorName}</Descriptions.Item>
        <Descriptions.Item label="标注工具">{basicInfo.markTool ? basicInfo.markTool.map(item => item.classifyName).join('，') : ''}</Descriptions.Item>
      </Descriptions>
    );

    const stepDesc1 = () => {
      if (basicInfo.status === 'labeling' || basicInfo.status === 'reject') {
        return (
          <div>
            {basicInfo.labelerName}
            <div><a>催一下</a></div>
          </div>
        );
      }

      return (
        <div>
          {basicInfo.labelerName}
        </div>
      );
    };

    const stepDesc2 = () => {
      if (basicInfo.status === 'firstTrial' || basicInfo.status === 'deny') {
       return (
         <div>
           {basicInfo.assessorName}
           <div><a>催一下</a></div>
         </div>
       )
      }
      return (
        <div>
          {basicInfo.assessorName}
        </div>
      );
    };

    const stepDesc3 = () => {
      if (basicInfo.status === 'review') {
        return (
          <div>
            {basicInfo.acceptorName}
            <div><a>催一下</a></div>
          </div>
        );
      }
      return (
        <div>
          {basicInfo.acceptorName}
        </div>
      );
    };

    const stepCurrent = () => {
      if (basicInfo.status === 'initial') {
        return 0;
      }

      if (['labeling', 'reject'].includes(basicInfo.status)) {
        return 1;
      }

      if (['firstTrial', 'deny'].includes(basicInfo.status)) {
        return 2;
      }

      if (basicInfo.status === 'review') {
        return 3
      }
      return 4;
    };

    const action = (
      <Fragment>
        <Button>编辑</Button>
        <Link to="/task/text-task">
          <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
        </Link>
      </Fragment>
    );

    const columns = [
      {
        title: 'sentence',
        dataIndex: 'sentence',
        ...this.getColumnSearchProps('sentence'),
      },
      {
        title: '标注结果',
        dataIndex: 'result',
        render: val => val.map(item => item.join('，')).join(' | '),
      },
      {
        title: '审核结果',
        dataIndex: 'firstTrial',
        render: val => ApproveLabel[val],
        filters: approveFilters,
        filteredValue: filteredInfo.firstTrial || null,
      },
      {
        title: '验收结果',
        dataIndex: 'review',
        render: val => ApproveLabel[val],
        filters: approveFilters,
        filteredValue: filteredInfo.review || null,
      },
      {
        title: '操作',
        render: (_, sentenceInfo) => (
          <a onClick={() => this.handleDelete(sentenceInfo)}>删除</a>
        ),
      },
    ];

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
            <Step title="创建任务"/>
            <Step title="标注" description={stepDesc1()}/>
            <Step title="审核" description={stepDesc2()}/>
            <Step title="验收" description={stepDesc3()}/>
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

export default TextTaskDetail;
