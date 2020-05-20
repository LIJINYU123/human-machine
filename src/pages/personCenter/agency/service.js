import request from '@/utils/request';


export async function queryAgencyInfo() {
  return request('/api/person-center/agency/basic-info');
}
