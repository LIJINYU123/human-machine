import request from '@/utils/request';

export async function queryDepList() {
  return request('/api/department');
}

export async function createDepartment(params) {
  return request('/api/department', {
    method: 'PUT',
    data: params,
  });
}

export async function queryNoDepAccounts() {
  return request('/api/no-dep-accounts');
}

export async function deleteDepartment(params) {
  return request('/api/department', {
    method: 'DELETE',
    data: params,
  });
}

export async function updateDepartment(params) {
  return request('/api/department', {
    method: 'POST',
    data: params,
  });
}
