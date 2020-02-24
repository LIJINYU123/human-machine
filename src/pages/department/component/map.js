export default {
  FieldLabels: {
    departmentId: '机构标识',
    departmentName: '机构名称',
    administrator: '管理员',
    createdTime: '创建时间',
    privilege: '机构权限',
  },

  Privileges: [
    {
      name: '文本分类',
      id: 'textClassify',
    },
    {
      name: '文本匹配',
      id: 'textMatch',
    },
    {
      name: '实体识别',
      id: 'ner',
    },
    {
      name: '图片标注',
      id: 'pictureMark',
    },
    {
      name: '音频标注',
      id: 'voiceMark',
    },
    {
      name: '其他标注-视频对话标注',
      id: 'videoDialogMark',
    },
  ],

  PrivilegeMap: {
    textClassify: '文本分类',
    textMatch: '文本匹配',
    ner: '实体识别',
    pictureMark: '图片标注',
    voiceMark: '音频标注',
    videoDialogMark: '其他标注-视频对话标注',
  },
}
