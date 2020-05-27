import { queryUserInfo, queryUserStatistics, modifyUserInfo } from './service';
import { message } from 'antd';


const Profile = {
  namespace: 'profile',
  state: {
    userInfo: {},
    statistics: {},
  },

  effects: {
    * fetchUserInfo({ payload }, { call, put }) {
      const response = yield call(queryUserInfo, payload);
      yield put({
        type: 'userInfo',
        payload: response,
      });
    },

    * fetchStatistics({ payload }, { call, put }) {
      const response = yield call(queryUserStatistics, payload);
      if (response.status === 'ok') {
        yield put({
          type: 'statistics',
          payload: response.response,
        });
      } else {
       message.error(response.message);
      }
    },

    * modifyUserInfo({ payload, callback }, { call }) {
      const response = yield call(modifyUserInfo, payload);
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
    userInfo(state, action) {
      return { ...state, userInfo: action.payload };
    },
    statistics(state, action) {
      return { ...state, statistics: action.payload };
    },
  },
};

export default Profile;
