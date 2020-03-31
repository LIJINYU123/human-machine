import React, { Component } from 'react';
import { Table, Tag, Popover, Card } from 'antd';
import PopoverView from './PopoverView';


class TextClassifyView extends Component {
  state = {
    popoverVisible: false,
  };

  handleVisibleChange = visible => {
    this.setState({
      popoverVisible: true,
    });
  };

  handleClose = () => {
    this.setState({ popoverVisible: false });
  };

  render() {
    const { popoverVisible } = this.state;
    const { data, result, markTool } = this.props;

    const columns = [
      {
        title: '文本',
        dataIndex: 'sentence',
      },
      {
        title: '标注结果',
        dataIndex: 'labelResult',
        render: (_, info) => {
          if (result.length) {
            return <Popover visible={popoverVisible} onVisibleChange={this.handleVisibleChange} trigger="click" content={<PopoverView markTool={markTool} onClose={this.handleClose} labelValues={result} />} placement="top">{result.map(value => (<Tag color="blue">{value}</Tag>))}</Popover>
          }
          return <Popover visible={popoverVisible} onVisibleChange={this.handleVisibleChange} trigger="click" content={<PopoverView markTool={markTool} onClose={this.handleClose} labelValues={[]} />} placement="top"><a>标注</a></Popover>
        },
      },
    ];

    return (
      <Table
        dataSource={data}
        columns={columns}
        pagination={false}
      />
    );
  }
}

export default TextClassifyView;
