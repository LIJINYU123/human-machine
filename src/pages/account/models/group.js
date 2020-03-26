import { queryGroupList } from '../service';


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
  },
  reducers: {
    group(state, action) {
      return { ...state, groups: action.payload };
    },
  },
};

export default Group;
