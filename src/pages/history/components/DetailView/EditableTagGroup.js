import React, { Component } from 'react';
import { Tag, Input, Icon } from 'antd';


export default class EditableGroupTag extends Component {
  state = {
    inputVisible: false,
    inputValue: '',
    tags: [],
  };

  componentWillReceiveProps(nextProps, _) {
    const { mytags } = nextProps;
    this.setState({
      tags: mytags,
    });
  }

  handleInputChange = e => {
    this.setState({ inputValue: e.target.value });
  };

  handleInputConfirm = () => {
    const { inputValue } = this.state;
    const { setFieldsValue } = this.props.form;
    let { tags } = this.state;
    if (inputValue && tags.indexOf(inputValue) === -1) {
      tags = [...tags, inputValue];
    }

    setFieldsValue({
      customize: tags,
    });

    this.setState({
      tags,
      inputValue: '',
      inputVisible: false,
    });
  };

  handleClose = removedTag => {
    const { setFieldsValue } = this.props.form;
    const { tags } = this.state;
    const newTags = tags.filter(tag => tag !== removedTag);
    this.setState({ tags: newTags });
    setFieldsValue({
      customize: tags,
    });
  };

  showInput = () => this.setState({ inputVisible: true }, () => this.input.focus());

  saveInputRef = input => { this.input = input };

  render() {
    const { inputValue, inputVisible, tags } = this.state;
    const colorGroups = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
    return (
      <div>
        {
          // eslint-disable-next-line max-len
          tags.map((tag, index) => <Tag key={tag} closable color={index > colorGroups.length - 1 ? colorGroups[index - colorGroups.length] : colorGroups[index]}
                                        onClose={() => this.handleClose(tag)}>{tag}</Tag>)
        }
        {inputVisible && (
          <Input ref={this.saveInputRef} type="text" size="small" style={{ width: 78 }}
                 value={inputValue} onChange={this.handleInputChange}
                 onBlur={this.handleInputConfirm}
                 onPressEnter={this.handleInputConfirm}/>
        )}
        {
          !inputVisible && (<Tag onClick={this.showInput} style={{
            background: '#fff',
            borderStyle: 'dashed',
          }}><Icon type="plus"/>新标签</Tag>)
        }
      </div>
    );
  }
}
