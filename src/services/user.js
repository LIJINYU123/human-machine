import request from '@/utils/request';

export async function query() {
  return request('/api/users');
}
export async function queryCurrent() {
  return request('/api/currentUser');
}
export async function queryNotices() {
  return request('/api/notices');
}

export async function queryDirectory() {
  return request('/api/directory');
}

export async function queryAgency() {
  return request('/api/department');
}
