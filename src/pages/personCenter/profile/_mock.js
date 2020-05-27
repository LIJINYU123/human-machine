import ItemData from './map';
import { parse } from 'url';

const { ProjectManage, Labeler, Inspector } = ItemData;

const mockData = [
  {
    userId: 'SYECO',
    userName: 'SYECO',
    roleId: 'depAdmin',
    roleName: '机构管理员',
    status: 'active',
  },
];

const projectManageData = {
  ownProjectNum: 5,
  delayProjectNum: 1,
  delayRate: 20,
  delayInfos: [
    {
      delayTime: '一周内',
      delayProjectNum: 3,
      delayRate: 10,
    },
    {
      delayTime: '半月内',
      delayProjectNum: 2,
      delayRate: 30,
    },
    {
      delayTime: '一月内',
      delayProjectNum: 3,
      delayRate: 20,
    },
    {
      delayTime: '一月以上',
      delayProjectNum: 3,
      delayRate: 10,
    },
  ],
};

const labelerData = {
  involvedProjectNum: 5,
  completeTaskNum: 20,
  markQuestionNum: 1000,
  rejectInfos: [
    {
      rejectNum: 1,
      rejectTaskNum: 10,
      rejectRate: 10,
    },
    {
      rejectNum: 2,
      rejectTaskNum: 5,
      rejectRate: 5,
    },
    {
      rejectNum: 3,
      rejectTaskNum: 20,
      rejectRate: 10,
    },
    {
      rejectNum: 4,
      rejectTaskNum: 10,
      rejectRate: 10,
    },
  ],
};

const inspectorData = {
  involvedProjectNum: 10,
  completeTaskNum: 30,
  reviewQuestionNum: 500,
  requireCheckRate: 20.5,
  actualCheckRate: 25,
};


function queryUserBasicInfo(req, res) {
  const { url } = req;
  console.log(url);
  const params = parse(url, true).query;

  const filterData = mockData.filter(item => item.userId === params.userId);
  if (filterData.length > 0) {
    return res.json(filterData[0]);
  }
  return res.json(mockData[0]);
}

function modifyUserBasicInfo(req, res) {
  const { body } = req;
  mockData.forEach(item => {
    if (item.userId === body.userId) {
      item.userName = body.userName;
    }
  });
  return res.json({ status: 'ok', message: '修改成功' });
}


function queryUserStatistics(req, res, u) {
  // const userId = req.get('UserID');
  let url = u;
  if (!url || Object.prototype.toString.call(url) !== '[object String]') {
    // eslint-disable-next-line prefer-destructuring
    url = req.url
  }

  const params = parse(url, true).query;

  if (params.roleId === ProjectManage) {
    return res.json({ status: 'ok', message: 'success', response: projectManageData });
  }

  if (params.roleId === Labeler) {
    return res.json({ status: 'ok', message: 'success', response: labelerData });
  }

  if (params.roleId === Inspector) {
    return res.json({ status: 'ok', message: 'success', response: inspectorData });
  }
  return res.json({ status: 'ok', message: 'success', response: projectManageData });
}


export default {
  'GET /api/person-center/profile/basic-info': queryUserBasicInfo,
  'GET /api/person-center/profile/statistics': queryUserStatistics,
  'POST /api/person-center/profile/basic-info': modifyUserBasicInfo,
}
