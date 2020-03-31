export default {
  statusMap: {
    initial: 'default',
    inProgress: 'processing',
    suspend: 'warning',
    expired: 'error',
    complete: 'success',
  },

  statusName: {
    initial: '未开始',
    inProgress: '进行中',
    suspend: '暂停中',
    expired: '逾期中',
    complete: '完成',
  },

  taskStatusMap: {
    initial: 'default',
    labeling: 'processing',
    review: 'processing',
    reject: 'warning',
    complete: 'success',
  },

  taskStatusName: {
    initial: '未开始',
    labeling: '标注中',
    review: '质检中',
    reject: '质检未通过',
    complete: '完成',
  },

  labelTypeName: {
    textClassify: '文本分类',
    textMatch: '文本匹配',
    ner: '实体识别',
    textMark: '文本标注',
    pictureMark: '图片标注',
    voiceMark: '音频标注',
    videoDialogMark: '其他标注-视频对话标注',
  },

  projectTypes: [
    {
      value: 'text',
      label: '文本',
    },
    {
      value: 'picture',
      label: '图片',
    },
    {
      value: 'voice',
      label: '音频',
    },
    {
      value: 'video',
      label: '视频',
    },
  ],

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

  labelTypeToValue: {
    textClassify: ['textMark', 'textClassify'],
    sequenceLabeling: ['textMark', 'sequenceLabeling'],
    textExtension: ['textMark', 'textExtension'],
    pictureMark: ['pictureMark'],
    voiceMark: ['voiceMark'],
    videoDialogMark: ['otherMark', 'videoDialogMark'],
  },

  reviewLabel: {
    approve: '通过',
    reject: '拒绝',
    unreview: '未质检',
  },

  FieldLabels: {
    projectName: '项目名称',
    projectType: '项目类型',
    projectPeriod: '项目周期',
    labeler: '标注员',
    inspector: '质检员',
    labelType: '工具类型',
    passRate: '合格率',
    checkRate: '质检率',
    questionNum: '单任务题目数',
    description: '项目描述',
    defaultTool: '复制标注模板',
    templateName: '模板名称',
    optionName: '选项名称',
    classifyName: '类别名称',
    numberRange: '数值范围',
    saveType: '存储方式',
    color: '颜色',
    multiple: '选项多选',
    wordEntry: '词典名称',
    wordEntryName: '所属词条',
    newWordEntry: '新建词条',
  },
}
