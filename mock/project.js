import { parse } from 'url';

let mockData = [
  {
    projectId: '1',
    projectName: '文本分类_0123',
    labelType: 'textClassify',
    schedule: 0,
    status: 'initial',
    createdTime: '2020-01-13 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '2',
    projectName: '文本匹配_0124',
    labelType: 'textMatch',
    schedule: 0,
    status: 'initial',
    createdTime: '2020-01-14 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '3',
    projectName: '实体识别_0125',
    labelType: 'ner',
    schedule: 80,
    status: 'inProgress',
    createdTime: '2020-01-15 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '4',
    projectName: '文本匹配_0127',
    labelType: 'textMatch',
    schedule: 100,
    status: 'complete',
    createdTime: '2020-01-17 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '5',
    projectName: '文本匹配_0128',
    labelType: 'textMatch',
    schedule: 60,
    status: 'suspend',
    createdTime: '2020-01-18 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '6',
    projectName: '文本匹配_0129',
    labelType: 'textMatch',
    schedule: 70,
    status: 'expired',
    createdTime: '2020-01-18 10:00:00',
    departmentId: 'operation',
  },
];

const projectDetailMockData = [
  {
    projectId: '1',
    projectName: '文本分类_0123',
    labelType: 'textClassify',
    labelers: [{ name: '李锦宇', id: 'SY0976' }, { name: '张三', id: 'SY0123' }, { name: '王五', id: 'SY0112' }],
    inspectors: [{ name: '质检员1', id: 'SY0124' }, { name: '质检员2', id: 'SY0125' }, { name: '质检员3', id: 'SY0126' }],
    markTool: [{ toolId: 'emotion', toolName: '情感' }],
    schedule: 0,
    status: 'initial',
    passRate: 90,
    checkRate: 10,
    description: '该项目是关于用户行为的分类标注',
    createdTime: '2020-01-13 10:00:00',
    startTime: '2020-02-18 10:00:00',
    endTime: '2020-02-19 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '2',
    projectName: '文本匹配_0124',
    labelType: 'textMatch',
    labelers: [{ name: '李锦宇', id: 'SY0976' }, { name: '张三', id: 'SY0123' }],
    inspectors: [{ name: '质检员4', id: 'SY0127' }, { name: '质检员5', id: 'SY0128' }, { name: '质检员6', id: 'SY0129' }],
    markTool: [{ toolId: 'similarity', toolName: '相似度' }],
    schedule: 0,
    status: 'initial',
    passRate: 95,
    checkRate: 15,
    description: '该项目是关于用户行为的分类标注',
    createdTime: '2020-01-14 10:00:00',
    startTime: '2020-02-19 10:00:00',
    endTime: '2020-02-20 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '3',
    projectName: '实体识别_0125',
    labelType: 'ner',
    labelers: [{ name: '张三', id: 'SY0123' }],
    inspectors: [{ name: '质检员7', id: 'SY0130' }, { name: '质检员8', id: 'SY0131' }, { name: '质检员9', id: 'SY0132' }],
    markTool: [{ toolId: 'singer', toolName: '歌手' }, { toolId: 'song', toolName: '歌曲' }],
    schedule: 80,
    status: 'inProgress',
    passRate: 98,
    checkRate: 10,
    description: '该项目是关于用户行为的分类标注',
    createdTime: '2020-01-15 10:00:00',
    startTime: '2020-02-20 10:00:00',
    endTime: '2020-02-21 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '4',
    projectName: '文本匹配_0127',
    labelType: 'textMatch',
    labelers: [{ name: '张六', id: 'SY0129' }],
    inspectors: [{ name: '质检员10', id: 'SY0133' }, { name: '质检员11', id: 'SY0134' }, { name: '质检员12', id: 'SY0135' }],
    markTool: [{ toolId: 'country', toolName: '国家' }, { toolId: 'area', toolName: '地名' }],
    schedule: 100,
    status: 'complete',
    passRate: 90,
    checkRate: 10,
    description: '该项目是关于用户行为的分类标注',
    createdTime: '2020-01-16 10:00:00',
    startTime: '2020-02-21 10:00:00',
    endTime: '2020-02-22 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '5',
    projectName: '文本匹配_0128',
    labelType: 'textMatch',
    labelers: [{ name: '张六', id: 'SY0129' }],
    inspectors: [{ name: '质检员10', id: 'SY0133' }, { name: '质检员11', id: 'SY0134' }, { name: '质检员12', id: 'SY0135' }],
    markTool: [{ toolId: 'country', toolName: '国家' }, { toolId: 'area', toolName: '地名' }],
    schedule: 60,
    status: 'suspend',
    passRate: 95,
    checkRate: 10,
    description: '该项目是关于用户行为的分类标注',
    createdTime: '2020-01-16 10:00:00',
    startTime: '2020-02-21 10:00:00',
    endTime: '2020-02-22 10:00:00',
    departmentId: 'operation',
  },
  {
    projectId: '6',
    projectName: '文本匹配_0129',
    labelType: 'textMatch',
    labelers: [{ name: '张六', id: 'SY0129' }],
    inspectors: [{ name: '质检员10', id: 'SY0133' }, { name: '质检员11', id: 'SY0134' }, { name: '质检员12', id: 'SY0135' }],
    markTool: [{ toolId: 'country', toolName: '国家' }, { toolId: 'area', toolName: '地名' }],
    schedule: 70,
    status: 'expired',
    passRate: 90,
    checkRate: 15,
    description: '该项目是关于用户行为的分类标注',
    createdTime: '2020-01-16 10:00:00',
    startTime: '2020-02-21 10:00:00',
    endTime: '2020-02-22 10:00:00',
    departmentId: 'operation',
  },
];

