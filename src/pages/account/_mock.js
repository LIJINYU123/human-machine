import { parse } from 'url';
import moment from 'moment';


let mockData = [
  {
    userId: 'SY0111',
    name: '李雷',
    roleName: '管理员',
    registerTime: '2019-12-20 10:00:00',
    departmentId: 'development',
  },
  {
    userId: 'SY0112',
    name: '张三',
    roleName: '管理员',
    registerTime: '2019-12-21 09:00:00',
    departmentId: 'development',
  },
  {
    userId: 'SY0113',
    name: '李四',
    roleName: '普通用户',
    registerTime: '2019-12-22 13:00:00',
    departmentId: 'development',
  },
  {
    userId: 'SY0114',
    name: '王五',
    roleName: '普通用户',
    registerTime: '2019-12-25 16:00:00',
    departmentId: 'development',
  },
  {
    userId: 'SY0115',
    name: '杨六',
    roleName: '管理员',
    registerTime: '2020-01-08 09:00:00',
    departmentId: 'operation',
  },
  {
    userId: 'SY0116',
    name: '顾七',
    roleName: '普通用户',
    registerTime: '2020-01-09 13:00:00',
    departmentId: 'operation',
  },
  {
    userId: 'SY0117',
    name: '何九',
    roleName: '普通用户',
    registerTime: '2019-12-25 16:00:00',
    departmentId: 'operation',
  },
];

const roleMap = {
  administrator: '管理员',
  user: '普通用户',
};

function getUsers(req, res, u) {
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

  if (params.userId) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.userId.toLowerCase().includes(params.userId.toLowerCase()));
  }

  if (params.name) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.name.toLowerCase().includes(params.name.toLowerCase()));
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

function getUserDetail(req, res, u) {
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;

  const result = mockData.filter(item => item.userId === params.userId);

  return res.json(result[0]);
}

function deleteUser(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData = mockData.filter(item => !body.userIds.includes(item.userId));
  return res.json({ message: '删除成功', status: 'ok' });
}

function updateUser(req, res, u, b) {
  const body = (b && b.body) || req.body;
  const accounts = [];
  mockData.forEach(item => {
    if (body.userId === item.userId) {
      item.roleName = roleMap[body.roleId];
      item.departmentId = body.departmentId;
    }
    accounts.push(item.userId);
  });

  if (!accounts.includes(body.userId)) {
    mockData.push({
      userId: body.userId,
      name: 'XXX',
      roleName: roleMap[body.roleId],
      registerTime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
      departmentId: body.departmentId,
    });
  }

  return res.json({ message: '更新成功', status: 'ok' });
}

export default {
  'GET /api/users': getUsers,
  'GET /api/user/detail': getUserDetail,
  'DELETE /api/users': deleteUser,
  'POST /api/user/detail': updateUser,
};
