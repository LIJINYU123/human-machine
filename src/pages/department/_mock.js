import moment from 'moment';

let mockData = [
  {
    departmentId: 'deveopment',
    departmentName: '研发部门',
    administrator: 'SYDEV',
    adminName: '研发部管理员',
    userAmount: 10,
    createdTime: '2020-01-08 00:00:00',
  },
  {
    departmentId: 'operation',
    departmentName: '运营部门',
    administrator: 'SYOPE',
    adminName: '运营部管理员',
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

function updateDepartment(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData.forEach(item => {
    if (body.departmentId === item.departmentId) {
      item.departmentName = body.departmentName;
      item.administrator = body.administrator;
      const result = mockAccounts.filter(account => account.userId === body.administrator);
      item.adminName = result.length ? result[0].name : '';
    }
  });

  return res.json({ message: '更新成功', status: 'ok' });
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
  'POST /api/department': updateDepartment,
  'GET /api/no-dep-accounts': getNoDepAccounts,
}
