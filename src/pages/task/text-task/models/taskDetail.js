// eslint-disable-next-line import/named
import { queryTaskDetail, queryLabelData } from '../service';


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

    * fetchLabelData({ payload }, { call, put }) {
      const response = yield call(queryLabelData, payload);
      yield put({
        type: 'labelData',
        payload: response,
      });
    },
  },

  reducers: {
    detail(state, action) {
      return { ...state, basicInfo: action.payload };
    },
    labelData(state, action) {
      return { ...state, data: action.payload };
    },
  },
};

export default TaskDetail;
