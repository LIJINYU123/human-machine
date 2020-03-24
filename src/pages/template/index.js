import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
import { Button, Card, Divider, Icon, Input } from 'antd';
import StandardTable from './component/StandardTable';
import TemplateCreateView from './component/TemplateCreateView';
import styles from './style.less';
import ItemData from './map';

const { labelTypeName } = ItemData;

const getValue = obj => (obj ? obj.join(',') : []);

const labelTypeFilters = Object.keys(labelTypeName).map(key => ({
  text: labelTypeName[key],
  value: key,
}));

@connect(({ templateManage, loading }) => ({
  templateManage,
  loading: loading.effects['templateManage/fetchTemplate'],
}))
class TemplateManage extends Component {
  state = {
    selectedRows: [],
    filteredInfo: null,
    searchText: '',
    searchedColumn: '',
    modalVisible: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'templateManage/fetchTemplate',
      payload: { sorter: 'createdTime_descend' },
    });
  }

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
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

  handleDelete = templateId => {
    const { dispatch } = this.props;
    dispatch({
      type: 'templateManage/deleteTemplate',
      payload: {
        templateIds: [templateId],
      },
      callback: () => {
        dispatch({
          type: 'templateManage/fetchTemplate',
          payload: { sorter: 'createdTime_descend' },
        });
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleBatchDelete = () => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    dispatch({
      type: 'templateManage/deleteTemplate',
      payload: {
        templateIds: selectedRows.map(row => row.templateId),
      },
      callback: () => {
        dispatch({
          type: 'templateManage/fetchTemplate',
          payload: { sorter: 'createdTime_descend' },
        });
        this.setState({
          selectedRows: [],
        });
      },
    });
  };

  handleStandardTableChange = (pagination, filterArg, sorter) => {
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
      type: 'templateManage/fetchTemplate',
      payload: params,
    });
  };

  handleCreateTemplate = () => {
    this.setState({
      modalVisible: true,
    });
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { templateManage: { data }, loading } = this.props;
    const { selectedRows, modalVisible } = this.state;

    let { filteredInfo } = this.state;
    filteredInfo = filteredInfo || {};

    const columns = [
      {
        title: '模板名称',
        dataIndex: 'templateName',
        ...this.getColumnSearchProps('templateName'),
      },
      {
        title: '工具类型',
        dataIndex: 'labelType',
        render: val => labelTypeName[val],
        filters: labelTypeFilters,
        filteredValue: filteredInfo.labelType || null,
      },
      {
        title: '描述',
        dataIndex: 'description',
        ellipsis: true,
      },
      {
        title: '创建时间',
        dataIndex: 'createdTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, template) => (
          <Fragment>
            <a>编辑</a>
            <Divider type="vertical" />
            <a onClick={() => this.handleDelete(template.templateId)}>删除</a>
          </Fragment>
        ),
      },
    ];

    return (
      <PageHeaderWrapper>
        <Card bordered={false}>
          <div className={styles.tableListOperator}>
            <Button icon="plus" type="primary" onClick={this.handleCreateTemplate}>创建</Button>
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
        <TemplateCreateView visible={modalVisible} onCancel={this.handleCancelModal} />
      </PageHeaderWrapper>
    );
  }
}

export default TemplateManage;
