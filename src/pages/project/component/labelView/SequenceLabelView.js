import React, { Component, Fragment } from 'react';
import { Table, Tag } from 'antd';
import ModalView from './ModalView';
import { connect } from 'dva';

@connect()
class SequenceLabelView extends Component {
  state = {
    modalVisible: false,
    word: '',
  };

  handleClickCell = cell => ({
    onClick: event => {
      // eslint-disable-next-line max-len
      const word = window.getSelection ? window.getSelection() : document.selection.createRange().text;
      if (cell.sentence.substring(word.anchorOffset, word.focusOffset).length > 1) {
        this.setState({
          modalVisible: true,
          word: cell.sentence.substring(word.anchorOffset, word.focusOffset),
        });
      }
      // console.log(cell.sentence.substring(word.anchorOffset, word.focusOffset));
    },
  });

  handleCloseTag = index => {
    const { result } = this.props;
    result.splice(index, 1)
  };

  handleCancelModal = () => {
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    const { data, result, markTool } = this.props;
    const { modalVisible, word } = this.state;

    const columns = [
      {
        title: '文本',
        dataIndex: 'sentence',
        onCell: this.handleClickCell,
      },
      {
        title: '标注结果',
        dataIndex: 'labelResult',
        render: () => {
          if (result.length) {
            const labelValues = result.map(v => (v.hasOwnProperty('newWordEntry') ? `${v.word}: ${v.optionName}.${v.newWordEntry}` : `${v.word}: ${v.optionName}`));
            return labelValues.map((value, index) => (<Tag color="blue" closable onClose={() => this.handleCloseTag(index)}>{value}</Tag>));
          }
          return '';
        },
      },
    ];

    return (
      <Fragment>
        <Table
          dataSource={data}
          columns={columns}
          pagination={false}
        />
        <ModalView visible={modalVisible} word={word} result={result} markTool={markTool} onCancel={this.handleCancelModal} />
      </Fragment>

    );
  }
}


export default SequenceLabelView;
