import { queryLabelData } from '../service';

const TextMark = {
  namespace: 'textMark',
  state: {
    data: {
      list: [],
      pagination: {},
    },
  },

  effects: {
    * fetchLabelData({ payload }, { call, put }) {
      const response = yield call(queryLabelData, payload);
      yield put({
        type: 'labelData',
        payload: response,
      });
    },
  },

  reducers: {
    labelData(state, action) {
      return { ...state, data: action.payload };
    },
  },
};

export default TextMark;
