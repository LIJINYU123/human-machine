import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import Highlighter from 'react-highlight-words';
import { Button, Card, Divider, Icon, Input } from 'antd';
import StandardTable from './component/StandardTable';
import TemplateCreateView from './component/TemplateCreateView';
import TemplateDetailView from './component/TemplateDetailView';
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
    templateInfo: {
      templateName: '',
      setting: {},
    },
    modalVisible: false,
    modifyModal: false,
  };

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'templateManage/fetchTemplate',
      payload: { sorter: 'updateTime_descend' },
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
               placeholder="搜索"
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
          payload: { sorter: 'updateTime_descend' },
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
          payload: { sorter: 'updateTime_descend' },
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

  handleModify = template => {
    const { templateManage: { data }, dispatch } = this.props;
    const result = data.filter(item => item.templateId === template.templateId);
    if (result.length && result[0].setting.hasOwnProperty('options')) {
      dispatch({
        type: 'updateTemplate/saveOptions',
        payload: result[0].setting.options,
      });
    }

    this.setState({
      templateInfo: result.length ? result[0] : {},
      modifyModal: true,
    });
  };

  handleCancelModifyModal = () => {
    this.setState({
      modifyModal: false,
    });
  };

  render() {
    const { templateManage: { data }, loading } = this.props;
    const { selectedRows, modalVisible, modifyModal, templateInfo } = this.state;

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
        title: '创建人',
        dataIndex: 'creatorId',
        ...this.getColumnSearchProps('creatorId'),
      },
      {
        title: '描述',
        dataIndex: 'description',
        ellipsis: true,
      },
      {
        title: '更新时间',
        dataIndex: 'updateTime',
        sorter: true,
        defaultSortOrder: 'descend',
      },
      {
        title: '操作',
        render: (_, template) => (
          <Fragment>
            <a onClick={() => this.handleModify(template)}>编辑</a>
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
        <TemplateDetailView visible={modifyModal} onCancel={this.handleCancelModifyModal} templateInfo={templateInfo}/>
      </PageHeaderWrapper>
    );
  }
}

export default TemplateManage;
