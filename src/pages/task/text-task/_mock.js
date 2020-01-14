import { parse } from 'url';

const mockData = [
  {
    taskId: '1',
    taskName: '文本分类_0123',
    taskType: '文本分类',
    labeler: '李锦宇',
    schedule: '60%',
    status: '未开始',
    createdTime: '2020-01-13 10:00:00',
    deadline: '2020-02-20 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '2',
    taskName: '文本分类_0124',
    taskType: '文本匹配',
    labeler: '张三',
    schedule: '70%',
    status: '标注中',
    createdTime: '2020-01-14 10:00:00',
    deadline: '2020-02-21 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '3',
    taskName: '文本分类_0125',
    taskType: '实体识别',
    labeler: '王五',
    schedule: '80%',
    status: '审核中',
    createdTime: '2020-01-15 10:00:00',
    deadline: '2020-02-22 10:00:00',
    departmentId: 'operation',
  },
  {
    taskId: '4',
    taskName: '文本分类_0126',
    taskType: '实体识别',
    labeler: '杨六',
    schedule: '90%',
    status: '驳回待修改',
    createdTime: '2020-01-16 10:00:00',
    deadline: '2020-02-23 10:00:00',
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

export default {
  'GET /api/text-tasks': getTasks,
};
