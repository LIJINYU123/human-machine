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
export async function receiveTask(projectId) {
  return request(`/api/task-manage/receive-task/${projectId}`);
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
  return request('/api/project/label-data', {
    params,
  });
}

export async function queryMarkTool(params) {
  return request('/api/task-manage/mark-tool', {
    params,
  });
}

export async function saveTextMarkResult(params) {
  return request('/api/project/label-result', {
    method: 'POST',
    data: params,
  });
}

export async function saveDataValidity(params) {
  return request('/api/project/data-validity', {
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

export async function updateStatus(params) {
  return request('/api/task-manage/task-status', {
    method: 'POST',
    data: params,
  });
}

export async function deleteTextMarkResult(params) {
  return request('/api/project/label-result', {
    method: 'DELETE',
    data: params,
  });
}

export async function queryTaskSchedule(params) {
  return request('/api/project/task-schedule', {
    params,
  })
}

export async function queryOneTextQuestion(params) {
  return request('/api/task-manage/one-question', {
    params,
  });
}

export async function queryNextTextQuestion(params) {
  return request('/api/task-manage/next-question', {
    method: 'POST',
    data: params,
  });
}

export async function queryPrevTextQuestion(params) {
  return request('/api/task-manage/prev-question', {
    method: 'POST',
    data: params,
  })
}
