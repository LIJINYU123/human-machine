import request from '@/utils/request';

// 查询个人基本信息
export async function queryUserInfo(params) {
  return request('/api/person-center/profile/basic-info', { params });
}

// 查询个人数据统计
export async function queryUserStatistics(params) {
  return request('/api/person-center/profile/statistics', { params });
}

// 修改个人基本信息
export async function modifyUserInfo(params) {
  return request('/api/person-center/profile/basic-info', {
    method: 'POST',
    data: params,
  });
}
