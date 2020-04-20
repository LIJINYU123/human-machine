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
    labeling: '标注中',
    review: '质检中',
    reject: '质检未通过',
  },

  labelTypeName: {
    textClassify: '文本分类',
    textMatch: '文本匹配',
    ner: '实体识别',
    pictureMark: '图片标注',
    voiceMark: '音频标注',
    videoDialogMark: '其他标注-视频对话标注',
  },

  reviewLabel: {
    approve: '通过',
    reject: '拒绝',
    unreview: '未质检',
  },

  labelResult: {
    processed: '已标注',
    unprocessed: '未标注',
  },

  FieldLabels: {
    toolName: '词典名称',
    saveType: '存储方式',
    wordEntryName: '所属词条',
    newWordEntry: '新建词条',
  },

  AnswerModeLabels: {
    text: '文本',
    reviewResult: '质检结果',
    remark: '备注',
  },
}
