import { queryProjectDetail, queryTaskData, receiveTask, queryMyTask } from '../service';
import { message } from 'antd';


const ProjectDetail = {
  namespace: 'detail',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    myTask: {
      list: [],
      pagiantion: {},
    },
    basicInfo: {},
    inProgressNum: 0,
    completeNum: 0,
  },
  effects: {
    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryProjectDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
    },

    * fetchTaskData({ payload }, { call, put }) {
      const response = yield call(queryTaskData, payload);
      yield put({
        type: 'taskData',
        payload: response,
      });
    },

    * fetchMyTask({ payload }, { call, put }) {
      const response = yield call(queryMyTask, payload);
      yield put({
        type: 'saveMyData',
        payload: response,
      });
    },

    * receiveTask({ payload }, { call, put }) {
      const response = yield call(receiveTask, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryTaskData);
        yield put({
          type: 'taskData',
          payload: result,
        });
      } else {
        message.error(response.message);
      }
    },
  },

  reducers: {
    detail(state, action) {
      return { ...state, basicInfo: action.payload };
    },
    taskData(state, action) {
      const response = action.payload;
      const list = response.list.map(item => ({ projectId: item.projectId, taskId: item.taskId, taskName: item.taskName, status: item.status === 'initial' }));
      response.list = list;
      // eslint-disable-next-line max-len
      return { ...state, data: { list: response.list, pagination: response.pagination }, inProgressNum: response.inProgressNum, completeNum: response.completeNum };
    },
    saveMyData(state, action) {
      const response = action.payload;
      const dataSource = response.list;
      return { ...state, myTask: { list: response.list, pagination: response.pagination }, inProgressNum: dataSource.filter(item => ['labeling', 'reject'].includes(item.status)).length, completeNum: dataSource.filter(item => item.status === 'complete').length };
    },
  },
};

export default ProjectDetail;
