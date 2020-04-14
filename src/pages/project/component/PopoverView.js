import React, { Component } from 'react';
import { Descriptions } from 'antd';


class PopoverView extends Component {
  render() {
    const { setting } = this.props;

    return (
      <Descriptions column={2}>
        <Descriptions.Item label="类别名称">{setting.classifyName}</Descriptions.Item>
        { setting.hasOwnProperty('multiple') &&
        <Descriptions.Item label="选项">{ setting.multiple ? '多选' : '单选' }</Descriptions.Item>
        }
        {
          setting.hasOwnProperty('saveType') &&
          <Descriptions.Item label="存储方式">{ setting.saveType === 'nomal' ? '普通' : '词典' }</Descriptions.Item>
        }
        {
          setting.hasOwnProperty('options') &&
          <Descriptions.Item label="类别选项" span={2}>{ setting.options.map(item => item.optionName).join('，') }</Descriptions.Item>
        }
        {
          setting.hasOwnProperty('minValue') &&
          <Descriptions.Item label="最小值">{setting.minValue}</Descriptions.Item>
        }
        {
          setting.hasOwnProperty('maxValue') &&
          <Descriptions.Item label="最大值">{setting.maxValue}</Descriptions.Item>
        }
      </Descriptions>
    );
  }
}

export default PopoverView;
