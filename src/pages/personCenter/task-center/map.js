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

  labelTypeName: {
    textClassify: '文本分类',
    textMatch: '文本匹配',
    ner: '实体识别',
    pictureMark: '图片标注',
    voiceMark: '音频标注',
    videoDialogMark: '其他标注-视频对话标注',
  },
}
