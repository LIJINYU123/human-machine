import request from '@/utils/request';

export async function queryTaskList(params) {
  return request('/api/text-tasks', {
    params,
  });
}

export async function queryMembers() {
  return request('/api/text-task/members');
}

export async function queryMarkTools() {
  return request('/api/text-task/marktools');
}
