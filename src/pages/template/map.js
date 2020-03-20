export default {
  labelTypeName: {
    textClassify: '文本分类',
    sequenceLabeling: '序列标注',
    textExtension: '文本扩充',
    pictureMark: '图片标注',
    voiceMark: '音频标注',
    videoDialogMark: '其他标注-视频对话标注',
  },

  FieldLabels: {
    labelType: '工具类型',
    templateName: '模板名称',
    multiple: '选项多选',
    optionName: '选项名称',
  },

  labelTypes: [
    {
      value: 'textMark',
      label: '文本标注',
      children: [
        {
          value: 'textClassify',
          label: '文本分类',
        },
        {
          value: 'sequenceLabeling',
          label: '序列标注',
        },
        {
          value: 'textExtension',
          label: '文本扩充',
        },
      ],
    },
    {
      value: 'pictureMark',
      label: '图片标注',
    },
    {
      value: 'voiceMark',
      label: '音频标注',
    },
    {
      value: 'otherMark',
      label: '其他标注',
      children: [
        {
          value: 'videoDialogMark',
          label: '视频对话标注',
        },
      ],
    },
  ],
};
