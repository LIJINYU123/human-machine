export default {
  labelTypeName: {
    textClassify: '标准分类工具',
    sequenceLabeling: '标准序列工具',
    textExtension: '标准扩充工具',
    pictureMark: '标准矩形框工具',
    voiceMark: '标准音频标注工具',
    videoDialogMark: '定制视频标注工具',
  },

  typeName: {
    text: '文本',
    picture: '图片',
    voice: '音频',
    vedio: '视频',
  },

  FieldLabels: {
    labelType: '标注工具',
    templateName: '模板名称',
    description: '模板描述',
    classifyName: '类别名称',
    numberRange: '数值范围',
    multiple: '选项多选',
    optionName: '选项名称',
    saveType: '存储方式',
  },

  labelTypes: [
    {
      value: '文本',
      label: '文本',
      children: [
        {
          value: 'textClassify',
          label: '标准分类工具',
        },
        {
          value: 'sequenceLabeling',
          label: '标准序列工具',
        },
        {
          value: 'textExtension',
          label: '标准扩充工具',
        },
      ],
    },
    {
      value: '图片',
      label: '图片',
      children: [
        {
          value: 'pictureMark',
          label: '标准矩形框工具',
        },
      ],
    },
    {
      value: '音频',
      label: '音频',
      children: [
        {
          value: 'voiceMark',
          label: '标准音频标注工具',
        },
      ],
    },
    {
      value: '视频',
      label: '视频',
      children: [
        {
          value: 'videoDialogMark',
          label: '定制视频标注工具',
        },
      ],
    },
  ],
};
