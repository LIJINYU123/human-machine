import { queryTaskList } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'textTaskList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    * fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTaskList, payload);
      yield put({
        type: 'task',
        payload: response,
      });
    },
  },

  reducers: {
    task(state, action) {
      return { ...state, data: action.payload };
    },
  },
};

export default Model;
