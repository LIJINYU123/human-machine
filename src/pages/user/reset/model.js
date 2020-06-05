import { fakeResetPassword } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'resetPassword',
  state: {
    status: undefined,
    message: undefined,
  },
  effects: {
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(fakeResetPassword, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'resetPassHandle',
          payload: response,
        });

        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    resetPassHandle(state, { payload }) {
      return { ...state, status: payload.status, message: payload.message };
    },
  },
};

export default Model;
