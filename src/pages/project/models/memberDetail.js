import { queryMemberData } from '../service';


const MemberDetail = {
  namespace: 'memberDetail',
  state: {
    members: [],
  },

  effects: {
    * fetchMemberData({ payload }, { call, put }) {
      const response = yield call(queryMemberData, payload);
      yield put({
        type: 'member',
        payload: response,
      });
    },
  },

  reducers: {
    member(state, action) {
      return { ...state, members: action.payload };
    },
  },
};

export default MemberDetail;
