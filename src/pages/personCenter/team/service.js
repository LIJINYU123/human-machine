import request from '@/utils/request';


export async function queryTeamInfo() {
  return request('/api/person-center/team/member-info');
}
