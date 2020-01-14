function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
} // 代码中会兼容本地 service mock 以及部署站点的静态数据

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: '李锦宇',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: 'SY0111',
    unreadCount: 8,
    notifyCount: 9,
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],

  'GET /api/directory': (req, res) => {
    const userId = req.header('UserID');
    const directory = {
      SYECO: [
        {
          path: '/',
          redirect: '/corpus',
        },
        {
          path: '/corpus',
          name: '对话录入',
          icon: 'form',
          component: './corpus',
        },
        {
          path: '/history',
          name: '历史记录',
          icon: 'history',
          component: './history',
        },
        {
          path: '/task/text-task',
          name: '任务管理',
          icon: 'schedule',
          component: './task/text-task',
        },
        {
          name: '部门管理',
          icon: 'audit',
          path: '/agency/department',
          component: './department',
        },
        {
          name: '用户管理',
          icon: 'user',
          path: '/agency/account',
          component: './account',
        },
        {
          name: '角色管理',
          icon: 'team',
          path: '/agency/role',
          component: './role',
        },
      ],
      SYDEV: [
        {
          path: '/',
          redirect: '/corpus',
        },
        {
          path: '/corpus',
          name: '对话录入',
          icon: 'form',
          component: './corpus',
        },
        {
          path: '/history',
          name: '历史记录',
          icon: 'history',
          component: './history',
        },
      ],
    };

    res.json(directory[userId]);
  },

  'POST /api/login/account': (req, res) => {
    const { userName } = req.body;

    if (userName === 'SYECO') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SYECO');
      res.header('DepartmentId', 'operation');
      res.header('Privileges', JSON.stringify({
        dialogInput: ['add'],
        historyRecord: ['modify', 'query', 'delete', 'export'],
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
      }));
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'superAdmin',
      });
      return;
    }

    if (userName === 'SYDEV') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SYDEV');
      res.header('DepartmentId', 'development');
      res.header('Privileges', JSON.stringify({
        dialogInput: ['add'],
        historyRecord: ['modify', 'query', 'delete'],
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
      }));
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'superAdmin',
      });
      return;
    }

    res.send({
      status: 'error',
      message: '用户名或密码错误',
      currentAuthority: 'guest',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({
      status: 'ok',
      message: 'success',
      currentAuthority: 'admin',
    });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET  /api/login/captcha': getFakeCaptcha,
};
