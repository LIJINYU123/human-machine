import request from '@/utils/request'

export async function fakeResetPassword(params) {
  return request('/api/reset/password', {
    method: 'POST',
    data: params,
  });
}
