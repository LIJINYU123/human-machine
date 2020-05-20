function getFakeCaptcha(req, res) {
  return res.json('captcha-xxx');
} // 代码中会兼容本地 service mock 以及部署站点的静态数据

function getCurrentUser(req, res) {
  const userId = req.get('UserID');
  if (userId === 'SYECO') {
    res.json(
      {
        name: 'SYECO',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 'SYECO',
        unreadCount: 8,
        notifyCount: 9,
      });
  } else if (userId === 'SYADMIN') {
    res.json(
      {
        name: 'SYADMIN',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 'SYDEV',
        unreadCount: 8,
        notifyCount: 9,
      });
  } else if (userId === 'SY001') {
    res.json(
      {
        name: 'SY001',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 'SY001',
        unreadCount: 8,
        notifyCount: 9,
      });
  } else if (userId === 'SY002') {
    res.json(
      {
        name: 'SY002',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 'SY002',
        unreadCount: 8,
        notifyCount: 9,
      });
  } else if (userId === 'SY003') {
    res.json(
      {
        name: 'SY003',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 'SY003',
        unreadCount: 8,
        notifyCount: 9,
      });
  } else {
    res.json(
      {
        name: '李锦宇',
        avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
        userId: 'SY0111',
        unreadCount: 8,
        notifyCount: 9,
      });
  }
}

