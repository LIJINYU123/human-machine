import { queryRecord, deleteRecord, queryEditors } from './service'

const Model = {
  namespace: 'historyRecordList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    editors: [],
  },
  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(queryRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    *fetchName(_, { call, put }) {
      const response = yield call(queryEditors);
      yield put({
        type: 'name',
        payload: response,
      });
    },

    *delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
  reducers: {
    save(state, action) {
      return { ...state, data: action.payload };
    },
    name(state, action) {
      return { ...state, editors: action.payload };
    },
  },
};

export default Model;
