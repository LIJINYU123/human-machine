import { fakeRegister } from './service';

const Model = {
  namespace: 'userAndregister',
  state: {
    status: undefined,
    message: undefined,
  },
  effects: {
    * submit({ payload, callback }, { call, put }) {
      const response = yield call(fakeRegister, payload);
      yield put({
        type: 'registerHandle',
        payload: response,
      });

      if (callback) {
        callback()
      }
    },
  },
  reducers: {
    registerHandle(state, { payload }) {
      return { ...state, status: payload.status, message: payload.message };
    },
  },
};
export default Model;
