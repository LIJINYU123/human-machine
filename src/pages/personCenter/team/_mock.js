import Mock from 'mockjs';


const mockData = {
  projectManagers: [
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      ownProjectNum: 15,
      delayProjectNum: 2,
      delayRate: 20,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      ownProjectNum: 10,
      delayProjectNum: 1,
      delayRate: 5,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      ownProjectNum: 30,
      delayProjectNum: 3,
      delayRate: 3,
    },
  ],
  labelers: [
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 5,
      completeTaskNum: 20,
      rejectTaskNum: 3,
      rejectRate: 15,
      averageRejectTime: 2.1,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 10,
      completeTaskNum: 40,
      rejectTaskNum: 3,
      rejectRate: 7,
      averageRejectTime: 3,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 8,
      completeTaskNum: 16,
      rejectTaskNum: 2,
      rejectRate: 1.2,
      averageRejectTime: 3,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 20,
      completeTaskNum: 60,
      rejectTaskNum: 15,
      rejectRate: 2.5,
      averageRejectTime: 3,
    },
  ],
  inspectors: [
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 10,
      completeTaskNum: 30,
      requireCheckRate: 20.5,
      actualCheckRate: 25,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 15,
      completeTaskNum: 60,
      requireCheckRate: 15,
      actualCheckRate: 16,
    },
    {
      userId: Mock.Random.string('lower', 5),
      userName: Mock.Random.cname(),
      involvedProjectNum: 20,
      completeTaskNum: 30,
      requireCheckRate: 13,
      actualCheckRate: 16,
    },
  ],
};


function queryTeamMemberInfo(req, res) {
  return res.json(mockData);
}

export default {
  'GET /api/person-center/team/member-info': queryTeamMemberInfo,
};
