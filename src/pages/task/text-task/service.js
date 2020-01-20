import request from '@/utils/request';

export async function queryTaskList(params) {
  return request('/api/text-tasks', {
    params,
  });
}

export async function deleteTaskList(params) {
  return request('/api/text-tasks', {
    method: 'DELETE',
    data: params,
  });
}

export async function queryMembers() {
  return request('/api/text-task/members');
}

export async function queryMarkTools() {
  return request('/api/text-task/marktools');
}

export async function queryTaskDetail(taskId) {
  return request(`/api/text-task/detail/${taskId}`);
}

export async function queryLabelData(params) {
  return request('/api/text-task/label-data', {
    params,
  });
}
