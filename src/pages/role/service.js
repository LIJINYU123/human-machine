import request from '@/utils/request';

export async function queryRoleList() {
  return request('/api/roles');
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
