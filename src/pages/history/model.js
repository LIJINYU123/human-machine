import { queryRecord, deleteRecord, queryEditors, queryDetailInfo } from './service'

const Model = {
  namespace: 'historyRecordList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    editors: [],
    detailInfo: {},
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

    *fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryDetailInfo, payload);
      yield put({
        type: 'saveDetail',
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
    saveDetail(state, action) {
      return { ...state, detailInfo: action.payload };
    },
  },
};

export default Model;
