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

// 项目详情页api
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

// 任务详情页api
export async function queryTaskDetail(taskId) {
  return request(`/api/text-project/task-detail/${taskId}`);
}

export async function queryLabelData(params) {
  return request('/api/text-project/label-data', {
    params,
  });
}

export async function deleteLabelData(params) {
  return request('/api/text-project/label-data', {
    method: 'DELETE',
    data: params,
  });
}

// 创建项目api
export async function queryMarkTools(params) {
  return request('/api/text-project/marktools', {
    params,
  });
}
