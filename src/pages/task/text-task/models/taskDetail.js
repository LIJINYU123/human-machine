import { queryTaskDetail } from '../service';


const TaskDetail = {
  namespace: 'textTaskDetail',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    basicInfo: {},
  },
  effects: {
    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryTaskDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
    },
  },

  reducers: {
    detail(state, action) {
      const { list, pagination, basicInfo } = action.payload;
      return { ...state, data: { list, pagination }, basicInfo };
    },
  },
};

export default TaskDetail;
