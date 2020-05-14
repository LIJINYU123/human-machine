import request from '@/utils/request';

export async function queryTemplateList(params) {
  return request('/api/templates', {
    params,
  });
}

export async function deleteTemplateList(params) {
  return request('/api/templates', {
    method: 'DELETE',
    data: params,
  });
}

export async function createTemplate(params) {
  return request('/api/templates', {
    method: 'PUT',
    data: params,
  });
}

export async function updateTemplate(params) {
  return request('/api/templates', {
    method: 'POST',
    data: params,
  });
}
