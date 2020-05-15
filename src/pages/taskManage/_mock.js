import { parse } from 'url';
import moment from 'moment/moment';

const projectMockData = [
  {
    projectId: '1',
    projectName: '文本分类_0123',
    projectType: '文本',
    status: 'initial',
    availableNum: 4,
    createdTime: '2020-01-13 10:00:00',
  },
  {
    projectId: '2',
    projectName: '文本匹配_0124',
    projectType: '文本',
    status: 'initial',
    availableNum: 3,
    createdTime: '2020-01-14 10:00:00',
  },
  {
    projectId: '3',
    projectName: '实体识别_0125',
    projectType: '文本',
    status: 'inProgress',
    availableNum: 0,
    createdTime: '2020-01-15 10:00:00',
  },
  {
    projectId: '4',
    projectName: '文本匹配_0127',
    projectType: '文本',
    status: 'complete',
    availableNum: 0,
    createdTime: '2020-01-16 10:00:00',
  },
  {
    projectId: '5',
    projectName: '文本匹配_0128',
    projectType: '文本',
    status: 'suspend',
    availableNum: 8,
    createdTime: '2020-01-16 10:00:00',
  },
];

const taskMockData = [
  
  {
    projectId: '1',
    projectName: '文本分类123',
    taskId: '2',
    taskName: '任务2',
    labelType: 'textClassify',
    questionNum: 200,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-02-22 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: '1',
    projectName: '文本匹配123',
    taskId: 'match3',
    taskName: '任务3',
    labelType: 'textClassify',
    questionNum: 300,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-02-23 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: 'match_project1',
    projectName: '文本匹配123',
    taskId: 'match4',
    taskName: '任务4',
    labelType: 'textClassify',
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
    labelType: 'sequenceLabeling',
    questionNum: 100,
    schedule: 100,
    status: 'complete',
    receiveTime: '2020-02-25 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: 'ner_project1',
    projectName: '实体识别456',
    taskId: 'ner6',
    taskName: '任务6',
    labelType: 'sequenceLabeling',
    questionNum: 100,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-02-26 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: 'split_project1',
    projectName: '句子切分20200421',
    taskId: 'split7',
    taskName: '任务7',
    labelType: 'sequenceLabeling',
    questionNum: 300,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-04-21 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: 'extension_project1',
    projectName: '文本扩写20200422',
    taskId: 'extension8',
    taskName: '任务8',
    labelType: 'textExtension',
    questionNum: 400,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-04-22 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: 'reading_project1',
    projectName: '阅读理解20200420',
    taskId: 'reading9',
    taskName: '任务9',
    labelType: 'sequenceLabeling',
    questionNum: 500,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-04-20 10:00:00',
    owner: 'SYECO',
  },
  {
    projectId: 'image_project1',
    projectName: '图片标注20200424',
    taskId: 'image10',
    taskName: '任务10',
    labelType: 'pictureMark',
    questionNum: 100,
    schedule: 100,
    status: 'review',
    receiveTime: '2020-04-24 10:00:00',
    owner: 'SYECO',
  },
];

const markToolsMockData = [
  {
    classifyName: '情感',
    multiple: true,
    options: [
      {
        optionName: '愤怒',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '厌恶',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '害怕',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '悲伤',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '高兴',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '喜欢',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '惊喜',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '中性',
        color: '#1890ff',
        extraInfo: [],
      },
    ],
  },
];

const matchMarkToolsMockData = [
  {
    classifyName: '相似度',
    multiple: false,
    options: [
      {
        optionName: '相似',
        color: '#1890ff',
        extraInfo: [],
      },
      {
        optionName: '不相似',
        color: '#1890ff',
        extraInfo: [],
      },
    ],
  },
];

const nerMarkToolsMockData = [
  {
    classifyName: '实体',
    multiple: true,
    saveType: 'dict',
    options: [
      {
        optionName: '歌手',
        color: '#006d75',
        extraInfo: [
          '周杰伦',
          '林俊杰',
        ],
      },
      {
        optionName: '景点',
        color: '#a0d911',
        extraInfo: [
          '外滩', '长城',
        ],
      },
      {
        optionName: '歌名',
        color: '#faad14',
        extraInfo: ['十年', '红玫瑰', '告白气球'],
      },
    ],
  },
];

