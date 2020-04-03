import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { Button, Card, Divider, Icon, Input, Popconfirm, Table, Tag } from 'antd';
import Highlighter from 'react-highlight-words';
import DepCreateView from './component/DepCreateView';
import DepDetailView from './component/DepDetailView';
import styles from './style.less';
import ItemData from './component/map';


const { PrivilegeMap, DepartmentType } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const departmentTypeFilters = DepartmentType.map(d => ({
  text: d.name,
  value: d.id,
}));

@connect(({ departmentList, loading }) => ({
  departmentList,
  loading: loading.models.departmentList,
}))
class DepartmentList extends Component {
  state = {
    modalVisible: false,
    addModalVisible: false,
    departmentInfo: {},
    searchText: '',
    searchedColumn: '',
    filteredInfo: null,
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/fetchDepartment',
      payload: { sorter: 'createdTime_descend' },
    });
  }

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

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  handleDelete = department => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/deleteDepartment',
      payload: { departmentId: department.departmentId },
    });
  };

  handleAdd = () => {
    const { dispatch } = this.props;
    dispatch({
      type: 'departmentList/fetchNoDepAccounts',
    });

    this.setState({
      addModalVisible: true,
    });
  };

  handleModify = department => {
    const { dispatch, departmentList: { data } } = this.props;

    const result = data.filter(item => item.departmentId === department.departmentId);
    this.setState({
      departmentInfo: result[0],
    });

    dispatch({
      type: 'departmentList/fetchNoDepAccounts',
    });

    this.setState({
      modalVisible: true,
    });
  };

  handleCancelAddModal = () => {
    this.setState({
      addModalVisible: false,
    });
  };

  handleTableChange = (pagination, filterArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;
    this.setState({
      filteredInfo: filterArg,
    });

    const filters = Object.keys(filterArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filterArg[key]);
      return newObj;
    }, {});

    const params = {
      ...formValues,
      ...filters,
    };

    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'departmentList/fetchDepartment',
      payload: params,
    });
  };

  render() {
    const { departmentList: { data, accounts }, loading } = this.props;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: '机构名称',
        dataIndex: 'departmentName',
        ...this.getColumnSearchProps('departmentName'),
      },
      {
        title: '机构类型',
        dataIndex: 'departmentType',
        render: val => DepartmentType.filter(d => d.id === val)[0].name,
        filters: departmentTypeFilters,
        filteredValue: filteredInfo.departmentType || null,
      },
      {
        title: '机构权限',
        dataIndex: 'privilege',
        render: val => {
          const names = val.map(item => PrivilegeMap[item]);
          const noRepeat = [];
          names.forEach(name => {
            if (!noRepeat.includes(name)) {
              noRepeat.push(name);
            }
          });
          return noRepeat.map(m => <Tag color="blue">{m}</Tag>)
        },
        ellipsis: true,
      },
      {
        title: '管理员',
        dataIndex: 'administrator',
      },
      {
        title: '用户数目',
        dataIndex: 'userAmount',
        render: (_, department) => (
          <a>{department.userAmount}</a>
        ),
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, department) => (
          <Fragment>
            <a onClick={() => this.handleModify(department)}>编辑</a>
            <Divider type="vertical" />
            <Popconfirm placement="topRight" title="确定删除该机构吗？删除后机构下的所有数据，包括用户，角色，项目等信息将一并删除" okText="确认" cancelText="取消" onConfirm={() => this.handleDelete(department)}>
              <a>删除</a>
            </Popconfirm>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Button className={styles.tableListOperator} icon="plus" type="primary" onClick={this.handleAdd}>新增</Button>
        <Card bordered={false}>
          <Table
            className={styles.standardTable}
            loading={loading}
            dataSource={data}
            pagination={{ showSizeChanger: true, showQuickJumper: true }}
            columns={columns}
            onChange={this.handleTableChange}
          />
        </Card>
        {/* eslint-disable-next-line max-len */}
        <DepDetailView visible={this.state.modalVisible} onCancel={this.handleCancelModal} departmentInfo={this.state.departmentInfo} noDepAccounts={accounts} />
        {/* eslint-disable-next-line max-len */}
        <DepCreateView visible={this.state.addModalVisible} onCancel={this.handleCancelAddModal} noDepAccounts={accounts} />
      </PageHeaderWrapper>
    );
  }
}

export default DepartmentList;
