import { queryProjectList, deleteProjectList } from '../service';
import { message } from 'antd/lib/index';

const TextProject = {
  namespace: 'textProject',
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
  },

  reducers: {
    project(state, action) {
      const { list, pagination } = action.payload;
      return { ...state, data: { list, pagination } };
    },
  },
};

export default TextProject;
