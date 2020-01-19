import { parse } from 'url';

let mockData = [
  {
    taskId: '1',
    taskName: '文本分类_0123',
    taskType: 'textClassify',
    labelerName: '李锦宇',
    labelerId: 'SY0976',
    schedule: 60,
    status: 'initial',
    createdTime: '2020-01-13 10:00:00',
    deadline: '2020-02-20 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '2',
    taskName: '文本分类_0124',
    taskType: 'textMatch',
    labelerName: '张三',
    labelerId: 'SY0111',
    schedule: 70,
    status: 'labeling',
    createdTime: '2020-01-14 10:00:00',
    deadline: '2020-02-21 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '3',
    taskName: '文本分类_0125',
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
    taskName: '文本分类_0126',
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
    taskName: '文本分类_0127',
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
    taskName: '文本分类_0128',
    taskType: 'textMatch',
    labelerName: '杨七',
    labelerId: 'SY0115',
    schedule: 100,
    status: 'review',
    createdTime: '2020-01-18 10:00:00',
    deadline: '2020-02-25 10:00:00',
    departmentId: 'operation',
  },
];

const markData = [
  {
    sentence: ['出差怎么预定酒店呢'],
    result: [{ classifyId: 'neutral', classifyName: '中性' }, { classifyId: 'interrogative', classifyName: '疑问句' }],
    firstTrial: 'accept',
    review: 'reject',
  },
  {
    sentence: ['出差住的酒店是自己订好吗'],
    result: [{ classifyId: 'neutral', classifyName: '中性' }, { classifyId: 'interrogative', classifyName: '疑问句' }],
    firstTrial: 'accept',
    review: 'reject',
  },
  {
    sentence: ['自己能够去订酒店吗'],
    result: [{ classifyId: 'neutral', classifyName: '中性' }, { classifyId: 'interrogative', classifyName: '疑问句' }],
    firstTrial: 'accept',
    review: 'reject',
  },
  {
    sentence: ['员工自己可以挑选喜欢的酒店订吗'],
    result: [{ classifyId: 'neutral', classifyName: '中性' }, { classifyId: 'interrogative', classifyName: '疑问句' }],
    firstTrial: 'accept',
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

  if (params.labelerName) {
    const labelerNames = params.labelerName.split(',');
    let filterDataSource = [];
    labelerNames.forEach(laberName => {
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.labelerName === laberName));
    });

    dataSource = filterDataSource;
  }

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

function getTaskDetail(req, res, u) {
  const departmentId = req.get('DepartmentId');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const { taskId } = req.params;
  const params = parse(url, true).query;

  // eslint-disable-next-line max-len
  const dataSource = mockData.filter(item => item.departmentId === departmentId && item.taskId === taskId);

  const basicInfo = { ...dataSource[0], assessorName: '审核员1', acceptor: '验收员1' };

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  const result = {
    list: markData,
    pagination: {
      total: markData.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
    basicInfo,
  };

  return res.json(result);
}

export default {
  'GET /api/text-tasks': getTasks,
  'DELETE /api/text-tasks': deleteTasks,
  'GET /api/text-task/members': getRoleMembers,
  'GET /api/text-task/marktools': getMarkTools,
  'POST /api/text-task/create': createTask,
  'GET /api/text-task/detail/:taskId': getTaskDetail,
};
