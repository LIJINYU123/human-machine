import React, { useState, useEffect } from 'react';
import { Tag, Input, Icon } from 'antd';


const EditableGroupTag = props => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(props.value);

  const { disabled = false } = props;

  let inputRef = React.createRef();

  useEffect(() => {
    if (inputVisible === true) {
      inputRef.focus();
    }
    setTags(props.value);
  }, [inputVisible, props.value]);


  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    const { form: { setFieldsValue }, fieldName } = props;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      setInputValue('');
      setInputVisible(false);

      const temp = {};
      temp[`${fieldName}`] = [...tags, inputValue];
      setFieldsValue(temp);
    }
  };

  const handleClose = removedTag => {
    const { form: { setFieldsValue }, fieldName } = props;

    const temp = {};
    temp[`${fieldName}`] = tags.filter(tag => tag !== removedTag);
    setFieldsValue(temp);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const saveInputRef = input => {
    inputRef = input
  };

  const colorGroups = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  return (
    <div>
      {
        // eslint-disable-next-line max-len
        tags.map((tag, index) => <Tag key={tag} closable={!disabled} color={colorGroups[index % colorGroups.length]}
                                      onClose={() => handleClose(tag)}>{tag}</Tag>)
      }
      {!disabled && inputVisible && (
        <Input ref={saveInputRef} type="text" size="small" style={{ width: 78 }}
               value={inputValue} onChange={handleInputChange}
               onBlur={handleInputConfirm}
               onPressEnter={handleInputConfirm}/>
      )}
      {
        !disabled && !inputVisible && (<Tag onClick={showInput} style={{
          background: '#fff',
          borderStyle: 'dashed',
        }}><Icon type="plus"/>新标签</Tag>)
      }
    </div>
  );
};

export default EditableGroupTag;
