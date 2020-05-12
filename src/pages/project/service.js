import request from '@/utils/request';

// 查询项目列表
export async function queryProjectList(params) {
  return request('/api/projects', {
    params,
  });
}

// 删除项目列表
export async function deleteProjectList(params) {
  return request('/api/projects', {
    method: 'DELETE',
    data: params,
  })
}

// 项目详情页api
export async function queryProjectDetail(projectId) {
  return request(`/api/project/detail/${projectId}`);
}

// 项目详情页显示的任务列表
export async function queryTaskData(params) {
  return request('/api/project/task-data', {
    params,
  });
}

// 项目详情页显示的人员列表
export async function queryMemberData(params) {
  return request('/api/project/member-data', {
    params,
  });
}

// 创建项目第一步获取标注员和质检员名单
export async function queryMembers() {
  return request('/api/project/members');
}

// 创建项目第四步获取预标注数据
export async function queryPreLabelData(params) {
  return request('/api/project/pre-label-data', {
    params,
  });
}

// 保存创建项目第一步的数据
export async function saveStepOneData(params) {
  return request('/api/project/step-one', {
    method: 'PUT',
    data: params,
  });
}

// 保存创建项目第二步的数据
export async function saveStepTwoData(params) {
  return request('/api/project/step-two', {
    method: 'POST',
    data: params,
  });
}

export async function saveStepFourData(params) {
  return request('/api/project/step-four', {
    method: 'POST',
    data: params,
  });
}

export async function queryDefaultTemplate(params) {
  return request('/api/project/default-templates', {
    params,
  });
}

export async function deleteTaskData(params) {
  return request('/api/project/task-data', {
    method: 'DELETE',
    data: params,
  });
}

// 任务详情页api
export async function queryTaskDetail(taskId) {
  return request(`/api/project/task-detail/${taskId}`);
}

export async function queryLabelData(params) {
  return request('/api/project/label-data', {
    params,
  });
}

export async function deleteLabelData(params) {
  return request('/api/project/label-data', {
    method: 'DELETE',
    data: params,
  });
}
