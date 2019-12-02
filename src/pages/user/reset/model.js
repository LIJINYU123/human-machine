import { fakeResetPassword } from './service';

const Model = {
  namespace: 'resetPassword',
  state: {
    status: undefined,
    message: undefined,
  },
  effects: {
    *submit({ payload, callback }, { call, put }) {
      const response = yield call(fakeResetPassword, payload);
      yield put({
        type: 'resetPassHandle',
        payload: response,
      });

      if (callback) {
        callback();
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
