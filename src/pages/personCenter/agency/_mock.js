
const agencyInfo = {
  agencyName: '科沃斯',
  agencyType: 'operationCenter',
  privilege: ['textClassify', 'pictureMark'],
};


function queryAgencyInfo(req, res) {
  return res.json(agencyInfo);
}


export default {
  'GET /api/person-center/agency/basic-info': queryAgencyInfo,
}