let taskMockData = [
  {
    projectId: '1',
    taskId: '1',
    taskName: '任务1',
    labelerName: '',
    labelerId: '',
    inspectorName: '',
    inspectorId: '',
    schedule: 0,
    status: 'initial',
  },
  {
    projectId: '1',
    taskId: '2',
    taskName: '任务2',
    labelerName: '张三',
    labelerId: 'SY0123',
    inspectorName: '',
    inspectorId: '',
    schedule: 40,
    status: 'labeling',
  },
  {
    projectId: '1',
    taskId: '3',
    taskName: '任务3',
    labelerName: '王五',
    labelerId: 'SY0112',
    inspectorName: '质检员1',
    inspectorId: 'SY0124',
    schedule: 100,
    status: 'review',
  },
  {
    projectId: '1',
    taskId: '4',
    taskName: '任务4',
    labelerName: '杨六',
    labelerId: 'SY0113',
    inspectorName: '质检员2',
    inspectorId: 'SY0125',
    schedule: 100,
    status: 'reject',
  },
  {
    projectId: '1',
    taskId: '5',
    taskName: '任务5',
    labelerName: '杨六',
    labelerId: 'SY0113',
    inspectorName: '质检员2',
    inspectorId: 'SY0125',
    schedule: 100,
    status: 'complete',
  },
];

const taskDetailMockData = [
  {
    taskId: '1',
    taskName: '任务1',
    labelerName: '',
    labelerId: '',
    inspectorName: '',
    inspectorId: '',
    schedule: 0,
    status: 'initial',
  },
  {
    taskId: '2',
    taskName: '任务2',
    labelerName: '张三',
    labelerId: 'SY0123',
    inspectorName: '',
    inspectorId: '',
    schedule: 40,
    status: 'labeling',
  },
  {
    taskId: '3',
    taskName: '任务3',
    labelerName: '王五',
    labelerId: 'SY0112',
    inspectorName: '质检员1',
    inspectorId: 'SY0124',
    schedule: 100,
    status: 'review',
  },
  {
    taskId: '4',
    taskName: '任务4',
    labelerName: '杨六',
    labelerId: 'SY0113',
    inspectorName: '质检员2',
    inspectorId: 'SY0125',
    schedule: 100,
    status: 'reject',
  },
];

