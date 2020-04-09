import React, { Component, Fragment } from 'react';
import router from 'umi/router';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Card, Button, Input, Icon } from 'antd';
import Highlighter from 'react-highlight-words';
import { connect } from 'dva';
import StandardTable from './StandardTable';
import GroupDetailView from './GroupDetailView';
import styles from './style.less';

const getValue = obj => (obj ? obj.join(',') : []);

@connect(({ groupList, loading }) => ({
  groupList,
  loading: loading.effects['groupList/fetchUserInfo'],
}))
class GroupDetail extends Component {
  state = {
    groupId: '',
    groupName: '',
    selectedRows: [],
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
    modalVisible: false,
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

  handleStandardTableChange = (pagination, filterArg, _) => {
    const { dispatch } = this.props;
    const { groupId } = this.state;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      groupId,
      ...filters,
    };

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

  handleAdd = () => {
    const { dispatch, groupList: { userInfos } } = this.props;
    dispatch({
      type: 'groupList/saveTargetKeys',
      payload: userInfos.map(user => user.userId),
    });

    this.setState({
      modalVisible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleRefresh = () => {
    const { dispatch } = this.props;
    const { groupId } = this.state;
    dispatch({
      type: 'groupList/fetchUserInfo',
      payload: { groupId },
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
    const { groupList: { groups, userInfos, roleInfos }, loading } = this.props;
    const { selectedRows, groupId, groupName, modalVisible } = this.state;

    const roleFilters = roleInfos.map(info => ({
      text: info.roleName,
      value: info.roleId,
    }));

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const action = (
      <Button type="primary" onClick={this.handleGoBack}>返回</Button>
    );

    const columns = [
      {
        title: '用户名',
        dataIndex: 'name',
        ...this.getColumnSearchProps('name'),
      },
      {
        title: '角色名称',
        dataIndex: 'roleId',
        render: val => roleInfos.filter(item => item.roleId === val)[0].roleName,
        filters: roleFilters,
        filteredValue: filteredInfo.roleId || null,
      },
      {
        title: '操作',
        render: (_, user) => <a onClick={() => this.handleDelete(user, groupId)}>移除</a>,
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
            <Button icon="plus" type="primary" onClick={this.handleAdd}>添加</Button>
            <Button icon="delete" type="danger" disabled={!selectedRows.length} onClick={this.handleBatchDelete}>移除</Button>
          </div>
          <StandardTable
            selectedRows={selectedRows}
            loading={loading}
            data={userInfos}
            columns={columns}
            onSelectRow={this.handleSelectRows}
            onChange={this.handleStandardTableChange}
          />
        </Card>
        <GroupDetailView visible={modalVisible} inputDisabled onCancel={this.handleCancelModal} onRefresh={this.handleRefresh} groups={groups} currentGroup={{ groupId, groupName }} />
      </PageHeaderWrapper>
    );
  }
}

export default GroupDetail;
