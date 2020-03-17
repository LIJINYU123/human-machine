import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/projects', {
    params,
  });
}

export async function deleteProjectList(params) {
  return request('/api/projects', {
    method: 'DELETE',
    data: params,
  })
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

export async function queryMembers() {
  return request('/api/project/members');
}

export async function queryDefaultTemplate(params) {
  return request('/api/project/default-templates', {
    params,
  });
}

export async function deleteTaskData(params) {
  return request('/api/project/task-data', {
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
