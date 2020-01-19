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
    firstTrial: '审核中',
    review: '验收中',
    reject: '驳回待修改',
    complete: '完成',
  },

  taskTypeMap: {
    textClassify: '文本分类',
    textMatch: '文本匹配',
    ner: '实体识别',
  },

  FieldLabels: {
    taskName: '任务名称',
    taskType: '任务类型',
    markTool: '标注工具',
    deadline: '截止时间',
    labeler: '标注员',
    assessor: '审核员',
    acceptor: '验收员',
  },
}
