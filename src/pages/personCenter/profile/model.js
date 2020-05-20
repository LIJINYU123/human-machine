import { queryUserInfo, queryUserStatistics } from './service';


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
      yield put({
        type: 'statistics',
        payload: response,
      })
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
