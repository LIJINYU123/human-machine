import request from '@/utils/request';

export async function queryRoleList() {
  return request('/api/roles');
}

export async function deleteRole(params) {
  return request('/api/roles', {
    method: 'DELETE',
    data: params,
  })
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
