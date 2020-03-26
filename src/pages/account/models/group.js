import { message } from 'antd';
import { queryGroupList, addGroup, deleteGroup, modifyGroup } from '../service';

const Group = {
  namespace: 'groupList',
  state: {
    groups: [],
    targetKeys: [],
  },
  effects: {
    * fetchGroups({ payload }, { call, put }) {
      const response = yield call(queryGroupList, payload);
      yield put({
        type: 'group',
        payload: response,
      });
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
  },
  reducers: {
    group(state, action) {
      return { ...state, groups: action.payload };
    },
    saveKeys(state, action) {
      return { ...state, targetKeys: action.payload };
    },
  },
};

export default Group;
