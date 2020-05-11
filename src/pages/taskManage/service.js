import request from '@/utils/request';

export async function queryProjectList(params) {
  return request('/api/task-manage/projects', {
    params,
  });
}

// 项目详情页api
export async function queryProjectDetail(projectId) {
  return request(`/api/project/detail/${projectId}`);
}

export async function queryTaskData(params) {
  return request('/api/task-manage/task-data', {
    params,
  });
}

// 任务中心api
export async function receiveTask(taskId) {
  return request(`/api/task-manage/receive-task/${taskId}`);
}

export async function queryMyTask(params) {
  return request('/api/task-manage/my-task', {
    params,
  });
}

export async function queryTaskNumber() {
  return request('/api/task-manage/task-number');
}

// 文本标注页面api
export async function queryLabelData(params) {
  return request('/api/text-project/label-data', {
    params,
  });
}

export async function queryMarkTool(params) {
  return request('/api/task-manage/mark-tool', {
    params,
  });
}

export async function saveTextMarkResult(params) {
  return request('/api/text-project/label-result', {
    method: 'POST',
    data: params,
  });
}

export async function saveReviewResult(params) {
  return request('/api/project/review-result', {
    method: 'POST',
    data: params,
  });
}

export async function deleteTextMarkResult(params) {
  return request('/api/text-project/label-result', {
    method: 'DELETE',
    data: params,
  });
}

export async function queryOneTextQuestion(params) {
  return request('/api/text-project/one-question', {
    params,
  });
}

export async function queryNextTextQuestion(params) {
  return request('/api/text-project/next-question', {
    method: 'POST',
    data: params,
  });
}

export async function queryPrevTextQuestion(params) {
  return request('/api/text-project/prev-question', {
    method: 'POST',
    data: params,
  })
}
