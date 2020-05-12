import defaultSettings from './defaultSettings'; // https://umijs.org/config/

import slash from 'slash2';
import webpackPlugin from './plugin.config';
const { pwa, primaryColor } = defaultSettings; // preview.pro.ant.design only do not use in your production ;
// preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。

const { ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION } = process.env;
const isAntDesignProPreview = ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION === 'site';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        // default false
        enable: true,
        // default zh-CN
        default: 'zh-CN',
        // default true, when it is true, will use `navigator.language` overwrite default
        baseNavigator: true,
      },
      // dynamicImport: {
      //   loadingComponent: './components/PageLoading/index',
      //   webpackChunkName: true,
      //   level: 3,
      // },
      pwa: pwa
        ? {
            workboxPluginMode: 'InjectManifest',
            workboxOptions: {
              importWorkboxFrom: 'local',
            },
          }
        : false, // default close dll, because issue https://github.com/ant-design/ant-design-pro/issues/4665
      // dll features https://webpack.js.org/plugins/dll-plugin/
      // dll: {
      //   include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
      //   exclude: ['@babel/runtime', 'netlify-lambda'],
      // },
    },
  ],
  [
    'umi-plugin-pro-block',
    {
      moveMock: false,
      moveService: false,
      modifyRequest: true,
      autoAddMenu: true,
    },
  ],
]; // 针对 preview.pro.ant.design 的 GA 统计代码

if (isAntDesignProPreview) {
  plugins.push([
    'umi-plugin-ga',
    {
      code: 'UA-72788897-6',
    },
  ]);
}

export default {
  plugins,
  block: {
    // 国内用户可以使用码云
    // defaultGitUrl: 'https://gitee.com/ant-design/pro-blocks',
    defaultGitUrl: 'https://github.com/ant-design/pro-blocks',
  },
  hash: true,
  targets: {
    ie: 11,
  },
  devtool: isAntDesignProPreview ? 'source-map' : false,
  // umi routes: https://umijs.org/zh/guide/router.html
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'register',
          path: '/user/register',
          component: './user/register',
        },
        {
          name: 'register-result',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'reset',
          path: '/user/reset',
          component: './user/reset',
        },
        {
          name: 'reset-result',
          path: '/user/reset-result',
          component: './user/reset-result',
        }
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/task-manage',
            },
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
              name: '项目详情页',
              icon: 'container',
              path: '/project/detail',
              component: './project/component/ProjectDetail',
              hideInMenu: true,
            },
            {
              name: '任务详情页',
              icon: 'container',
              path: '/project/text/task-detail',
              component: './project/component/TextTaskDetail',
              hideInMenu: true,
            },
            {
              name: 'department',
              icon: 'audit',
              path: '/agency/department',
              component: './department',
            },
            {
              name: 'user-manage',
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
              name: 'role',
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
            },
            {
              component: '404',
            },
          ],
        },
      ],
    },
  ],
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  define: {
    ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION:
      ANT_DESIGN_PRO_ONLY_DO_NOT_USE_IN_YOUR_PRODUCTION || '', // preview.pro.ant.design only do not use in your production ; preview.pro.ant.design 专用环境变量，请不要在你的项目中使用它。
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, _, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }

      const match = context.resourcePath.match(/src(.*)/);

      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());
        return `antd-pro${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },
  chainWebpack: webpackPlugin,
  /*
  proxy: {
    '/server/api/': {
      target: 'https://preview.pro.ant.design/',
      changeOrigin: true,
      pathRewrite: { '^/server': '' },
    },
  },
  */
};
