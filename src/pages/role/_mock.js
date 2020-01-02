import moment from 'moment';

let mockData = [
  {
    roleId: 'administrator',
    roleName: '管理员',
    createdTime: '2019-12-26 00:00:00',
    description: '这是管理员的描述',
    privileges: {
      dialogInput: ['add'],
      historyRecord: ['modify', 'query', 'delete'],
      roleManage: ['add', 'modify', 'query', 'delete'],
      userManage: ['add', 'modify', 'query', 'delete'],
    },
  },
  {
    roleId: 'user',
    roleName: '普通用户',
    createdTime: '2019-12-25 00:00:00',
    description: '这是普通用户的描述',
    privileges: {
      dialogInput: ['add'],
      historyRecord: ['query'],
      roleManage: [],
      userManage: [],
    },
  },
];

function getRoles(req, res) {
  return res.json(mockData);
}

function deleteRole(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData = mockData.filter(item => item.roleId !== body.roleId);
  return res.json({ message: '删除成功', status: 'ok' });
}

function createRole(req, res, u, b) {
  const body = (b && b.body) || req.body;
  body.createdTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  mockData.push(body);
  return res.json({ message: '创建成功', status: 'ok' });
}

function updateRoleDetail(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData.forEach(roleInfo => {
    if (body.roleId === roleInfo.roleId) {
      roleInfo.roleName = body.roleName;
      roleInfo.description = body.description;
      roleInfo.privileges = body.privileges;
    }
  });
  return res.json({ message: '更新成功', status: 'ok' });
}


export default {
  'GET /api/roles': getRoles,
  'DELETE /api/roles': deleteRole,
  'PUT /api/roles': createRole,
  'POST /api/role/detail': updateRoleDetail,
}
