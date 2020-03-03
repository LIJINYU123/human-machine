import { parse } from 'url';
import moment from 'moment';

const projectMockData = [
  {
    projectId: '1',
    projectName: '文本分类_0123',
    labelType: 'textClassify',
    status: 'initial',
    availableNum: 4,
    createdTime: '2020-01-13 10:00:00',
  },
  {
    projectId: '2',
    projectName: '文本匹配_0124',
    labelType: 'textMatch',
    status: 'initial',
    availableNum: 3,
    createdTime: '2020-01-14 10:00:00',
  },
  {
    projectId: '3',
    projectName: '实体识别_0125',
    labelType: 'ner',
    status: 'inProgress',
    availableNum: 0,
    createdTime: '2020-01-15 10:00:00',
  },
  {
    projectId: '4',
    projectName: '文本匹配_0127',
    labelType: 'textMatch',
    status: 'complete',
    availableNum: 0,
    createdTime: '2020-01-16 10:00:00',
  },
  {
    projectId: '5',
    projectName: '文本匹配_0128',
    labelType: 'textMatch',
    status: 'suspend',
    availableNum: 8,
    createdTime: '2020-01-16 10:00:00',
  },
];

const taskMockData = [
  {
    projectId: '1',
    projectName: '文本分类123',
    taskId: '1',
    taskName: '任务1',
    labelType: 'textClassify',
    questionNum: 100,
    schedule: 0,
    status: 'initial',
    receiveTime: '',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '文本分类123',
    taskId: '2',
    taskName: '任务2',
    labelType: 'textClassify',
    questionNum: 200,
    schedule: 40,
    status: 'labeling',
    receiveTime: '2020-02-22 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '文本匹配123',
    taskId: '3',
    taskName: '任务3',
    labelType: 'textMatch',
    questionNum: 300,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-02-23 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '文本匹配123',
    taskId: '4',
    taskName: '任务4',
    labelType: 'textMatch',
    questionNum: 400,
    schedule: 100,
    status: 'reject',
    receiveTime: '2020-02-24 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '实体识别678',
    taskId: '5',
    taskName: '任务5',
    labelType: 'ner',
    questionNum: 100,
    schedule: 100,
    status: 'complete',
    receiveTime: '2020-02-25 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '实体识别456',
    taskId: 'ner6',
    taskName: '任务6',
    labelType: 'ner',
    questionNum: 100,
    schedule: 30,
    status: 'labeling',
    receiveTime: '2020-02-26 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '文本分类456',
    taskId: '7',
    taskName: '任务7',
    labelType: 'textClassify',
    questionNum: 100,
    schedule: 100,
    status: 'complete',
    receiveTime: '2020-02-27 10:00:00',
    owner: 'SYDEV',
  },
];

const markToolsMockData = [
  {
    toolId: 'emotion',
    toolName: '情感',
    options: [
      {
        optionId: 'anger',
        optionName: '愤怒',
      },
      {
        optionId: 'hate',
        optionName: '厌恶',
      },
      {
        optionId: 'fear',
        optionName: '害怕',
      },
      {
        optionId: 'sad',
        optionName: '悲伤',
      },
      {
        optionId: 'happy',
        optionName: '高兴',
      },
      {
        optionId: 'like',
        optionName: '喜欢',
      },
      {
        optionId: 'surprise',
        optionName: '惊喜',
      },
      {
        optionId: 'neutral',
        optionName: '中性',
      },
    ],
  },
];

const nerMarkToolsMockData = [
  {
    toolId: 'singer',
    toolName: '歌手',
    options: [
      {
        optionId: '周杰伦',
      },
    ],
  },
];

function getProjects(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;
  let dataSource = projectMockData;
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

function receiveTask(req, res) {
  const { taskId } = req.params;
  taskMockData.forEach(item => {
    if (item.taskId === taskId) {
      item.status = 'labeling';
      item.receiveTime = moment().local('zh-cn').format('YYYY-MM-DD HH:mm:ss')
    }
  });
  return res.json({ message: '领取成功', status: 'ok' })
}

function getTaskData(req, res, u) {
  const userId = req.header('UserID');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = parse(url, true).query;

  let pageSize = 10;
  if (params.pageSize) {
    pageSize = parseInt(`${params.pageSize}`, 0);
  }

  let dataSource = taskMockData;
  dataSource = dataSource.filter(item => item.owner === userId);

  const result = {
    list: taskMockData,
    pagination: {
      total: taskMockData.length,
      pageSize,
      current: parseInt(`${params.currentPage}`, 10) || 1,
    },
    inProgressNum: dataSource.filter(item => ['labeling', 'reject'].includes(item.status)).length,
    completeNum: dataSource.filter(item => item.status === 'complete').length,
  };

  res.json(result);
}

function getMyTask(req, res, u) {
  const userId = req.header('UserID');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = parse(url, true).query;

  let dataSource = taskMockData.filter(item => item.owner === userId);
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

  if (params.taskName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.taskName.toLowerCase().includes(params.taskName.toLowerCase()));
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

function getMarkTools(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  // const params = parse(url, true).query;
  res.json(markToolsMockData);
}

export default {
  'GET /api/task-center/projects': getProjects,
  'GET /api/task-center/task-data': getTaskData,
  'GET /api/task-center/my-task': getMyTask,
  'GET /api/task-center/receive-task/:taskId': receiveTask,
  'GET /api/task-center/mark-tools': getMarkTools,
};
