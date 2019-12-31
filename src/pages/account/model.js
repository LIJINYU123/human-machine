import { queryUserList, queryUserDetail, deleteUser, queryRoleList, updateUserDetail } from './service';
import { message } from 'antd';

const Model = {
  namespace: 'userList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    userInfo: {},
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

    * deleteUsers({ payload }, { call, put }) {
      const response = yield call(deleteUser, payload);
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
    },

    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryUserDetail, payload);
      yield put({
        type: 'saveDetail',
        payload: response,
      });
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
    saveDetail(state, action) {
      return { ...state, userInfo: action.payload };
    },
    saveRoles(state, action) {
      return { ...state, roleInfos: action.payload };
    },
  },
};

export default Model;
