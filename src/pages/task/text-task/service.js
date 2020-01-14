import request from '@/utils/request';

export async function queryTaskList(params) {
  return request('/api/text-tasks', {
    params,
  });
}
