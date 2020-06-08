import { queryDepList, createDepartment, queryNoDepAccounts, deleteDepartment, updateDepartment } from './service';
import { message } from 'antd';


const Model = {
  namespace: 'departmentList',
  state: {
    data: [],
    accounts: [],
  },
  effects: {
    * fetchDepartment({ payload }, { call, put }) {
      const response = yield call(queryDepList, payload);
      yield put({
        type: 'department',
        payload: response,
      });
    },

    * createDepartment({ payload, callback }, { call }) {
      const response = yield call(createDepartment, payload);
      if (response.status) {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    * fetchNoDepAccounts(_, { call, put }) {
      const response = yield call(queryNoDepAccounts);
      yield put({
        type: 'saveAccounts',
        payload: response,
      });
    },

    * deleteDepartment({ payload, callback }, { call, put }) {
      const response = yield call(deleteDepartment, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryDepList);
        yield put({
          type: 'department',
          payload: result,
        });
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * updateDepartment({ payload, callback }, { call }) {
      const response = yield call(updateDepartment, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },
  },
  reducers: {
    department(state, action) {
      return { ...state, data: action.payload }
    },
    saveAccounts(state, action) {
      return { ...state, accounts: action.payload }
    },
  },
};

export default Model;
