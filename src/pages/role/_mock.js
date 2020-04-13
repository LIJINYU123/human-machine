import moment from 'moment';
import { parse } from "url";

let mockData = [
  {
    roleId: 'administrator',
    roleName: '管理员',
    createdTime: '2019-12-26 00:00:00',
    updatedTime: '2019-12-26 00:00:00',
    description: '这是管理员的描述',
    privileges: {
      projectManage: ['add', 'modify', 'query', 'delete'],
      dataMark: ['mark', 'review'],
      roleManage: ['add', 'modify', 'query', 'delete'],
      userManage: ['add', 'modify', 'query', 'delete'],
    },
  },
  {
    roleId: 'projectAdmin',
    roleName: '项目管理员',
    createdTime: '2019-12-25 00:00:00',
    updatedTime: '2019-12-25 00:00:00',
    description: '这是项目管理员的描述',
    privileges: {
      projectManage: ['add', 'modify', 'query', 'delete'],
      dataMark: [],
      roleManage: [],
      userManage: [],
    },
  },
  {
    roleId: 'labeler',
    roleName: '标注员',
    createdTime: '2020-03-04 10:00:00',
    updatedTime: '2020-03-04 10:00:00',
    description: '这是标注员的描述',
    privileges: {
      projectManage: [],
      dataMark: ['mark'],
      roleManage: [],
      userManage: [],
    },
  },
  {
    roleId: 'inspector',
    roleName: '质检员',
    createdTime: '2020-03-03 10:00:00',
    updatedTime: '2020-03-03 10:00:00',
    description: '这是质检员的描述',
    privileges: {
      projectManage: [],
      dataMark: ['review'],
      roleManage: [],
      userManage: [],
    },
  },
];

function getRoles(req, res, u) {
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

  return res.json(dataSource);
}

function deleteRole(req, res, u, b) {
  const body = (b && b.body) || req.body;
  mockData = mockData.filter(item => item.roleId !== body.roleId);
  return res.json({ message: '删除成功', status: 'ok' });
}

function createRole(req, res, u, b) {
  const body = (b && b.body) || req.body;
  body.createdTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
  body.updatedTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
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
      roleInfo.updatedTime = moment().locale('zh-cn').format('YYYY-MM-DD HH:mm:ss');
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
