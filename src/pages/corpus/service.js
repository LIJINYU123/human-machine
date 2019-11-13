import request from '@/utils/request';

export async function fakeSubmitForm(params) {
  return request('/api/corpus/forms', {
      method: 'POST',
      data: params,
    });
}
