import request from '@/utils/request';

export async function queryTemplateList(params) {
  return request('/api/project/default-templates', {
    params,
  });
}

export async function deleteTemplateList(params) {
  return request('/api/project/default-templates', {
    method: 'DELETE',
    data: params,
  });
}
