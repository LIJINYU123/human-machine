export default {
  statusMap: {
    inProgress: 'processing',
    suspend: 'warning',
    expired: 'error',
    complete: 'success',
  },

  statusName: {
    inProgress: '进行中',
    suspend: '暂停中',
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
    videoNo: '视频编号',
    area: '地区',
    outlet: '网点',
    receptionPerson: '接待人员',
    dialogTime: '对话时间',
    receptionCostTime: '接待时长',
    dialogScene: '对话场景',
    dialogTarget: '对话目的',
    remark: '备注',
    reviewResult: '质检结果',
    sex: '性别',
    age: '年龄',
    appearance: '外表',
    profession: '职业',
    figure: '形象气质',
    entourage: '陪同人员',
    userTag: '用户标签',
    dialogType: '对话类型',
    customerServer: '客服',
    textEmotion: '文本情绪',
    action: '动作',
    tag: '标签',
    receptionEvaluation: '接待评价',
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

  SexOptions: [
    { value: '男', key: 'male' },
    { value: '女', key: 'female' },
  ],

  AppearanceTreeData: [
    {
      title: '面部特征',
      value: '面部特征',
      key: 'face',
      children: [
        {
          title: '发型',
          value: '发型',
          key: 'hairstyle',
          children: [
            {
              title: '长发',
              value: '长发',
              key: 'longhair',
            },
            {
              title: '短发',
              value: '短发',
              key: 'bingle',
            }],
        },
        {
          title: '眼镜',
          value: '眼镜',
          key: 'glass',
          children: [
            {
              title: '近视镜',
              value: '近视镜',
              key: 'myopic',
            },
            {
              title: '太阳镜',
              value: '太阳镜',
              key: 'sunglass',
            },
            {
              title: '无眼镜',
              value: '无眼镜',
              key: 'natural',
            }],
        }],
    },
    {
      title: '身体特征',
      value: '身体特征',
      key: 'body',
      children: [
        {
          title: '体型',
          value: '体型',
          key: 'bodytype',
          children: [
            {
              title: '苗条',
              value: '苗条',
              key: 'hide',
            },
            {
              title: '肥胖',
              value: '肥胖',
              key: 'fat',
            },
            {
              title: '正常',
              value: '正常',
              key: 'normal',
            }],
        },
        {
          title: '穿着',
          value: '穿着',
          key: 'clothes',
          children: [
            {
              title: '普通',
              value: '普通',
              key: 'plain',
            },
            {
              title: '时髦',
              value: '时髦',
              key: 'fashion',
            },
            {
              title: '工装',
              value: '工装',
              key: 'frock',
            }],
        }],
    }],

  EntourageOptions: [
    { value: '孩子', key: 'child' },
    { value: '配偶', key: 'spouse' },
    { value: '朋友', key: 'friend' },
    { value: '长辈', key: 'parent' },
    { value: '无', key: 'none' },
  ],

  ProfessionOptions: [
    { value: '企事业单位人员', key: 'institution' },
    { value: '专业技术人员', key: 'technology' },
    { value: '办事人员', key: 'officer' },
    { value: '服务人员', key: 'server' },
    { value: '农林牧渔业人员', key: 'agriculture' },
    { value: '生产制造人员', key: 'prudctor' },
    { value: '军人', key: 'soldier' },
    { value: '其他从业人员', key: 'other' },
  ],

  Labeler: 'labeler',
  Inspector: 'inspector',

  Labeling: 'labeling',
  Reject: 'reject',
  Review: 'review',
  Complete: 'complete',
}