const splitMarkToolsMockData = [
  {
    classifyName: '句子切分',
    multiple: false,
    saveType: 'nomal',
    options: [
      {
        optionName: '句子',
        color: '#1890ff',
      },
    ],
  },
];

const readingMarkToolsMockData = [
  {
    classifyName: '阅读理解',
    multiple: false,
    saveType: 'nomal',
    options: [
      {
        optionName: '答案',
        color: '#52c41a',
      },
    ],
  },
];

const extensionMarkToolsMockData = [
  {
    classifyName: '文本扩写',
    multiple: false,
    minValue: 10,
    maxValue: 20,
  },
];

const imageMarkToolsMockData = [
  {
    classifyName: '事物',
    options: [
      {
        optionName: '家电',
        color: '#52c41a',
      },
      {
        optionName: '家具',
        color: '#13c2c2',
      },
      {
        optionName: '人物',
        color: '#1890ff',
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
        return Date.parse(next[s[0]]) - Date.parse(prev[s[0]]);
      }

      return Date.parse(prev[s[0]]) - Date.parse(next[s[0]]);
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

  if (params.projectType) {
    const types = params.projectType.split(',');
    let filterDataSource = [];
    types.forEach(type => {
      // eslint-disable-next-line max-len
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.projectType === type));
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
  const { projectId } = req.params;
  // taskMockData.forEach(item => {
  //   if (item.taskId === taskId) {
  //     item.status = 'labeling';
  //     item.receiveTime = moment().local('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  //   }
  // });
  return res.json({ message: '领取成功', status: 'ok' })
}

function getTaskData(req, res, u) {
  const userId = req.header('UserID');
  const roleId = req.header('RoleID');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = parse(url, true).query;

  // let pageSize = 10;
  // if (params.pageSize) {
  //   pageSize = parseInt(`${params.pageSize}`, 0);
  // }

  let dataSource = taskMockData;
  dataSource = dataSource.filter(item => item.owner === userId);

  const result = {
    list: [],
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

  let dataSource = taskMockData;

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

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return Date.parse(next[s[0]]) - Date.parse(prev[s[0]]);
      }

      return Date.parse(prev[s[0]]) - Date.parse(next[s[0]]);
    })
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

function getMyTaskNumber(req, res) {
  const userId = req.header('UserID');
  const roleId = req.header('RoleID');
  let filterDataSource;
  const dataSource = taskMockData.filter(item => item.owner === userId);
  if (roleId === 'labeler') {
    filterDataSource = dataSource.filter(item => ['labeling', 'reject'].includes(item.status));
  } else {
    filterDataSource = dataSource.filter(item => item.status === 'review');
  }

  const inProgressNum = filterDataSource.length;
  filterDataSource = dataSource.filter(item => item.status === 'complete');
  const completeNum = filterDataSource.length;
  res.json({ inProgressNum, completeNum });
}

function getMarkTool(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;

  if (params.projectId.indexOf('ner') === 0) {
    res.json(nerMarkToolsMockData[0]);
  } else if (params.projectId.indexOf('match') === 0) {
    res.json(matchMarkToolsMockData[0]);
  } else if (params.projectId.indexOf('split') === 0) {
    res.json(splitMarkToolsMockData[0]);
  } else if (params.projectId.indexOf('reading') === 0) {
    res.json(readingMarkToolsMockData[0]);
  } else if (params.projectId.indexOf('extension') === 0) {
    res.json(extensionMarkToolsMockData[0]);
  } else if (params.projectId.indexOf('image') === 0) {
    res.json(imageMarkToolsMockData[0]);
  } else {
    res.json(markToolsMockData[0]);
  }
}


function updateTaskStatus(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { taskId, status } = body;
  taskMockData.forEach(item => {
    if (item.taskId === taskId) {
      item.status = status;
    }
  });
  res.json({ status: 'ok', message: '操作成功' })
}

export default {
  'GET /api/task-manage/projects': getProjects,
  'GET /api/task-manage/task-data': getTaskData,
  'GET /api/task-manage/my-task': getMyTask,
  'GET /api/task-manage/task-number': getMyTaskNumber,
  'GET /api/task-manage/receive-task/:projectId': receiveTask,
  'GET /api/task-manage/mark-tool': getMarkTool,
  'POST /api/task-manage/task-status': updateTaskStatus,
};
