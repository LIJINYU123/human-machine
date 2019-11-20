import request from '@/utils/request';

export async function queryRecord(params) {
  return request('/api/record', {
    params,
  });
}

export async function queryDetailInfo(params) {
  return request('/api/detail/info', {
    params,
  })
}

export async function deleteRecord(params) {
  return request('/api/record', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function queryEditors() {
  return request('/api/query/editors');
}
