import { queryLabelData, queryMarkTools } from '../service';

const TextMark = {
  namespace: 'textMark',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    markTools: [],
  },

  effects: {
    * fetchLabelData({ payload }, { call, put }) {
      const response = yield call(queryLabelData, payload);
      response.list.forEach(item => {
        if (Object.keys(item.data).length === 1) {
          item.sentence = item.data.sentence;
        } else {
          item.sentence1 = item.data.sentence1;
          item.sentence2 = item.data.sentence2;
        }
        return item;
      });
      yield put({
        type: 'labelData',
        payload: response,
      });
    },
    * fetchMarkTool({ payload }, { call, put }) {
      const response = yield call(queryMarkTools, payload);
      yield put({
        type: 'saveTool',
        payload: response,
      });
    },
  },

  reducers: {
    labelData(state, action) {
      return { ...state, data: action.payload };
    },
    saveTool(state, action) {
      return { ...state, markTools: action.payload };
    },
  },
};

export default TextMark;
