import { queryAgencyInfo } from './service';


const Agency = {
  namespace: 'agency',
  state: {
    agencyInfo: {},
  },

  effects: {
    * fetchAgencyInfo(_, { call, put }) {
      const response = yield call(queryAgencyInfo);
      yield put({
        type: 'agencyInfo',
        payload: response,
      });
    },
  },

  reducers: {
    agencyInfo(state, action) {
      return { ...state, agencyInfo: action.payload };
    },
  },

};


export default Agency;
