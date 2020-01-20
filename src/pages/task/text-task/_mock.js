import { parse } from 'url';

let mockData = [
  {
    taskId: '1',
    taskName: '文本分类_0123',
    taskType: 'textClassify',
    labelerName: '李锦宇',
    labelerId: 'SY0976',
    schedule: 0,
    status: 'initial',
    createdTime: '2020-01-13 10:00:00',
    deadline: '2020-02-20 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '2',
    taskName: '文本匹配_0124',
    taskType: 'textMatch',
    labelerName: '张三',
    labelerId: 'SY0223',
    schedule: 70,
    status: 'labeling',
    createdTime: '2020-01-14 10:00:00',
    deadline: '2020-02-21 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '3',
    taskName: '实体识别_0125',
    taskType: 'ner',
    labelerName: '王五',
    labelerId: 'SY0112',
    schedule: 100,
    status: 'firstTrial',
    createdTime: '2020-01-15 10:00:00',
    deadline: '2020-02-22 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '4',
    taskName: '实体识别_0126',
    taskType: 'ner',
    labelerName: '杨六',
    labelerId: 'SY0113',
    schedule: 100,
    status: 'reject',
    createdTime: '2020-01-16 10:00:00',
    deadline: '2020-02-23 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '5',
    taskName: '文本匹配_0127',
    taskType: 'textMatch',
    labelerName: '王七',
    labelerId: 'SY0114',
    schedule: 100,
    status: 'complete',
    createdTime: '2020-01-17 10:00:00',
    deadline: '2020-02-24 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '6',
    taskName: '文本匹配_0128',
    taskType: 'textMatch',
    labelerName: '杨七',
    labelerId: 'SY0115',
    schedule: 100,
    status: 'review',
    createdTime: '2020-01-18 10:00:00',
    deadline: '2020-02-25 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '7',
    taskName: '文本匹配_0129',
    taskType: 'textMatch',
    labelerName: '顾八',
    labelerId: 'SY0116',
    schedule: 100,
    status: 'deny',
    createdTime: '2020-01-18 10:00:00',
    deadline: '2020-02-25 10:00:00',
    departmentId: 'operation',
  },
];

const detailMockData = [
  {
    taskId: '1',
    taskName: '文本分类_0123',
    taskType: 'textClassify',
    labelerName: '李锦宇',
    labelerId: 'SY0976',
    assessorName: '审核员tom',
    assessorId: 'SY0123',
    acceptorName: '验收员lily',
    acceptorId: 'SY0125',
    markTool: [{ classifyId: 'emotion', classifyName: '情感' }, { classifyId: 'sentenceType', classifyName: '句式' }],
    schedule: 60,
    status: 'initial',
    createdTime: '2020-01-13 10:00:00',
    deadline: '2020-02-20 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '2',
    taskName: '文本匹配_0124',
    taskType: 'textMatch',
    labelerName: '张三',
    labelerId: 'SY0223',
    assessorName: '审核员tony',
    assessorId: 'SY0225',
    acceptorName: '验收员jack',
    acceptorId: 'SY0125',
    markTool: [{ classifyId: 'similarity', classifyName: '相似度' }],
    schedule: 70,
    status: 'labeling',
    createdTime: '2020-01-14 10:00:00',
    deadline: '2020-02-21 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '3',
    taskName: '实体识别_0125',
    taskType: 'ner',
    labelerName: '王五',
    labelerId: 'SY0112',
    assessorName: '审核员grace',
    assessorId: 'SY0226',
    acceptorName: '验收员jim',
    acceptorId: 'SY0127',
    markTool: [{ classifyId: 'singer', classifyName: '歌手' }, { classifyId: 'song', classifyName: '歌曲' }],
    schedule: 100,
    status: 'firstTrial',
    createdTime: '2020-01-15 10:00:00',
    deadline: '2020-02-22 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '4',
    taskName: '实体识别_0126',
    taskType: 'ner',
    labelerName: '杨六',
    labelerId: 'SY0113',
    assessorName: '审核员tim',
    assessorId: 'SY0228',
    acceptorName: '验收员sean',
    acceptorId: 'SY0129',
    markTool: [{ classifyId: 'country', classifyName: '国家' }, { classifyId: 'area', classifyName: '地名' }],
    schedule: 100,
    status: 'reject',
    createdTime: '2020-01-16 10:00:00',
    deadline: '2020-02-23 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '5',
    taskName: '文本匹配_0127',
    taskType: 'textMatch',
    labelerName: '王七',
    labelerId: 'SY0114',
    assessorName: '审核员chaim',
    assessorId: 'SY0229',
    acceptorName: '验收员lei',
    acceptorId: 'SY0130',
    markTool: [{ classifyId: 'similarity', classifyName: '相似度' }],
    schedule: 100,
    status: 'complete',
    createdTime: '2020-01-17 10:00:00',
    deadline: '2020-02-24 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '6',
    taskName: '文本匹配_0128',
    taskType: 'textMatch',
    labelerName: '杨七',
    labelerId: 'SY0115',
    assessorName: '审核员john',
    assessorId: 'SY0230',
    acceptorName: '验收员mike',
    acceptorId: 'SY0131',
    markTool: [{ classifyId: 'similarity', classifyName: '相似度' }],
    schedule: 100,
    status: 'review',
    createdTime: '2020-01-18 10:00:00',
    deadline: '2020-02-25 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '7',
    taskName: '文本匹配_0129',
    taskType: 'textMatch',
    labelerName: '顾八',
    labelerId: 'SY0116',
    assessorName: '审核员kim',
    assessorId: 'SY0231',
    acceptorName: '验收员moke',
    acceptorId: 'SY0132',
    markTool: [{ classifyId: 'similarity', classifyName: '相似度' }],
    schedule: 100,
    status: 'deny',
    createdTime: '2020-01-19 10:00:00',
    deadline: '2020-02-26 10:00:00',
    departmentId: 'operation',
  },
];

