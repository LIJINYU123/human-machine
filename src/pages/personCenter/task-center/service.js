import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/task-center/projects', {
    params,
  });
}
