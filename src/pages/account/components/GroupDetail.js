import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Input, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import Link from 'umi/link';
import { connect } from 'dva';
import StandardTable from './StandardTable';
import styles from './style.less';
import ItemData from './map';

const { RoleName } = ItemData;

@connect(({ groupList, loading }) => ({
  groupList,
}))
class GroupDetail extends Component {
  state = {
    groupId: '',
    groupName: '',
    selectedRows: [],
    searchText: '',
    searchedColumn: '',
  };

  componentDidMount() {
    const { dispatch, location } = this.props;
    dispatch({
      type: 'groupList/fetchUserInfo',
      payload: { groupId: location.state.groupId },
    });
    this.setState({
      groupId: location.state.groupId,
      groupName: location.state.groupName,
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const { groupId } = this.state;
    const params = {
      groupId,
    };

    if (this.state.searchText !== '') {
      params[this.state.searchedColumn] = this.state.searchText;
    }
    dispatch({
      type: 'groupList/fetchUserInfo',
      payload: params,
    });
  };

  handleDelete = (user, groupId) => {
    const { dispatch } = this.props;

    dispatch({
      type: 'groupList/deleteUserInfo',
      payload: { userIds: [user.userId], groupId },
      callback: () => {
        dispatch({
          type: 'groupList/fetchUserInfo',
          payload: { groupId },
        });
      },
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows, groupId } = this.state;
    dispatch({
      type: 'groupList/deleteUserInfo',
      payload: { userIds: selectedRows.map(row => row.userId), groupId },
      callback: () => {
        dispatch({
          type: 'groupList/fetchUserInfo',
          payload: { groupId },
        });
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleGoBack = () => {
    router.push({
      pathname: '/agency/account',
      state: {
        activeTabKey: 'group',
      },
    });
  };

  getColumnSearchProps = dataIndex => ({
    // eslint-disable-next-line no-shadow
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
        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }} >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => (
      <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }} />
    ),
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
    ) : (text)),
  });

  // eslint-disable-next-line no-shadow
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
    const { groupList: { userInfos } } = this.props;
    const { selectedRows, groupId, groupName } = this.state;

    const action = (
      <Button type="primary" onClick={this.handleGoBack}>返回</Button>
    );

    const columns = [
      {
        title: '用户名',
        dataIndex: 'name',
      },
      {
        title: '角色名称',
        dataIndex: 'roleId',
        render: val => RoleName[val],
      },
      {
        title: '操作',
        render: (_, user) => <a onClick={() => this.handleDelete(user, groupId)}>删除</a>,
      },
    ];

    return (
      <PageHeaderWrapper
        title={groupName}
        extra={action}
        className={styles.pageHeader}
      >
        <Card title="成员列表" className={styles.card} bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleBatchDelete}>删除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            data={userInfos}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
      </PageHeaderWrapper>
    );
  }
}

export default GroupDetail;
