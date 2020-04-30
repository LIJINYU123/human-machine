import { message } from 'antd';
import { queryGroupList, queryUngroupedUserList, addGroup, deleteGroup, modifyGroup, queryUserInfo, deleteUserInfo } from '../service';

const Group = {
  namespace: 'groupList',
  state: {
    groups: [],
    ungroupedUsers: [],
    targetKeys: [],
    userInfos: [],
    roleInfos: [],
  },
  effects: {
    * fetchGroups({ payload }, { call, put }) {
      const response = yield call(queryGroupList, payload);
      yield put({
        type: 'group',
        payload: response,
      });
    },

    * fetchUngroupedUsers({ callback }, { call, put }) {
      const response = yield call(queryUngroupedUserList);
      yield put({
        type: 'ungroupedUser',
        payload: response,
      });
      if (callback) {
        callback();
      }
    },

    * addGroup({ payload, callback }, { call }) {
      const response = yield call(addGroup, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * modifyGroup({ payload, callback }, { call }) {
      const response = yield call(modifyGroup, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * deleteGroups({ payload, callback }, { call }) {
      const response = yield call(deleteGroup, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * saveTargetKeys({ payload }, { put }) {
      yield put({
        type: 'saveKeys',
        payload,
      });
    },

    * fetchUserInfo({ payload }, { call, put }) {
      const response = yield call(queryUserInfo, payload);
      yield put({
        type: 'userInfo',
        payload: response,
      });
    },

    * deleteUserInfo({ payload, callback }, { call }) {
      const response = yield call(deleteUserInfo, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },
  },
  reducers: {
    group(state, action) {
      return { ...state, groups: action.payload };
    },
    ungroupedUser(state, action) {
      return { ...state, ungroupedUsers: action.payload };
    },
    saveKeys(state, action) {
      return { ...state, targetKeys: action.payload };
    },
    userInfo(state, action) {
      return {
        ...state,
        userInfos: action.payload,
        roleInfos: action.payload.reduce((obj, info) => {
          const newObj = [...obj];
          const roleNames = newObj.map(item => item.roleName);
          if (!roleNames.includes(info.roleName)) {
            newObj.push({ roleId: info.roleId, roleName: info.roleName });
          }
          return newObj;
        }, []),
      };
    },
  },
};

export default Group;
