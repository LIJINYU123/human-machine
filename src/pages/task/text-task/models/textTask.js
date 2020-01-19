import { queryTaskList, deleteTaskList } from '../service';
import { message } from 'antd/lib/index';

const TextTask = {
  namespace: 'textTask',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    labelers: [],
  },
  effects: {
    * fetchTask({ payload }, { call, put }) {
      const response = yield call(queryTaskList, payload);
      yield put({
        type: 'task',
        payload: response,
      });
    },

    * deleteTask({ payload, callback }, { call, put }) {
      const response = yield call(deleteTaskList, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryTaskList);
        yield put({
          type: 'task',
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
    task(state, action) {
      const { list, pagination, labelers } = action.payload;
      return { ...state, data: { list, pagination }, labelers };
    },
  },
};

export default TextTask;
