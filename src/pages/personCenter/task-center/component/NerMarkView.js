import React, { Component } from 'react';
import { Button, Card, Descriptions, Icon, Input, Statistic, Tag } from 'antd';
import { connect } from 'dva';
import Highlighter from 'react-highlight-words';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import StandardTable from './StandardTable';
import NerModalView from './NerModalView';
import ItemData from '../map';
import styles from './style.less';

const { labelTypeName, taskStatusName, reviewLabel, labelResult } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const reviewFilters = Object.keys(reviewLabel).map(key => ({
  text: reviewLabel[key],
  value: key,
}));

const labelResultFilters = Object.keys(labelResult).map(key => ({
  text: labelResult[key],
  value: key,
}));

@connect(({ textMark, loading }) => ({
  data: textMark.data,
  markTools: textMark.markTools,
  loading: loading.effects['textMark/fetchLabelData'],
}))
class NerMarkView extends Component {
  state = {
    basicInfo: undefined,
    filteredInfo: {},
    pagination: {},
    searchText: '',
    searchedColumn: '',
    dataId: '',
    modalVisible: false,
    word: '',
    startIndex: 0,
    endIndex: 0,
  };

  componentWillMount() {
    const { location } = this.props;
    this.setState({
      basicInfo: location.state.taskInfo,
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'textMark/fetchLabelData',
      payload: { taskId: basicInfo.taskId },
    });
    dispatch({
      type: 'textMark/fetchMarkTool',
      payload: { projectId: basicInfo.projectId },
    });
  }

  handleGobackMyTask = () => {
    router.push({
      pathname: '/person/my-task',
      state: {
        status: 'labeling,reject',
      },
    });
  };

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch } = this.props;
    this.setState({
      filteredInfo: filterArg,
      pagination,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      taskId: this.state.basicInfo.taskId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'textMark/fetchLabelData',
      payload: params,
    });
  };

  handleClickCell = cell => ({
      onClick: event => {
        // eslint-disable-next-line max-len
        const word = window.getSelection ? window.getSelection() : document.selection.createRange().text;
        if (cell.sentence.substring(word.anchorOffset, word.focusOffset).length > 1) {
          this.setState({
            dataId: cell.dataId,
            modalVisible: true,
            word: cell.sentence.substring(word.anchorOffset, word.focusOffset),
            startIndex: word.anchorOffset,
            endIndex: word.focusOffset,
          });
        }
        // console.log(cell.sentence.substring(word.anchorOffset, word.focusOffset));
      },
    });

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

  handleRefreshView = () => {
    const { dispatch } = this.props;
    const { pagination, basicInfo } = this.state;
    const params = {
      taskId: basicInfo.taskId,
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
    };

    dispatch({
      type: 'textMark/fetchLabelData',
      payload: params,
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleCloseTag = (index, dataId) => {
    const { dispatch } = this.props;
    const { basicInfo } = this.state;
    dispatch({
      type: 'textMark/deleteTextMarkResult',
      payload: { taskId: basicInfo.taskId, dataId, index },
      callback: () => {
        this.handleRefreshView();
      },
    });
  };

  render() {
    const { basicInfo, modalVisible, word, startIndex, endIndex, dataId } = this.state;
    const { data, markTools, loading } = this.props;
    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value={taskStatusName[basicInfo.status]} />
        <Statistic title="标注进度" value={basicInfo.schedule} suffix="%" />
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="所属项目">{basicInfo.projectName}</Descriptions.Item>
        <Descriptions.Item label="标注类型">{labelTypeName[basicInfo.labelType]}</Descriptions.Item>
        <Descriptions.Item label="题数">{basicInfo.questionNum}</Descriptions.Item>
        <Descriptions.Item label="领取时间">{basicInfo.receiveTime}</Descriptions.Item>
      </Descriptions>
    );

    const action = (
      <Button type="primary" style={{ marginLeft: '8px' }} onClick={this.handleGobackMyTask}>返回</Button>
    );

    const columns = [
      {
        title: '文本',
        dataIndex: 'sentence',
        onCell: this.handleClickCell,
        ...this.getColumnSearchProps('sentenec'),
      },
      {
        title: '标注结果',
        dataIndex: 'result',
        render: (val, record) => {
          if (val.length) {
            const toolMap = {};
            markTools.forEach(tool => {
              toolMap[tool.toolId] = {
                toolName: tool.toolName,
                options: tool.options,
              };
            });
            const labelValues = val.map(v => (v.hasOwnProperty('wordEntry') ? `${v.word}: ${v.tool.toolName}.${v.wordEntry.wordName}` : `${v.word}: ${v.tool.toolName}`));
            return labelValues.map((value, index) => (<Tag color="blue" closable onClose={() => this.handleCloseTag(index, record.dataId)}>{value}</Tag>));
          }
          return '';
        },
        filters: labelResultFilters,
        filteredValue: filteredInfo.result || null,
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
    ];

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card title="标注数据" bordered={false} extra={<Button type="primary" icon="check">提交</Button>}>
          <StandardTable
            rowKey="sentence"
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <NerModalView visible={modalVisible} word={word} startIndex={startIndex} endIndex={endIndex} onCancel={this.handleCancelModal} onRefresh={this.handleRefreshView} projectId={basicInfo.projectId} taskId={basicInfo.taskId} dataId={dataId} />
      </PageHeaderWrapper>
    );
  }
}

export default NerMarkView;