let labelMockData = [
  {
    dataId: '1',
    data: { sentence: '出差怎么预定酒店呢' },
    labelResult: [['高兴', '愤怒'], ['疑问句']],
    reviewResult: 'approve',
    remark: '这是条评论1',
  },
  {
    dataId: '2',
    data: { sentence: '出差住的酒店是自己订好吗' },
    labelResult: [['高兴', '愤怒'], ['疑问句']],
    reviewResult: 'approve',
    remark: '这是条评论2',
  },
  {
    dataId: '3',
    data: { sentence: '自己能够去订酒店吗' },
    labelResult: [],
    reviewResult: 'reject',
    remark: '这是条评论3',
  },
  {
    dataId: '4',
    data: { sentence: '员工自己可以挑选喜欢的酒店订吗' },
    labelResult: [['高兴', '愤怒'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '5',
    data: { sentence: '自己是不是可以随便订酒店' },
    labelResult: [['中性'], ['肯定陈述句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '6',
    data: { sentence: '为公司出差住宿可以给多少预算' },
    labelResult: [['高兴'], ['肯定陈述句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '7',
    data: { sentence: '出差的话可以住几星级的酒店' },
    labelResult: [['高兴', '喜欢'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '8',
    data: { sentence: '协议酒店可以不住吗' },
    labelResult: [['中性'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '9',
    data: { sentence: '协议酒店不住会出事吗' },
    labelResult: [['喜欢'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '10',
    data: { sentence: '在国内出差住400一晚的酒店可以吗' },
    labelResult: [['喜欢'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '11',
    data: { sentence: '在国内出差能够住几星级的酒店' },
    labelResult: [['喜欢'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '12',
    data: { sentence: '在国内出差的话住宿有没有一个标准' },
    labelResult: [['喜欢'], ['疑问句']],
    reviewResult: 'unreview',
    remark: '',
  },
];

const markToolsMockData = [
  {
    labelType: 'textClassify',
    toolId: 'emotion',
    toolName: '情感',
  },
  {
    labelType: 'textClassify',
    toolId: 'sentenceType',
    toolName: '句式',
  },
  {
    labelType: 'textMatch',
    toolId: 'similarity',
    toolName: '相似度',
  },
  {
    labelType: 'ner',
    toolId: 'singer',
    toolName: '歌手',
  },
  {
    labelType: 'ner',
    toolId: 'country',
    toolName: '国家',
  },
  {
    labelType: 'ner',
    toolId: 'location',
    toolName: '地名',
  },
];

function getProjects(req, res, u) {
  const departmentId = req.get('DepartmentId');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;
  let dataSource = mockData.filter(item => item.departmentId === departmentId);
  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return next[s[0]] - prev[s[0]];
      }

      return prev[s[0]] - next[s[0]];
    })
  }

  if (params.status) {
    const statuses = params.status.split(',');
    let filterDataSource = [];
    statuses.forEach(status => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.status === status));
    });

    dataSource = filterDataSource;
  }

  if (params.labelType) {
    const types = params.labelType.split(',');
    let filterDataSource = [];
    types.forEach(type => {
      // eslint-disable-next-line max-len
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.labelType === type));
    });

    dataSource = filterDataSource;
  }

  if (params.projectName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.projectName.toLowerCase().includes(params.projectName.toLowerCase()));
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  return res.json(result);
}

function deleteProjects(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData = mockData.filter(item => !body.projectIds.includes(item.projectId));
  return res.json({ message: '删除成功', status: 'ok' });
}

function getProjectDetail(req, res) {
  const departmentId = req.get('DepartmentId');

  const { projectId } = req.params;
  // eslint-disable-next-line max-len
  const dataSource = projectDetailMockData.filter(item => item.departmentId === departmentId && item.projectId === projectId);

  const basicInfo = dataSource[0];
  return res.json(basicInfo);
}

function getTaskData(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = parse(url, true).query;
  let dataSource = taskMockData;
  if (params.status) {
    const statuses = params.status.split(',');
    let filterDataSource = [];
    statuses.forEach(status => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.status === status));
    });

    dataSource = filterDataSource;
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  res.json(result);
}

function deleteTaskData(req, res, u, b) {
  const body = (b && b.body) || req.body;
  taskMockData = taskMockData.filter(item => !body.taskIds.includes(item.taskId));
  return res.json({ message: '删除成功', status: 'ok' });
}

function getTaskDetail(req, res) {
  const { taskId } = req.params;
  const dataSource = taskDetailMockData.filter(item => item.taskId === taskId);

  const basicInfo = dataSource[0];
  return res.json(basicInfo);
}

function getLabelData(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = parse(url, true).query;
  let dataSource = labelMockData;

  if (params.reviewResult) {
    const results = params.reviewResult.split(',');
    let filterDataSource = [];
    results.forEach(result => {
      // eslint-disable-next-line max-len
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.reviewResult === result));
    });

    dataSource = filterDataSource;
  }

  if (params.labelResult) {
    const labelResult = params.labelResult.split(',');
    if (labelResult.length === 1 && labelResult[0] === 'processed') {
      dataSource = dataSource.filter(item => item.labelResult.length > 0);
    } else if (labelResult.length === 1 && labelResult[0] === 'unprocessed') {
      dataSource = dataSource.filter(item => item.labelResult.length === 0);
    }
  }

  if (params.sentence) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.sentence.toLowerCase().includes(params.sentence.toLowerCase()));
  }

  if (params.sentence1) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.sentence1.toLowerCase().includes(params.sentence1.toLowerCase()));
  }

  if (params.sentence2) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.sentence2.toLowerCase().includes(params.sentence2.toLowerCase()));
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
  };

  res.json(result);
}

