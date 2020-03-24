import { queryGroupList } from '../service';


const Group = {
  namespace: 'groupList',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },
  effects: {
    * fetchGroups({ payload }, { call, put }) {
      const response = yield call(queryGroupList, payload);
      yield put({
        type: 'group',
        payload: response,
      });
    },
  },
  reducers: {
    group(state, action) {
      return { ...state, data: action.payload };
    },
  },
};

export default Group;
