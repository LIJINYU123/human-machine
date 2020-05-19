export default {
  statusMap: {
    unPublish: 'default',
    inProgress: 'processing',
    suspend: 'warning',
    complete: 'success',
  },

  statusName: {
    unPublish: '未发布',
    inProgress: '进行中',
    suspend: '暂停中',
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
    textClassify: '标准分类工具',
    sequenceLabeling: '标准序列工具',
    textExtension: '标准扩充工具',
    pictureMark: '标准矩形框工具',
    voiceMark: '标准音频标注工具',
    videoDialogMark: '定制视频标注工具',
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
      value: 'vedio',
      label: '视频',
    },
  ],

  labelTypes: [
    {
      value: 'text',
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
      value: 'picture',
      label: '图片',
      children: [
        {
          value: 'pictureMark',
          label: '标准矩形框工具',
        },
      ],
    },
    {
      value: 'voice',
      label: '音频',
      children: [
        {
          value: 'voiceMark',
          label: '标准音频标注工具',
        },
      ],
    },
    {
      value: 'other',
      label: '其他',
      children: [
        {
          value: 'videoDialogMark',
          label: '定制视频标注工具',
        },
      ],
    },
  ],

  labelTypeToValue: {
    textClassify: ['text', 'textClassify'],
    sequenceLabeling: ['text', 'sequenceLabeling'],
    textExtension: ['text', 'textExtension'],
    pictureMark: ['picture', 'pictureMark'],
    voiceMark: ['voice', 'voiceMark'],
    videoDialogMark: ['other', 'videoDialogMark'],
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
    labelType: '标注工具',
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
