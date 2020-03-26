import { queryGroupList, addGroup, deleteGroup } from '../service';
import { message } from 'antd';

const Group = {
  namespace: 'groupList',
  state: {
    groups: [],
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
  },
  reducers: {
    group(state, action) {
      return { ...state, groups: action.payload };
    },
  },
};

export default Group;
