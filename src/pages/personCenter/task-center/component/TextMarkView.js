import React, { Component } from 'react';
import { Button, Card, Descriptions, Icon, Input, Statistic, Popover } from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import styles from './style.less';
import ItemData from '../map';
import router from 'umi/router';
import { connect } from 'dva';
import StandardTable from './StandardTable';
import Highlighter from 'react-highlight-words';

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
class TextMarkView extends Component {
  state = {
    basicInfo: undefined,
    filteredInfo: {},
    searchText: '',
    searchedColumn: '',
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
      payload: { taskId: basicInfo.taskId },
    });
  }

  handleGobackMyTask = () => {
    router.push({
      pathname: '/person/my-task',
      state: {
        status: 'labeling',
      },
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
      type: 'textMark/fetchLabelData',
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

  render() {
    const { basicInfo } = this.state;
    const { data, loading } = this.props;
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

    const content = (
      <div>
        <p>Content</p>
        <p>Content</p>
      </div>
    );

    let columns = [];
    if (basicInfo.labelType === 'textClassify') {
      columns = [
        {
          title: '文本',
          dataIndex: 'sentence',
          ...this.getColumnSearchProps('sentence'),
        },
        {
          title: '标注结果',
          dataIndex: 'labelResult',
          render: val => {
            if (val.length) {
              return val.map(item => item.join('，')).join(' | ');
            }
            return <Popover title="标注工具" content={content} placement="top"><a>标注</a></Popover>
          },
          filters: labelResultFilters,
          filteredValue: filteredInfo.labelResult || null,
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
    } else {
      columns = [
        {
          title: '文本1',
          dataIndex: 'sentence1',
          ...this.getColumnSearchProps('sentence1'),
        },
        {
          title: '文本2',
          dataIndex: 'sentence2',
          ...this.getColumnSearchProps('sentence2'),
        },
        {
          title: '标注结果',
          dataIndex: 'labelResult',
          render: val => {
            if (val.length) {
              return val.map(item => item.join('，')).join(' | ');
            }
            return <Popover title="标注工具" content={content} placement="top"><a>标注</a></Popover>
          },
          filters: labelResultFilters,
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
    }

    return (
      <PageHeaderWrapper
        title={basicInfo.taskName}
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card title="标注数据" bordered={false}>
          <StandardTable
            rowKey="sentence"
            loading={loading}
            data={data}
            columns={columns}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TextMarkView;
