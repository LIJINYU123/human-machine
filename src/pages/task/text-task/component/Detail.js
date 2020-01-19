import React, { Component, Fragment } from 'react';
import { GridContent, PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Descriptions, Statistic, Steps, Input, Icon } from 'antd';
import { connect } from 'dva';
import Highlighter from 'react-highlight-words';
import styles from './style.less';

const { Step } = Steps;

const getValue = obj => (obj ? obj.join(',') : []);

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
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
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
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...filters,
    };

    dispatch({
      type: 'textTaskDetail/fetchDetail',
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
    const extra = (
      <div className={styles.moreInfo}>
        <Statistic title="状态" value="待审批" />
        <Statistic title="标注进度" value="60" suffix="%"/>
      </div>
    );

    const description = (
      <Descriptions className={styles.headerList} size="small" column={3}>
        <Descriptions.Item label="任务类型">文本分类</Descriptions.Item>
        <Descriptions.Item label="创建时间">2020-01-20 10:00:00</Descriptions.Item>
        <Descriptions.Item label="截止时间">2020-01-30 10:00:00</Descriptions.Item>
        <Descriptions.Item label="标注员">张三</Descriptions.Item>
        <Descriptions.Item label="审核员">王五</Descriptions.Item>
        <Descriptions.Item label="验收员">杨六</Descriptions.Item>
        <Descriptions.Item label="标注工具">情感，句式，用户行为</Descriptions.Item>
      </Descriptions>
    );

    const stepDesc1 = (
      <div>
        张三
        <div><a>催一下</a></div>
      </div>
    );

    const action = (
      <Fragment>
        <Button>编辑</Button>
        <Button type="primary" style={{ marginLeft: '8px' }}>返回</Button>
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
      },
      {
        title: '审核结果',

      }
    ];

    return (
      <PageHeaderWrapper
        title="任务名称: abcd1234"
        extra={action}
        className={styles.pageHeader}
        content={description}
        extraContent={extra}
      >
        <Card
          title="流程进度"
        >
          <Steps
            progressDot
            current={2}
          >
            <Step title="创建任务"/>
            <Step title="文本标注" description={stepDesc1}/>
            <Step title="标注审核" description="王五"/>
            <Step title="标注验收" description="杨六"/>
            <Step title="完成"/>
          </Steps>
        </Card>
        <Card
          title="标注数据"
        >

        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default TextTaskDetail;
