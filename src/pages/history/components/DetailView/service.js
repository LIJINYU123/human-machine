import request from '@/utils/request';

export async function fakeDetailViewForm(params) {
  return request('/api/detailview/form', {
    method: 'POST',
    data: params,
  });
}
