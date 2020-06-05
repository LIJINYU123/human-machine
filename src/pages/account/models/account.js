import { queryUserList, deleteUser, queryRoleList, updateUserDetail, updateUserStatus, manualAddUsers, batchAddUsers, resetPassword } from '../service';
import { queryNoDepAccounts } from '../../department/service';
import { message } from 'antd/lib/index';

const Account = {
  namespace: 'userList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    roleInfos: [],
    accounts: [],
  },
  effects: {
    * fetchUsers({ payload }, { call, put }) {
      const response = yield call(queryUserList, payload);
      yield put({
        type: 'user',
        payload: response,
      });
    },

    * deleteUsers({ payload, callback }, { call }) {
      const response = yield call(deleteUser, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    * manualAddUsers({ payload, callback }, { call }) {
      const response = yield call(manualAddUsers, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    * batchAddUsers({ payload, callback }, { call }) {
      const response = yield call(batchAddUsers, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    * activeUser({ payload, callback }, { call }) {
      const response = yield call(updateUserStatus, payload);
      if (response.status === 'ok') {
        message.success(response.message)
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * resetPassword({ payload }, { call }) {
      const response = yield call(resetPassword, payload);
      if (response.status === 'ok') {
        message.success(response.message)
      } else {
        message.error(response.message);
      }
    },

    * updateDetail({ payload, callback }, { call }) {
      const response = yield call(updateUserDetail, payload);
      if (response.status === 'ok') {
        message.success(response.message);
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

    * fetchNoDepAccounts(_, { call, put }) {
      const response = yield call(queryNoDepAccounts);
      yield put({
        type: 'saveAccounts',
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
    saveAccounts(state, action) {
      return { ...state, accounts: action.payload };
    },
  },
};

export default Account;
