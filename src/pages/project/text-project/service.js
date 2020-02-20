import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/text-projects', {
    params,
  });
}

export async function deleteProjectList(params) {
  return request('/api/text-projects', {
    method: 'DELETE',
    data: params,
  })
}

export async function queryProjectDetail(projectId) {
  return request(`/api/text-project/detail/${projectId}`);
}

export async function queryTaskData(params) {
  return request('/api/text-project/task-data', {
    params,
  });
}

export async function deleteTaskData(params) {
  return request('/api/text-project/task-data', {
    method: 'DELETE',
    data: params,
  });
}
