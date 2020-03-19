import request from '@/utils/request';

export async function queryTemplateList(params) {
  return request('/api/project/default-templates', {
    params,
  });
}
