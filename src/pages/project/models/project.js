import { queryProjectList, updateProjectStatus, deleteProjectList, exportResult } from '../service';
import { message } from 'antd/lib/index';

const Project = {
  namespace: 'project',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    * fetchProject({ payload }, { call, put }) {
      const response = yield call(queryProjectList, payload);
      yield put({
        type: 'project',
        payload: response,
      });
    },

    * updateProjectStatus({ payload, callback }, { call }) {
      const response = yield call(updateProjectStatus, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * deleteProject({ payload, callback }, { call, put }) {
      const response = yield call(deleteProjectList, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryProjectList);
        yield put({
          type: 'project',
          payload: result,
        });
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * exportResult({ payload, callback }, { call }) {
      const response = yield call(exportResult, payload);
      if (callback) {
        callback(response);
      }
    },
  },

  reducers: {
    project(state, action) {
      const { list, pagination } = action.payload;
      return { ...state, data: { list, pagination } };
    },
  },
};

export default Project;
