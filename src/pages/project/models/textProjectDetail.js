import { queryProjectDetail, queryTaskData, deleteTaskData } from '../service';
import { message } from 'antd';

const TextProjectDetail = {
  namespace: 'textProjectDetail',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    basicInfo: {},
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

    * deleteTaskData({ payload, callback }, { call, put }) {
      const response = yield call(deleteTaskData, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryTaskData, { projectId: payload.projectId });
        yield put({
          type: 'taskData',
          payload: result,
        });
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },
  },

  reducers: {
    detail(state, action) {
      return { ...state, basicInfo: action.payload };
    },
    taskData(state, action) {
      return { ...state, data: action.payload };
    },
  },

};

export default TextProjectDetail;
