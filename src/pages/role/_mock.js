import { parse } from 'url';

const mockData = [
  {
    roleId: 'administrator',
    roleName: '管理员',
    createdTime: '2019-12-26 00:00:00',
    dialogInput: ['add'],
    historyRecord: ['modify', 'query', 'delete'],
    roleManage: ['add', 'modify', 'query', 'delete'],
    userManage: ['add', 'modify', 'query', 'delete'],
    description: '这是管理员的描述',
  },
  {
    roleId: 'user',
    roleName: '普通用户',
    createdTime: '2019-12-25 00:00:00',
    dialogInput: ['add'],
    historyRecord: ['query'],
    roleManage: [],
    userManage: [],
    description: '这是普通用户的描述',
  },
];

function getRoles(req, res) {
  const result = [
    {
      roleId: 'administrator',
      roleName: mockData[0].roleName,
      createdTime: '2019-12-26 00:00:00',
      // eslint-disable-next-line max-len
        privileges: { historyRecord: mockData[0].historyRecord, dialogInput: mockData[0].dialogInput, roleManage: mockData[0].roleManage, userManage: mockData[0].userManage },
    },
    {
      roleId: 'user',
      roleName: mockData[1].roleName,
      createdTime: '2019-12-25 00:00:00',
      // eslint-disable-next-line max-len
      privileges: { historyRecord: mockData[1].historyRecord, dialogInput: mockData[1].dialogInput, roleManage: mockData[1].roleManage, userManage: mockData[1].userManage },
    },
  ];

  return res.json(result);
}

function getRoleDetail(req, res, u) {
  let url = u;

  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url;
  }

  const params = parse(url, true).query;

  let result = {};
  if (params.roleId === 'administrator') {
    // eslint-disable-next-line prefer-destructuring
    result = mockData[0];
  } else if (params.roleId === 'user') {
    // eslint-disable-next-line prefer-destructuring
    result = mockData[1];
  }

  return res.json(result);
}

function updateRoleDetail(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData.forEach(roleInfo => {
    if (body.roleId === roleInfo.roleId) {
      roleInfo.roleName = body.roleName;
      roleInfo.description = body.description;
      roleInfo.dialogInput = body.dialogInput;
      roleInfo.historyRecord = body.historyRecord;
      roleInfo.roleManage = body.roleManage;
      roleInfo.userManage = body.userManage;
    }
  });
  return res.json({ message: '更新成功', status: 'ok' });
}


export default {
  'GET /api/roles': getRoles,
  'GET /api/role/detail': getRoleDetail,
  'POST /api/role/detail': updateRoleDetail,
}