export default {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': getCurrentUser,
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
      SYADMIN: [
        {
          path: '/project',
          name: '项目管理',
          icon: 'project',
          component: './project',
        },
        {
          name: '项目详情页',
          icon: 'container',
          path: '/project/detail',
          component: './project/component/ProjectDetail',
          hideInMenu: true,
        },
        {
          name: '任务详情页',
          icon: 'container',
          path: '/project/task-detail',
          component: './project/component/TaskDetail',
          hideInMenu: true,
        },
        {
          path: '/template',
          name: '标注模板管理',
          icon: 'tool',
          component: './template',
        },
        {
          name: '机构管理',
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
          name: '组别详情',
          icon: 'container',
          path: '/agency/account/group-detail',
          component: './account/components/GroupDetail',
          hideInMenu: true,
        },
        {
          name: '角色管理',
          icon: 'team',
          path: '/agency/role',
          component: './role',
        },
        {
          name: '任务管理',
          icon: 'schedule',
          path: '/task-manage',
          component: './taskManage',
        },
        {
          name: '项目详情页',
          icon: 'container',
          path: '/task-manage/project-detail',
          component: './taskManage/component/ProjectDetail',
          hideInMenu: true,
        },
        {
          name: '我的任务',
          icon: 'container',
          path: '/task-manage/my-task',
          component: './taskManage/component/MyTaskView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/text-mark',
          component: './taskManage/component/TextMarkView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/sequence-mark',
          component: './taskManage/component/SequenceMarkView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/extension-mark',
          component: './taskManage/component/ExtensionMarkView',
          hideInMenu: true,
        },
        {
          name: '图片标注',
          icon: 'container',
          path: '/task-manage/my-task/image-mark',
          component: './taskManage/component/ImageMarkView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/classify',
          component: './taskManage/component/ClassifyAnswerView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/sequence',
          component: './taskManage/component/SequenceAnswerView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/extension',
          component: './taskManage/component/ExtensionAnswerView',
          hideInMenu: true,
        },
        {
          name: '图片标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/image',
          component: './taskManage/component/ImageAnswerView',
          hideInMenu: true,
        },
        {
          name: '个人中心',
          icon: 'profile',
          path: '/person',
          children: [
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/profile',
              component: './personCenter/profile',
            },
            {
              name: '机构信息',
              icon: 'book',
              path: '/person/agency',
              component: './personCenter/agency',
            },
            {
              name: '团队信息',
              icon: 'book',
              path: '/person/team',
              component: './personCenter/team',
            },
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/team/member',
              component: './personCenter/team/components/MemberProfile',
              hideInMenu: true,
            },
          ],
        },
      ],
      SYECO: [
        {
          path: '/project',
          name: '项目管理',
          icon: 'project',
          component: './project',
        },
        {
          name: '项目详情页',
          icon: 'container',
          path: '/project/detail',
          component: './project/component/ProjectDetail',
          hideInMenu: true,
        },
        {
          name: '任务详情页',
          icon: 'container',
          path: '/project/task-detail',
          component: './project/component/TaskDetail',
          hideInMenu: true,
        },
        {
          path: '/template',
          name: '标注模板管理',
          icon: 'tool',
          component: './template',
        },
        {
          name: '用户管理',
          icon: 'user',
          path: '/agency/account',
          component: './account',
        },
        {
          name: '组别详情',
          icon: 'container',
          path: '/agency/account/group-detail',
          component: './account/components/GroupDetail',
          hideInMenu: true,
        },
        {
          name: '角色管理',
          icon: 'team',
          path: '/agency/role',
          component: './role',
        },
        {
          name: '任务管理',
          icon: 'schedule',
          path: '/task-manage',
          component: './taskManage',
        },
        {
          name: '项目详情页',
          icon: 'container',
          path: '/task-manage/project-detail',
          component: './taskManage/component/ProjectDetail',
          hideInMenu: true,
        },
        {
          name: '我的任务',
          icon: 'container',
          path: '/task-manage/my-task',
          component: './taskManage/component/MyTaskView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/text-mark',
          component: './taskManage/component/TextMarkView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/sequence-mark',
          component: './taskManage/component/SequenceMarkView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/extension-mark',
          component: './taskManage/component/ExtensionMarkView',
          hideInMenu: true,
        },
        {
          name: '图片标注',
          icon: 'container',
          path: '/task-manage/my-task/image-mark',
          component: './taskManage/component/ImageMarkView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/classify',
          component: './taskManage/component/ClassifyAnswerView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/sequence',
          component: './taskManage/component/SequenceAnswerView',
          hideInMenu: true,
        },
        {
          name: '文本标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/extension',
          component: './taskManage/component/ExtensionAnswerView',
          hideInMenu: true,
        },
        {
          name: '图片标注',
          icon: 'container',
          path: '/task-manage/my-task/answer-mode/image',
          component: './taskManage/component/ImageAnswerView',
          hideInMenu: true,
        },
        {
          name: '个人中心',
          icon: 'profile',
          path: '/person',
          children: [
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/profile',
              component: './personCenter/profile',
            },
            {
              name: '机构信息',
              icon: 'book',
              path: '/person/agency',
              component: './personCenter/agency',
            },
            {
              name: '团队信息',
              icon: 'book',
              path: '/person/team',
              component: './personCenter/team',
            },
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/team/member',
              component: './personCenter/team/components/MemberProfile',
              hideInMenu: true,
            },
          ],
        },
      ],
      SY001: [
        {
          path: '/project',
          name: '项目管理',
          icon: 'project',
          component: './project',
        },
        {
          path: '/template',
          name: '标注模板管理',
          icon: 'tool',
          component: './template',
        },
        {
          name: '个人中心',
          icon: 'profile',
          path: '/person',
          children: [
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/profile',
              component: './personCenter/profile',
            },
          ],
        },
      ],
      SY002: [
        {
          name: '任务管理',
          icon: 'schedule',
          path: '/task-manage',
          component: './taskManage',
        },
        {
          name: '个人中心',
          icon: 'profile',
          path: '/person',
          children: [
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/profile',
              component: './personCenter/profile',
            },
          ],
        },
      ],
      SY003: [
        {
          name: '任务管理',
          icon: 'schedule',
          path: '/task-manage',
          component: './taskManage',
        },
        {
          name: '个人中心',
          icon: 'profile',
          path: '/person',
          children: [
            {
              name: '个人资料',
              icon: 'book',
              path: '/person/profile',
              component: './personCenter/profile',
            },
          ],
        },
      ],
    };

    res.json(directory[userId]);
  },

  'POST /api/login/account': (req, res) => {
    const { userId } = req.body;

    if (userId === 'SYADMIN') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SYADMIN');
      res.header('DepartmentId', 'operation');
      res.header('Privileges', JSON.stringify({
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
        dataMark: ['mark', 'review'],
      }));
      res.header('RoleID', 'superAdmin');
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'superAdmin',
      });
    } else if (userId === 'SYECO') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SYECO');
      res.header('DepartmentId', 'operation');
      res.header('Privileges', JSON.stringify({
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
        dataMark: ['mark', 'review'],
      }));
      res.header('RoleID', 'depAdmin');
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'depAdmin',
      });
    } else if (userId === 'SY001') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SY001');
      res.header('DepartmentId', 'operation');
      res.header('Privileges', JSON.stringify({
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
        dataMark: ['mark', 'review'],
      }));
      res.header('RoleID', 'projectManager');
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'projectManager',
      });
    } else if (userId === 'SY002') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SY002');
      res.header('DepartmentId', 'operation');
      res.header('Privileges', JSON.stringify({
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
        dataMark: ['mark'],
      }));
      res.header('RoleID', 'labeler');
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'labeler',
      });
    } else if (userId === 'SY003') {
      res.header(
        'Authorization',
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHBpcmUiOjE1NzUwMzkzMjQsInVzZXJuYW1lIjoiYWRtaW4ifQ.eqcIWCQO5z_dU1purEKr66VkMPC6q8WEn4h2DEquOkA',
      );
      res.header('UserID', 'SY003');
      res.header('DepartmentId', 'operation');
      res.header('Privileges', JSON.stringify({
        roleManage: ['add', 'modify', 'query', 'delete'],
        userManage: ['add', 'modify', 'query', 'delete'],
        dataMark: ['mark', 'review'],
      }));
      res.header('RoleID', 'inspector');
      res.send({
        status: 'ok',
        message: 'success',
        currentAuthority: 'inspector',
      });
    } else {
      res.send({
        status: 'error',
        message: '用户名或密码错误',
        currentAuthority: 'guest',
      });
    }
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
