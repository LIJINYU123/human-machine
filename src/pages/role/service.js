import request from '@/utils/request';

export async function queryRoleList(params) {
  return request('/api/roles', { params });
}

export async function deleteRole(params) {
  return request('/api/roles', {
    method: 'DELETE',
    data: params,
  });
}

export async function createRole(params) {
  return request('/api/roles', {
    method: 'PUT',
    data: params,
  });
}

export async function queryRoleDetail(params) {
  return request('/api/role/detail', { params });
}

export async function updateRoleDetail(params) {
  return request('/api/role/detail', {
    method: 'POST',
    data: params,
  });
}
