export default {
  statusMap: {
    initial: 'default',
    labeling: 'processing',
    firstTrial: 'processing',
    review: 'processing',
    reject: 'warning',
    deny: 'warning',
    complete: 'success',
  },

  statusName: {
    initial: '未开始',
    labeling: '标注中',
    firstTrial: '审核中',
    review: '验收中',
    reject: '审核未通过',
    deny: '验收未通过',
    complete: '完成',
  },

  taskTypeName: {
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
    inspector: '审核员',
    acceptor: '验收员',
  },

  ApproveLabel: {
    approve: '通过',
    reject: '拒绝',
    unprocess: '未处理',
  },
}
