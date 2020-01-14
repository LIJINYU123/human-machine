export default {
  statusMap: {
    initial: 'default',
    labeling: 'processing',
    firstTrial: 'processing',
    review: 'processing',
    reject: 'warning',
    complete: 'success',
  },

  statusName: {
    initial: '未开始',
    labeling: '标注中',
    firstTrial: '初审中',
    review: '复审中',
    reject: '驳回待修改',
    complete: '完成',
  },

  taskName: {
    textClassify: '文本分类',
    textMatch: '文本匹配',
    ner: '实体识别',
  },
}
