export default {
  FieldLabels: {
    departmentId: '机构标识',
    departmentType: '机构类型',
    departmentName: '机构名称',
    administrator: '管理员',
    createdTime: '创建时间',
    privilege: '机构权限',
    dataAddress: '存储地址',
  },

  Privileges: [
    {
      value: 'textMark',
      key: 'textMark',
      title: '文本标注',
      children: [
        {
          value: 'textClassify',
          key: 'textClassify',
          title: '文本分类',
        },
        {
          value: 'sequenceLabeling',
          key: 'sequenceLabeling',
          title: '序列标注',
        },
        {
          value: 'textExtension',
          key: 'textExtension',
          title: '文本扩充',
        },
      ],
    },
    {
      value: 'pictureMark',
      key: 'pictureMark',
      title: '图片标注',
    },
    {
      value: 'voiceMark',
      key: 'voiceMark',
      title: '音频标注',
    },
    {
      value: 'otherMark',
      key: 'otherMark',
      title: '其他标注',
      children: [
        {
          value: 'videoDialogMark',
          key: 'videoDialogMark',
          title: '视频对话标注',
        },
      ],
    },
  ],

  DepartmentType: [
    {
      id: 'operationCenter',
      name: '运营中心',
    },
    {
      id: 'company',
      name: '公司',
    },
  ],

  PrivilegeMap: {
    textClassify: '文本',
    sequenceLabeling: '文本',
    textExtension: '文本',
    pictureMark: '图片',
    voiceMark: '音频',
    videoDialogMark: '其他',
  },
}
