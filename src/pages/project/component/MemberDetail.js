import React, { Component } from 'react';
import { Button, Card, Icon, Input, Table } from 'antd';
import { connect } from 'dva';
import Highlighter from 'react-highlight-words';

const getValue = obj => (obj ? obj.join(',') : []);


@connect(({ memberDetail, loading }) => ({
  memberDetail,
  loading: loading.effects['memberDetail/fetchMemberData'],
}))
class MemberDetail extends Component {
  state = {
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
  };

  componentDidMount() {
    const { dispatch, projectId } = this.props;

    dispatch({
      type: 'memberDetail/fetchMemberData',
      payload: { projectId },
    });
  }

  handleTableChange = (pagination, filterArg, _) => {
    const { dispatch, projectId } = this.props;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      projectId,
      ...filters,
    };

    dispatch({
      type: 'memberDetail/fetchMemberData',
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
    const { memberDetail: { members }, onChange, loading } = this.props;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const roleFilters = members.reduce((obj, member) => {
      const newObj = [...obj];
      const roleNames = newObj.map(item => item.text);
      if (!roleNames.includes(member.roleName)) {
        newObj.push({ value: member.roleId, text: member.roleName })
      }
      return newObj;
    }, []);

    const columns = [
      {
        title: '用户名',
        dataIndex: 'userName',
        ...this.getColumnSearchProps('userName'),
      },
      {
        title: '角色名称',
        dataIndex: 'roleId',
        render: (_, record) => record.roleName,
        filters: roleFilters,
        filteredValue: filteredInfo.roleId || null,
      },
      {
        title: '领取任务数',
        dataIndex: 'receiveNum',
      },
      {
        title: '标注任务详情',
        render: (_, record) => <a onClick={() => { onChange(record) }}>任务列表</a>,
      },
    ];


    return (
      <Card bordered={false}>
        <Table
          rowKey="userId"
          columns={columns}
          dataSource={members}
          onChange={this.handleTableChange}
          pagination={{ showSizeChanger: true, showQuickJumper: true }}
          loading={loading}
        />
      </Card>
    );
  }
}

export default MemberDetail;
