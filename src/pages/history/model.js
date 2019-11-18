import { queryRecord, deleteRecord } from './service'

const Model = {
  namespace: 'historyRecordList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * delete({ payload, callback }, { call, put }) {
      const response = yield call(deleteRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
      if (callback) callback();
    },
  },
};

export default Model;
