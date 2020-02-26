import { queryProjectList } from '../service';

const TaskCenter = {
  namespace: 'taskCenter',
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
  },

  reducers: {
    project(state, action) {
      const { list, pagination } = action.payload;
      return { ...state, data: { list, pagination } };
    },
  },
};

export default TaskCenter;
