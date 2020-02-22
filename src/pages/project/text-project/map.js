export default {
  statusMap: {
    initial: 'default',
    inProgress: 'processing',
    complete: 'success',
  },

  statusName: {
    initial: '未开始',
    inProgress: '进行中',
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
  },

  reviewLabel: {
    approve: '通过',
    reject: '拒绝',
    unreview: '未质检',
  },

  FieldLabels: {
    projectName: '项目名称',
    projectPeriod: '项目周期',
    labeler: '标注员',
    assessor: '质检员',
    labelType: '标注类型',
  },
}
