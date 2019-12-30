import { queryRoleList, queryRoleDetail, updateRoleDetail } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'roleList',
  state: {
    data: [],
    roleInfo: {},
    key: undefined,
  },
  effects: {
    * fetch(_, { call, put }) {
      const response = yield call(queryRoleList);
      yield put({
        type: 'role',
        payload: response,
      });
    },

    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryRoleDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
    },

    * updateDetail({ payload, callback }, { call, put }) {
      const response = yield call(updateRoleDetail, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryRoleList);
        yield put({
          type: 'role',
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
    role(state, action) {
      return { ...state, data: action.payload };
    },
    saveDetail(state, action) {
      return { ...state, roleInfo: action.payload }
    },
  },
};

export default Model;
