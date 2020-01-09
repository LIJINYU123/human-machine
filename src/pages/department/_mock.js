import moment from 'moment';

let mockData = [
  {
    departmentId: 'deveopment',
    departmentName: '研发部门',
    administrator: 'SYDEV',
    userAmount: 10,
    createdTime: '2020-01-08 00:00:00',
  },
  {
    departmentId: 'operation',
    departmentName: '运营部门',
    administrator: 'SYOPE',
    userAmount: 20,
    createdTime: '2020-01-06 00:00:00',
  },
];

const mockAccounts = [
  {
    userId: 'SYABC',
    name: '管理员1',
  },
  {
    userId: 'SYDEF',
    name: '管理员2',
  },
];

function getDepartment(req, res) {
  return res.json(mockData);
}

function createDepartment(req, res, u, b) {
  const body = (b && b.body) || req.body;
  body.createdTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  body.userAmount = 0;
  mockData.push(body);
  return res.json({ message: '创建成功', status: 'ok' });
}

function getNoDepAccounts(req, res) {
  return res.json(mockAccounts);
}

function deleteDepartment(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData = mockData.filter(item => item.departmentId !== body.departmentId);
  res.json({ message: '删除成功', status: 'ok' });
}

export default {
  'GET /api/department': getDepartment,
  'PUT /api/department': createDepartment,
  'DELETE /api/department': deleteDepartment,
  'GET /api/no-dep-accounts': getNoDepAccounts,
}