function deleteLabelData(req, res, u, b) {
  const body = (b && b.body) || req.body;
  labelMockData = labelMockData.filter(item => !body.dataIds.includes(item.dataId));
  return res.json({ message: '删除成功', status: 'ok' });
}

function getMarkTools(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  let dataSource = markToolsMockData;
  const params = parse(url, true).query;
  if (params.labelType) {
    dataSource = markToolsMockData.filter(item => item.labelType === params.labelType)
  } else {
    dataSource = [];
  }

  return res.json(dataSource);
}

function getRoleMembers(req, res) {
  const response = {
    labelers: [{ userId: 'SY0111', userName: '张三' }, { userId: 'SY0112', userName: '王五' }, { userId: 'SY0113', userName: '杨六' }, { userId: 'SY0114', userName: '杨九' }],
    inspectors: [{ userId: 'SY0114', userName: '审核员1' }, { userId: 'SY0115', userName: '审核员2' }, { userId: 'SY0116', userName: '审核员3' }],
  };
  return res.json(response);
}

function downloadTemplate(req, res) {
  res.sendFile('/Users/mac/Documents/work/prj/react/human-machine/src/pages/project/template.xlsx');
}

function createProject(req, res) {
  return res.json({ status: 'ok', message: '创建成功' });
}

export default {
  'GET /api/projects': getProjects,
  'DELETE /api/projects': deleteProjects,
  'GET /api/project/detail/:projectId': getProjectDetail,
  'GET /api/project/task-data': getTaskData,
  'DELETE /api/project/task-data': deleteTaskData,
  'GET /api/project/members': getRoleMembers,
  'POST /api/text-project/create': createProject,
  'GET /api/text-project/task-detail/:taskId': getTaskDetail,
  'GET /api/text-project/label-data': getLabelData,
  'DELETE /api/text-project/label-data': deleteLabelData,
  'GET /api/text-project/marktools': getMarkTools,
  'POST /api/text-project/download-template': downloadTemplate,
};
