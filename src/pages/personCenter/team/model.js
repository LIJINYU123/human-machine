import { queryTeamInfo } from './service';
import { queryUserInfo, queryUserStatistics } from '../profile/service';


const Team = {
  namespace: 'team',
  state: {
    projectManagers: [],
    labelers: [],
    inspectors: [],
    userInfo: {},
    statistics: {},
  },

  effects: {
    * fetchTeamInfo(_, { call, put }) {
      const response = yield call(queryTeamInfo);
      yield put({
        type: 'teamInfo',
        payload: response,
      });
    },

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
    teamInfo(state, action) {
      const { projectManagers, labelers, inspectors } = action.payload;
      return { ...state, projectManagers, labelers, inspectors };
    },
    userInfo(state, action) {
      return { ...state, userInfo: action.payload };
    },
    statistics(state, action) {
      return { ...state, statistics: action.payload };
    },
  },
};

export default Team;
