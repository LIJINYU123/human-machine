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
          children: [
            {
              value: 'sentenceSplit',
              label: '句子切分',
            },
            {
              value: 'readingComprehension',
              label: '阅读理解',
            },
            {
              value: 'ner',
              label: '实体识别',
            },
          ],
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

  reviewLabel: {
    approve: '通过',
    reject: '拒绝',
    unreview: '未质检',
  },

  FieldLabels: {
    projectName: '项目名称',
    projectPeriod: '项目周期',
    labeler: '标注员',
    inspector: '质检员',
    labelType: '标注类型',
    passRate: '合格率',
    checkRate: '质检率',
    questionNum: '单任务题目数',
    description: '项目描述',
    defaultTool: '复制默认模板',
    templateName: '模板名称',
    classifyName: '类别名称',
    classifyId: '选项标识',
    color: '颜色',
    multiple: '支持多选',
  },
}
