import { parse } from 'url';
import { typeCastExpression } from '@babel/types';

const mockData = [
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

export default {
  'GET /api/text-tasks': getTasks,
};
