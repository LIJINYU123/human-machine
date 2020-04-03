import moment from 'moment';
import { parse } from 'url';

let mockData = [
  {
    departmentId: 'deveopment',
    departmentName: '研发部门',
    departmentType: 'operationCenter',
    privilege: ['textClassify', 'pictureMark'],
    administrator: 'SYDEV',
    adminName: '研发部管理员',
    userAmount: 10,
    createdTime: '2020-01-08 00:00:00',
  },
  {
    departmentId: 'operation',
    departmentName: '运营部门',
    departmentType: 'company',
    privilege: ['textClassify'],
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

function getDepartment(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  let dataSource = mockData;
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

  if (params.departmentType) {
    const types = params.departmentType.split(',');
    let filterDataSource = [];
    types.forEach(type => {
      // eslint-disable-next-line max-len
      filterDataSource = filterDataSource.concat(dataSource.filter(item => item.departmentType === type));
    });

    dataSource = filterDataSource;
  }

  return res.json(dataSource);
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
      item.privilege = body.privilege;
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
