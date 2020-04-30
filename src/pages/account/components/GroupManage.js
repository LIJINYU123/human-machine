import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Button, Card, Divider, Icon, Input, Popconfirm } from 'antd';
import Highlighter from 'react-highlight-words';
import StandardTable from './StandardTable';
import GroupAddView from './GroupAddView';
import GroupDetailView from './GroupDetailView';
import styles from './style.less';
import router from 'umi/router';

@connect(({ groupList, loading }) => ({
  groupList,
  loading: loading.effects['groupList/fetchGroups'],
}))
class GroupManage extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    currentGroup: {},
    selectedRows: [],
    searchText: '',
    searchedColumn: '',
  };


  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupList/fetchGroups',
      payload: { sorter: 'updatedTime_descend' },
    });
    dispatch({
      type: 'groupList/fetchGroupIncludeUnGrouped',
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleAddGroup = () => {
    this.setState({
      addModalVisible: true,
    });
  };

  handleCancelAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handleModify = group => {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupList/saveTargetKeys',
      payload: group.userInfo.map(user => user.userId),
    });

    this.setState({
      currentGroup: group,
      modalVisible: true,
    });
  };

  handleCancelModifyModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleRefresh = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'groupList/fetchGroups',
      payload: { sorter: 'updatedTime_descend' },
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const params = {};

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    if (this.state.searchText !== '') {
      params[this.state.searchedColumn] = this.state.searchText;
    }
    dispatch({
      type: 'groupList/fetchGroups',
      payload: params,
    });
  };

  handleDelete = group => {
    const { dispatch } = this.props;

    dispatch({
      type: 'groupList/deleteGroups',
      payload: { groupIds: [group.groupId] },
      callback: () => {
        dispatch({
          type: 'groupList/fetchGroups',
          payload: { sorter: 'updatedTime_descend' },
        });
      },
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'groupList/deleteGroups',
      payload: { groupIds: selectedRows.map(row => row.groupId) },
      callback: () => {
        dispatch({
          type: 'groupList/fetchGroups',
          payload: { sorter: 'updatedTime_descend' },
        });
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleReviewDetails = group => {
    router.push({
      pathname: '/agency/account/group-detail',
      state: {
        groupId: group.groupId,
        groupName: group.groupName,
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
    const { groupList: { groups, groupIncludeUngroup }, loading } = this.props;
    const { selectedRows, addModalVisible, modalVisible, currentGroup } = this.state;

    const columns = [
      {
        title: '组别名称',
        dataIndex: 'groupName',
        ...this.getColumnSearchProps('groupName'),
      },
      {
        title: '用户数目',
        dataIndex: 'userAmount',
        render: (_, group) => <Button type="link" onClick={() => this.handleReviewDetails(group)}>{group.userInfo.length}</Button>,
      },
      {
        title: '更新时间',
        dataIndex: 'updatedTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, group) => (
         <Fragment>
           <a onClick={() => this.handleModify(group)}>编辑</a>
           <Divider type="vertical" />
           <a onClick={() => this.handleReviewDetails(group)}>详情</a>
           <Divider type="vertical" />
           <Popconfirm title="确认删除吗？" placement="top" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(group)}><a>删除</a></Popconfirm>
         </Fragment>),
      },
    ];

    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleAddGroup}>创建</Button>
            <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleBatchDelete}>删除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={groups}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <GroupAddView visible={addModalVisible} onCancel={this.handleCancelAddModal} groups={groupIncludeUngroup} />
        <GroupDetailView visible={modalVisible} inputDisabled={false} onCancel={this.handleCancelModifyModal} onRefresh={this.handleRefresh} groups={groupIncludeUngroup} currentGroup={currentGroup} />
      </Fragment>
    );
  }
}

export default GroupManage;
