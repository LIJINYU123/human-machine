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
    textClassify: '标准分类工具',
    sequenceLabeling: '标准序列工具',
    textExtension: '标准扩充工具',
    pictureMark: '标准矩形框工具',
    voiceMark: '标准音频标注工具',
    videoDialogMark: '定制视频标注工具',
  },

  projectTypeName: {
    text: '文本',
    picture: '图片',
    voice: '音频',
    vedio: '视频',
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
    text1: '文本1',
    text2: '文本2',
    extension: '扩写',
    question: '问题',
    reviewResult: '质检结果',
    remark: '备注',
    valid: '数据有效性',
  },

  Labeler: 'labeler',
  Inspector: 'inspector',
}
