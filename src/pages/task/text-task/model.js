import { queryTaskList } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'textTaskList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    labelers: [],
    current: 0,
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
      const { list, paginatioin, labelers } = action.payload;
      return { ...state, data: { list, paginatioin }, labelers };
    },
  },
};

export default Model;
