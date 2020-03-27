import { parse } from 'url';
import moment from 'moment';
import Mock from 'mockjs';


let mockData = [
  {
    userId: 'SY0111',
    name: '李雷',
    roleName: '管理员',
    groups: [{ groupId: '1', groupName: '用户组1' }, { groupId: '2', groupName: '用户组2' }],
    registerTime: '2019-12-20 10:00:00',
    status: 'active',
    departmentId: 'development',
  },
  {
    userId: 'SY0112',
    name: '张三',
    roleName: '管理员',
    groups: [{ groupId: '3', groupName: '用户组3' }, { groupId: '4', groupName: '用户组4' }],
    registerTime: '2019-12-21 09:00:00',
    status: 'active',
    departmentId: 'development',
  },
  {
    userId: 'SY0113',
    name: '李四',
    roleName: '普通用户',
    groups: [{ groupId: '5', groupName: '用户组5' }, { groupId: '6', groupName: '用户组6' }],
    registerTime: '2019-12-22 13:00:00',
    status: 'active',
    departmentId: 'development',
  },
  {
    userId: 'SY0114',
    name: '王五',
    roleName: '普通用户',
    groups: [{ groupId: '7', groupName: '用户组7' }, { groupId: '8', groupName: '用户组8' }],
    registerTime: '2019-12-25 16:00:00',
    status: 'active',
    departmentId: 'development',
  },
  {
    userId: 'SY0115',
    name: '杨六',
    roleName: '管理员',
    groups: [{ groupId: '9', groupName: '用户组9' }, { groupId: '10', groupName: '用户组10' }],
    registerTime: '2020-01-08 09:00:00',
    status: 'active',
    departmentId: 'operation',
  },
  {
    userId: 'SY0116',
    name: '顾七',
    roleName: '普通用户',
    groups: [{ groupId: '11', groupName: '用户组11' }, { groupId: '12', groupName: '用户组12' }],
    registerTime: '2020-01-09 13:00:00',
    status: 'active',
    departmentId: 'operation',
  },
  {
    userId: 'SY0117',
    name: '何九',
    roleName: '普通用户',
    groups: [{ groupId: '13', groupName: '用户组13' }, { groupId: '14', groupName: '用户组14' }],
    registerTime: '2019-12-25 16:00:00',
    status: 'inactive',
    departmentId: 'operation',
  },
];

let groupData = [
  {
    groupId: '1',
    groupName: '标注组A',
    userAmount: 3,
    userInfo: [
      {
        userId: 'SY0123',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
      {
        userId: 'SY0124',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
      {
        userId: 'SY0125',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
    ],
    createdTime: '2020-03-10 10:00:00',
  },
  {
    groupId: '2',
    groupName: '标注组B',
    userAmount: 3,
    userInfo: [
      {
        userId: 'SY0126',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
      {
        userId: 'SY0127',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
      {
        userId: 'SY0128',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
    ],
    createdTime: '2020-03-11 10:00:00',
  },
  {
    groupId: '3',
    groupName: '标注组C',
    userAmount: 3,
    userInfo: [
      {
        userId: 'SY0129',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
      {
        userId: 'SY0130',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
      {
        userId: 'SY0131',
        name: Mock.Random.cname(),
        roleId: 'inspector',
      },
    ],
    createdTime: '2020-03-12 10:00:00',
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
        return Date.parse(next[s[0]]) - Date.parse(prev[s[0]]);
      }
      return Date.parse(prev[s[0]]) - Date.parse(next[s[0]]);
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
  const departmentId = req.get('DepartmentId');
  const body = (b && b.body) || req.body;
  const accounts = [];
  mockData.forEach(item => {
    if (body.userId === item.userId) {
      item.roleName = roleMap[body.roleId];
      item.departmentId = departmentId;
    }
    accounts.push(item.userId);
  });

  if (!accounts.includes(body.userId)) {
    mockData.push({
      userId: body.userId,
      name: 'XXX',
      roleName: roleMap[body.roleId],
      groups: [],
      registerTime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
      status: 'active',
      departmentId,
    });
  }

  return res.json({ message: '更新成功', status: 'ok' });
}

function updateStatus(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData.forEach(item => {
    if (body.userId === item.userId) {
      item.status = body.status;
    }
  });

  return res.json({ message: '更新成功', status: 'ok' });
}


function getGroups(req, res, u) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;
  let dataSource = groupData;


  if (params.sorter) {
    const s = params.sorter.split('_');
    dataSource = dataSource.sort((prev, next) => {
      if (s[1] === 'descend') {
        return Date.parse(next[s[0]]) - Date.parse(prev[s[0]]);
      }
      return Date.parse(prev[s[0]]) - Date.parse(next[s[0]]);
    });
  }

  if (params.groupName) {
    // eslint-disable-next-line max-len
    dataSource = dataSource.filter(item => item.groupName.toLowerCase().includes(params.groupName.toLowerCase()));
  }

  return res.json(dataSource);
}

function addGroup(req, res, u, b) {
  const body = (b && b.body) || req.body;
  groupData.push({
    groupId: Mock.Random.word(),
    groupName: body.groupName,
    userAmount: body.userIds.length,
    userInfo: body.userIds.map(id => ({ userId: id, name: Mock.Random.cname(), roleId: 'inspector' })),
    createdTime: moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss'),
  });

  return res.json({ message: '创建成功', status: 'ok' });
}

function deleteGroup(req, res, u, b) {
  const body = (b && b.body) || req.body;
  groupData = groupData.filter(group => !body.groupIds.includes(group.groupId));
  return res.json({ message: '删除成功', status: 'ok' });
}

function modifyGroup(req, res, u, b) {
  const body = (b && b.body) || req.body;
  groupData.forEach(group => {
    if (group.groupId === body.groupId) {
      group.groupName = body.groupName;
    }
  });
  return res.json({ message: '更新成功', status: 'ok' });
}

function getUserInfo(req, res, u) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }
  const params = parse(url, true).query;

  if (params.groupId) {
    const filterGroup = groupData.filter(group => group.groupId === params.groupId);
    if (filterGroup.length) {
      return res.json(filterGroup[0].userInfo);
    }
  }

  return res.json([])
}

function deleteUserInfo(req, res, u, b) {
  const body = (b && b.body) || req.body;
  groupData.forEach(group => {
    if (group.groupId === body.groupId) {
      group.userInfo = group.userInfo.filter(user => !body.userIds.includes(user.userId));
    }
  });
  return res.json({ message: '删除成功', status: 'ok' });
}

export default {
  'GET /api/users': getUsers,
  'GET /api/user/detail': getUserDetail,
  'DELETE /api/users': deleteUser,
  'POST /api/user/detail': updateUser,
  'POST /api/user/status': updateStatus,
  'GET /api/groups': getGroups,
  'PUT /api/groups': addGroup,
  'DELETE /api/groups': deleteGroup,
  'POST /api/groups': modifyGroup,
  'GET /api/user-info': getUserInfo,
  'DELETE /api/user-info': deleteUserInfo,
};