const markData = [
  {
    sentenceId: '1',
    sentence: ['出差怎么预定酒店呢'],
    result: [['高兴', '愤怒'], ['疑问句']],
    firstTrial: 'approve',
    review: 'reject',
  },
  {
    sentenceId: '2',
    sentence: ['出差住的酒店是自己订好吗'],
    result: [['高兴', '愤怒'], ['疑问句']],
    firstTrial: 'approve',
    review: 'reject',
  },
  {
    sentenceId: '3',
    sentence: ['自己能够去订酒店吗'],
    result: [['高兴', '愤怒'], ['疑问句']],
    firstTrial: 'approve',
    review: 'reject',
  },
  {
    sentenceId: '4',
    sentence: ['员工自己可以挑选喜欢的酒店订吗'],
    result: [['高兴', '愤怒'], ['疑问句']],
    firstTrial: 'approve',
    review: 'reject',
  },
];


function getTasks(req, res, u) {
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
    });
  }

  if (params.status) {
    const statuses = params.status.split(',');
    let filterDataSource = [];
    statuses.forEach(status => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.status === status));
    });

    dataSource = filterDataSource;
  }

  if (params.taskType) {
    const types = params.taskType.split(',');
    let filterDataSource = [];
    types.forEach(type => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.taskType === type));
    });

    dataSource = filterDataSource;
  }

  // 根据标注员姓名进行筛选
  if (params.labelerName) {
    const labelerNames = params.labelerName.split(',');
    let filterDataSource = [];
    labelerNames.forEach(laberName => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.labelerName === laberName));
    });

    dataSource = filterDataSource;
  }
  // 根据任务名称进行筛选
  if (params.taskName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.taskName.toLowerCase().includes(params.taskName.toLowerCase()));
  }

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const labelers = dataSource.map(item => ({
    labelerName: item.labelerName,
    labelerId: item.labelerId,
  }));

  const result = {
    list: dataSource,
    pagination: {
      total: dataSource.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
    labelers,
  };

  return res.json(result);
}

function deleteTasks(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData = mockData.filter(item => !body.taskIds.includes(item.taskId));
  return res.json({ message: '删除成功', status: 'ok' });
}

function getRoleMembers(req, res) {
  const response = {
    labelers: [{ userId: 'SY0111', userName: '张三' }, { userId: 'SY0112', userName: '王五' }, { userId: 'SY0113', userName: '杨六' }],
    assessors: [{ userId: 'SY0114', userName: '审核员1' }, { userId: 'SY0115', userName: '审核员2' }, { userId: 'SY0116', userName: '审核员3' }],
    acceptors: [{ userId: 'SY0117', userName: '验收员1' }, { userId: 'SY0118', userName: '验收员2' }, { userId: 'SY0119', userName: '验收员3' }],
  };
  return res.json(response);
}

function getMarkTools(req, res) {
  const response = {
    textClassify: [{
      classifyId: 'emotion',
      classifyName: '情感',
    }, {
      classifyId: 'sentenceType',
      classifyName: '句式',
    }],
    textMatch: [{
      classifyId: 'similarity',
      classifyName: '相似度',
    }],
    ner: [{
      classifyId: 'singer',
      classifyName: '歌手',
    }, {
      classifyId: 'country',
      classifyName: '国家',
    }],
  };
  return res.json(response);
}

function createTask(req, res) {
  return res.json({ status: 'ok', message: '创建成功' });
}

function getTaskDetail(req, res) {
  const departmentId = req.get('DepartmentId');

  const { taskId } = req.params;

  // eslint-disable-next-line max-len
  const dataSource = detailMockData.filter(item => item.departmentId === departmentId && item.taskId === taskId);

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
  let dataSource = markData;

  if (params.firstTrial) {
    const results = params.firstTrial.split(',');
    let filterDataSource = [];
    results.forEach(result => {
      // eslint-disable-next-line max-len
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.firstTrial === result));
    });

    dataSource = filterDataSource;
  }

  if (params.review) {
    const results = params.review.split(',');
    let filterDataSource = [];
    results.forEach(result => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.review === result));
    });

    dataSource = filterDataSource;
  }

  if (params.sentence) {
    dataSource = dataSource.filter(item => item.sentence.join('|').toLowerCase().includes(params.sentence.toLowerCase()));
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

export default {
  'GET /api/text-tasks': getTasks,
  'DELETE /api/text-tasks': deleteTasks,
  'GET /api/text-task/members': getRoleMembers,
  'GET /api/text-task/marktools': getMarkTools,
  'POST /api/text-task/create': createTask,
  'GET /api/text-task/detail/:taskId': getTaskDetail,
  'GET /api/text-task/label-data': getLabelData,
};
