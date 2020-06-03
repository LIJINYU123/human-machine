import React, { useState, useEffect } from 'react';
import { Tag, Input, Icon } from 'antd';


const EditableGroupTag = props => {
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [tags, setTags] = useState(props.value);

  let inputRef = React.createRef();

  useEffect(() => {
    if (inputVisible === true) {
      inputRef.focus();
    }
  }, [inputVisible]);


  const handleInputChange = e => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    const { form: { setFieldsValue }, fieldName } = props;

    if (inputValue && tags.indexOf(inputValue) === -1) {
      setTags([...tags, inputValue]);
      setInputValue('');
      setInputVisible(false);
    }

    const temp = {};
    temp[`${fieldName}`] = [...tags, inputValue];
    setFieldsValue(temp);
  };

  const handleClose = removedTag => {
    const { form: { setFieldsValue }, fieldName } = props;
    setTags(tags.filter(tag => tag !== removedTag));

    const temp = {};
    temp[`${fieldName}`] = tags;
    setFieldsValue(temp);
  };

  const showInput = () => {
    setInputVisible(true);
  };

  const saveInputRef = input => {
    inputRef = input
  };

  const colorGroups = ['magenta', 'red', 'volcano', 'orange', 'gold', 'lime', 'green', 'cyan', 'blue', 'geekblue', 'purple'];
  // message.info(colorGroups.length);
  return (
    <div>
      {
        // eslint-disable-next-line max-len
        tags.map((tag, index) => <Tag key={tag} closable color={colorGroups[index % colorGroups.length]}
                                      onClose={() => handleClose(tag)}>{tag}</Tag>)
      }
      {inputVisible && (
        <Input ref={saveInputRef} type="text" size="small" style={{ width: 78 }}
               value={inputValue} onChange={handleInputChange}
               onBlur={handleInputConfirm}
               onPressEnter={handleInputConfirm}/>
      )}
      {
        !inputVisible && (<Tag onClick={showInput} style={{
          background: '#fff',
          borderStyle: 'dashed',
        }}><Icon type="plus"/>新标签</Tag>)
      }
    </div>
  );
};

export default EditableGroupTag;
