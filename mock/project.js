import { parse } from 'url';
import moment from 'moment';
import Mock from 'mockjs';

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
    template: { templateName: '文本分类模板', setting: {} },
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
    projectName: '文本分类_0124',
    labelType: 'textMatch',
    labelers: [{ name: '李锦宇', id: 'SY0976' }, { name: '张三', id: 'SY0123' }],
    inspectors: [{ name: '质检员4', id: 'SY0127' }, { name: '质检员5', id: 'SY0128' }, { name: '质检员6', id: 'SY0129' }],
    template: { templateName: '文本分类模板', setting: {} },
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
    template: { templateName: '序列标注模板', setting: {} },
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
    projectName: '文本分类_0127',
    labelType: 'textMatch',
    labelers: [{ name: '张六', id: 'SY0129' }],
    inspectors: [{ name: '质检员10', id: 'SY0133' }, { name: '质检员11', id: 'SY0134' }, { name: '质检员12', id: 'SY0135' }],
    template: { templateName: '文本分类模板', setting: {} },
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
    projectName: '文本分类_0128',
    labelType: 'textMatch',
    labelers: [{ name: '张六', id: 'SY0129' }],
    inspectors: [{ name: '质检员10', id: 'SY0133' }, { name: '质检员11', id: 'SY0134' }, { name: '质检员12', id: 'SY0135' }],
    template: { templateName: '文本分类模板', setting: {} },
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
    template: { templateName: '文本分类模板', setting: {} },
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
    labelResult: ['高兴', '愤怒'],
    reviewResult: 'approve',
    remark: '这是条评论1',
  },
  {
    dataId: '2',
    data: { sentence: '出差住的酒店是自己订好吗' },
    labelResult: ['高兴', '愤怒'],
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
    labelResult: ['高兴', '愤怒'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '5',
    data: { sentence: '自己是不是可以随便订酒店' },
    labelResult: ['中性'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '6',
    data: { sentence: '为公司出差住宿可以给多少预算' },
    labelResult: ['中性'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '7',
    data: { sentence: '出差的话可以住几星级的酒店' },
    labelResult: ['高兴', '喜欢'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '8',
    data: { sentence: '协议酒店可以不住吗' },
    labelResult: ['中性'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '9',
    data: { sentence: '协议酒店不住会出事吗' },
    labelResult: ['喜欢'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '10',
    data: { sentence: '在国内出差住400一晚的酒店可以吗' },
    labelResult: ['喜欢'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '11',
    data: { sentence: '在国内出差能够住几星级的酒店' },
    labelResult: ['喜欢'],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '12',
    data: { sentence: '在国内出差的话住宿有没有一个标准' },
    labelResult: ['喜欢'],
    reviewResult: 'unreview',
    remark: '',
  },
];

const matchLabelData = [
  {
    dataId: '1',
    data: { sentence1: '出差的话怎么去预订酒店', sentence2: '去其他地方出差这酒店怎么预订' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '2',
    data: { sentence1: '出差时订酒店规定档次吗', sentence2: '在外面出差的时候酒店在什么地方订' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论2',
  },
  {
    dataId: '3',
    data: { sentence1: '酒店是公司帮忙订吗', sentence2: '出差住的酒店是自己订好吗' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论3',
  },
  {
    dataId: '4',
    data: { sentence1: '为了工作出差住酒店能报销多少', sentence2: '出差住的酒店星级有限制吗' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论4',
  },
  {
    dataId: '5',
    data: { sentence1: '不去住协议酒店会怎么样', sentence2: '协议酒店不住会出事吗' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论5',
  },
  {
    dataId: '6',
    data: { sentence1: '协议酒店如果不去住会有什么事发生', sentence2: '出差的地方没有协议酒店怎么办' },
    labelResult: ['不相似'],
    reviewResult: 'approve',
    remark: '这是条评论6',
  },
  {
    dataId: '7',
    data: { sentence1: '在国内出差可以选择1000元的酒店吗', sentence2: '被派在国内出差可以住什么档次的酒店' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论7',
  },
  {
    dataId: '8',
    data: { sentence1: '去国内出差住酒店公司有多少预算', sentence2: '被公司派去国内出差酒店住宿的价格有上限吗' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论8',
  },
  {
    dataId: '9',
    data: { sentence1: '出差住宿这产生的服务费可以报销吗', sentence2: '出差住宿的早餐前能不能给报了' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论8',
  },
  {
    dataId: '10',
    data: { sentence1: '住酒店吃早餐花的钱给报吗', sentence2: '住酒店找停车位花的钱也能报销吗' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论10',
  },
  {
    dataId: '11',
    data: { sentence1: '在国内出差除了协议酒店还有其他可以选的吗', sentence2: '澳门出差也算去海外出差吗' },
    labelResult: ['不相似'],
    reviewResult: 'approve',
    remark: '这是条评论11',
  },
  {
    dataId: '12',
    data: { sentence1: '海外酒店适用于香港吗', sentence2: '澳门的酒店应该不算海外酒店吧' },
    labelResult: ['相似'],
    reviewResult: 'approve',
    remark: '这是条评论12',
  },
];

const nerLabelData = [
  {
    dataId: '1',
    data: { sentence: '我想要听王菲的传奇' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '2',
    data: { sentence: '我想要去巴黎看埃菲尔铁塔' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '3',
    data: { sentence: '你去过北京的故宫吗' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '4',
    data: { sentence: '我想要听周董的演唱会' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '5',
    data: { sentence: '我想听林俊杰的江南' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '6',
    data: { sentence: '我想要听周杰伦的告白气球' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '7',
    data: { sentence: '我想听阿妹的歌' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '8',
    data: { sentence: '我想听吴青峰的歌' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '9',
    data: { sentence: '我想听苏打绿的小情歌' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '10',
    data: { sentence: '我想去沙滩晒太阳' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '11',
    data: { sentence: '我喜欢吃肯德基的香辣鸡腿堡' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
  {
    dataId: '12',
    data: { sentence: '我喜欢逛万达广场' },
    labelResult: [],
    reviewResult: 'unreview',
    remark: '',
  },
];

let templatesMockData = [
  {
    labelType: 'textClassify',
    templateId: '1',
    templateName: '情感配置模板',
    description: '这是情感工具配置模板',
    createdTime: '2020-03-10 10:10:00',
    setting: {
      classifyName: '情感',
      multiple: true,
      options: [
        {
          optionId: 'anger',
          optionName: '愤怒',
          color: '#1890ff',
        },
        {
          optionId: 'hate',
          optionName: '厌恶',
          color: '#1890ff',
        },
        {
          optionId: 'fear',
          optionName: '害怕',
          color: '#1890ff',
        },
        {
          optionId: 'sad',
          optionName: '悲伤',
          color: '#1890ff',
        },
        {
          optionId: 'happy',
          optionName: '高兴',
          color: '#1890ff',
        },
        {
          optionId: 'like',
          optionName: '喜欢',
          color: '#1890ff',
        },
        {
          optionId: 'surprise',
          optionName: '惊喜',
          color: '#1890ff',
        },
        {
          optionId: 'neutral',
          optionName: '中性',
          color: '#1890ff',
        },
      ],
    },
  },
  {
    labelType: 'textClassify',
    templateId: '2',
    templateName: '句式配置模板',
    description: '这是句式工具配置模板',
    createdTime: '2020-03-11 12:10:00',
    setting: {
      classifyName: '句式',
      multiple: true,
      options: [
        {
          optionId: 'chenshuju',
          optionName: '肯定陈述句',
          color: '#1890ff',
        },
        {
          optionId: 'fanwenju',
          optionName: '反问句',
          color: '#1890ff',
        },
        {
          optionId: 'yiwenju',
          optionName: '疑问句',
          color: '#1890ff',
        },
      ],
    },
  },
  {
    labelType: 'textClassify',
    templateId: '3',
    templateName: '相似度配置模板',
    description: '这是相似度配置模板',
    createdTime: '2020-03-11 12:10:00',
    setting: {
      classifyName: '相似度',
      multiple: false,
      options: [
        {
          optionId: 'similar',
          optionName: '相似',
          color: '#1890ff',
        },
        {
          optionId: 'notSimilar',
          optionName: '不相似',
          color: '#1890ff',
        },
      ],
    },
  },
  {
    labelType: 'sequenceLabeling',
    templateId: '4',
    templateName: '实体识别配置模板',
    description: '这是句式工具配置模板',
    createdTime: '2020-03-12 13:10:00',
    setting: {
      classifyName: '实体',
      saveType: 'nomal',
      options: [
        {
          optionId: 'country',
          optionName: '国家',
          color: '#1890ff',
        },
        {
          optionId: 'location',
          optionName: '地名',
          color: '#1890ff',
        },
      ],
    },
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
  let dataSource;
  if (params.taskId.indexOf('ner') === 0) {
    dataSource = nerLabelData;
  } else if (params.taskId.indexOf('match') === 0) {
    dataSource = matchLabelData;
  } else {
    dataSource = labelMockData;
  }

  if (params.reviewResult) {
    const results = params.reviewResult.split(',');
    let filterDataSource = [];
    results.forEach(result => {
      // eslint-disable-next-line max-len
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.reviewResult === result));
    });

    dataSource = filterDataSource;
  }

  if (params.result) {
    const result = params.result.split(',');
    if (result.length === 1 && result[0] === 'processed') {
      dataSource = dataSource.filter(item => Object.keys(item.result).length > 0);
    } else if (result.length === 1 && result[0] === 'unprocessed') {
      dataSource = dataSource.filter(item => Object.keys(item.result).length === 0);
    }
  }

  if (params.sentence) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.data.sentence.toLowerCase().includes(params.sentence.toLowerCase()));
  }

  if (params.sentence1) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.data.sentence1.toLowerCase().includes(params.sentence1.toLowerCase()));
  }

  if (params.sentence2) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.data.sentence2.toLowerCase().includes(params.sentence2.toLowerCase()));
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

function getTemplates(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  let dataSource = templatesMockData;
  const params = parse(url, true).query;

  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return Date.parse(next[s[0]]) - Date.parse(prev[s[0]]);
      }

      return Date.parse(prev[s[0]]) - Date.parse(next[s[0]]);
    })
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

  if (params.templateName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.templateName.toLowerCase().includes(params.templateName.toLowerCase()));
  }

  return res.json(dataSource);
}

function createTemplate(req, res, u, b) {
  const body = (b && b.body) || req.body;
  body.createdTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  body.templateId = Mock.Random.word();
  templatesMockData.push(body);
  return res.json({ message: '创建成功', status: 'ok' });
}

function updateTemplate(req, res, u, b) {
  const body = (b && b.body) || req.body;
  templatesMockData.forEach(template => {
    if (template.templateId === body.templateId) {
      template.templateName = body.templateName;
      template.description = body.description;
      template.setting = body.setting;
    }
  });
  return res.json({ message: '更新成功', status: 'ok' });
}

function deleteTemplates(req, res, u, b) {
  const body = (b && b.body) || req.body;
  templatesMockData = templatesMockData.filter(item => !body.templateIds.includes(item.templateId));
  return res.json({ message: '删除成功', status: 'ok' });
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

function saveStepOneData(req, res, u, b) {
  const body = (b && b.body) || req.body;
  return res.json({ status: 'ok', message: body });
}

function saveStepTwoData(req, res, u, b) {
  const body = (b && b.body) || req.body;
  return res.json({ status: 'ok', message: body });
}

function saveStepFourData(req, res) {
  return res.json({ status: 'ok', message: '创建成功' });
}

function getPreLabelData(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  // const params = parse(url, true).query;
  return res.json([{ sentence: '出差住的酒店是自己订好吗' }])
}

function saveTextMarkResult(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { taskId, dataId, labelResult } = body;

  if (taskId.indexOf('ner') === 0) {
    nerLabelData.forEach(item => {
      if (item.dataId === dataId) {
        item.labelResult = labelResult;
      }
    });
  } else if (taskId.indexOf('match') === 0) {
    matchLabelData.forEach(item => {
      if (item.dataId === dataId) {
        item.labelResult = labelResult;
      }
    });
  } else {
    labelMockData.forEach(item => {
      if (item.dataId === dataId) {
        item.labelResult = labelResult;
      }
    });
  }

  return res.json({ status: 'ok', message: '标注成功' });
}

function deleteTextMarkResult(req, res, u, b) {
  const body = (b && b.body) || req.body;
  nerLabelData.forEach(item => {
    if (item.dataId === body.dataId) {
      item.labelResult.splice(body.index, 1);
    }
  });
  return res.json({ status: 'ok', message: '删除成功' });
}

function saveReviewResult(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const { dataId, taskId, result } = body;
  let labelData;
  if (taskId.indexOf('ner') === 0) {
    labelData = nerLabelData;
  } else if (taskId.indexOf('match') === 0) {
    labelData = matchLabelData;
  } else {
    labelData = labelMockData;
  }
  labelData.forEach(item => {
    if (item.dataId === dataId) {
      item.reviewResult = result.reviewResult;
      item.remark = result.remark;
    }
  });
  return res.json({ status: 'ok', message: '保存成功' });
}

export default {
  'GET /api/projects': getProjects,
  'DELETE /api/projects': deleteProjects,
  'GET /api/project/detail/:projectId': getProjectDetail,
  'GET /api/project/task-data': getTaskData,
  'DELETE /api/project/task-data': deleteTaskData,
  'GET /api/project/default-templates': getTemplates,
  'PUT /api/project/default-templates': createTemplate,
  'POST /api/project/default-templates': updateTemplate,
  'DELETE /api/project/default-templates': deleteTemplates,
  'GET /api/project/members': getRoleMembers,
  'POST /api/project/review-result': saveReviewResult,

  'POST /api/text-project/create': createProject,
  'PUT /api/project/step-one': saveStepOneData,
  'POST /api/project/step-two': saveStepTwoData,
  'POST /api/project/step-four': saveStepFourData,
  'GET /api/project/pre-label-data': getPreLabelData,

  'GET /api/text-project/task-detail/:taskId': getTaskDetail,
  'GET /api/text-project/label-data': getLabelData,
  'DELETE /api/text-project/label-data': deleteLabelData,
  'POST /api/text-project/download-template': downloadTemplate,

  'POST /api/text-project/label-result': saveTextMarkResult,
  'DELETE /api/text-project/label-result': deleteTextMarkResult,
};
