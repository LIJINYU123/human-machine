import { queryRecord, deleteRecord, exportRecord, queryEditors, queryDetailInfo, fakeDetailViewForm } from './service'
import { message } from 'antd';

const Model = {
  namespace: 'historyRecordList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    editors: [],
    detailInfo: {},
    key: undefined,
  },
  effects: {
    * fetch({ payload }, { call, put }) {
      const response = yield call(queryRecord, payload);
      yield put({
        type: 'save',
        payload: response,
      });
    },

    * fetchName(_, { call, put }) {
      const response = yield call(queryEditors);
      yield put({
        type: 'name',
        payload: response,
      });
    },

    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryDetailInfo, payload);
      response.key = payload.key;
      yield put({
        type: 'saveDetail',
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

    * export({ payload, callback }, { call, put }) {
      const response = yield call(exportRecord, payload);
      yield put({
        type: 'saveFile',
        payload: response,
      });
      if (callback) callback();
    },

    *submitDetailView({ payload }, { call }) {
      yield call(fakeDetailViewForm, payload);
      message.success('提交成功');
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
      const { key, ...rest } = action.payload;
      return { ...state, detailInfo: rest, key };
    },
    saveFile(state, action) {
      const link = document.createElement('a');
      link.style.display = 'none';
      const blob = new Blob([action.payload]);
      link.href = URL.createObjectURL(blob);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      return { ...state };
    },
  },
};

export default Model;
