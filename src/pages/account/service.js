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

export async function addGroup(params) {
  return request('/api/groups', {
    method: 'PUT',
    data: params,
  });
}

export async function deleteGroup(params) {
  return request('/api/groups', {
    method: 'DELETE',
    data: params,
  });
}

export async function modifyGroup(params) {
  return request('/api/groups', {
    method: 'POST',
    data: params,
  });
}


// 组别详情相关接口
export async function queryUserInfo(params) {
  return request('/api/user-info', {
    params,
  });
}

export async function deleteUserInfo(params) {
  return request('/api/user-info', {
    method: 'DELETE',
    data: params,
  });
}
