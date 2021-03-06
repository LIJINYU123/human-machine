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

export async function updateUserStatus(params) {
  return request('/api/user/status', {
    method: 'POST',
    data: params,
  });
}

export async function resetPassword(params) {
  return request('/api/password/initial', {
    method: 'POST',
    data: params,
  });
}

export async function manualAddUsers(params) {
  return request('/api/user/manual-add', {
    method: 'PUT',
    data: params,
  });
}

export async function batchAddUsers(params) {
  return request('/api/user/batch-add', {
    method: 'PUT',
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

// 获取组别，包括为分组的用户
export async function queryUngroupedUserList() {
  return request('/api/ungrouped-users');
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
