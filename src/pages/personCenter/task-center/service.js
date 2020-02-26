import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/task-center/projects', {
    params,
  });
}

// 项目详情页api
export async function queryProjectDetail(projectId) {
  return request(`/api/project/detail/${projectId}`);
}

export async function queryTaskData(params) {
  return request('/api/project/task-data', {
    params,
  });
}
