import { queryUserList, deleteUser, queryRoleList, updateUserDetail } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'userList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    roleInfos: [],
  },
  effects: {
    * fetchUsers({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'user',
        payload: response,
      });
    },

    * deleteUsers({ payload, callback }, { call, put }) {
      const response = yield call(deleteUser, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryUserList);
        yield put({
          type: 'user',
          payload: result,
        });
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    * updateDetail({ payload, callback }, { call, put }) {
      const response = yield call(updateUserDetail, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryUserList);
        yield put({
          type: 'user',
          payload: result,
        });
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * fetchRoles(_, { call, put }) {
      const response = yield call(queryRoleList);
      yield put({
        type: 'saveRoles',
        payload: response,
      });
    },
  },
  reducers: {
    user(state, action) {
      return { ...state, data: action.payload };
    },
    saveRoles(state, action) {
      return { ...state, roleInfos: action.payload };
    },
  },
};

export default Model;
