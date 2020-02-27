import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/task-center/projects', {
    params,
  });
}

// 项目详情页api
export async function queryProjectDetail(projectId) {
  return request(`/api/project/detail/${projectId}`);
}

export async function queryTaskData(params) {
  return request('/api/task-center/task-data', {
    params,
  });
}

// 任务中心api
export async function receiveTask(taskId) {
  return request(`/api/task-center/receive-task/${taskId}`);
}

export async function queryMyTask(params) {
  return request('/api/task-center/my-task', {
    params,
  });
}

// 文本标注页面api
export async function queryLabelData(params) {
  return request('/api/text-project/label-data', {
    params,
  });
}
