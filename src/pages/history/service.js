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

export async function exportRecord(params) {
  return request('/api/export', {
    method: 'POST',
    data: params,
  })
}

export async function queryEditors() {
  return request('/api/editors');
}

export async function fakeDetailViewForm(params) {
  return request('/api/detailview/form', {
    method: 'POST',
    data: params,
  });
}
