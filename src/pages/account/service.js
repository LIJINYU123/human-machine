import request from '@/utils/request';

export async function queryUserList(params) {
  return request('/api/users', {
    params,
  });
}

export async function deleteUser(params) {
  return request('/api/users', {
    method: 'DELETE',
    data: params,
  });
}

export async function queryUserDetail(params) {
  return request('/api/user/detail', {
    params,
  });
}

export async function updateUserDetail(params) {
  return request('/api/user/detail', {
    method: 'POST',
    data: params,
  });
}

export async function queryRoleList() {
  return request('/api/roles');
}

// 组别管理相关接口
export async function queryGroupList(params) {
  return request('/api/groups', {
    params,
  });
}
