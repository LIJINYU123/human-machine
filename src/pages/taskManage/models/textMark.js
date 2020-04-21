import { message } from 'antd/lib/index';
import { queryLabelData, queryMarkTools, saveTextMarkResult, deleteTextMarkResult, saveReviewResult, queryOneTextQuestion, queryNextTextQuestion, queryPrevTextQuestion } from '../service';

const TextMark = {
  namespace: 'textMark',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    sequenceData: {
      list: [],
      pagination: {},
    },
    checkRate: 0,
    passRate: 0,
    markTool: {},
    questionInfo: {},
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
      });
      yield put({
        type: 'labelData',
        payload: response,
      });
    },

    * fetchSequenceData({ payload }, { call, put }) {
      const response = yield call(queryLabelData, payload);
      response.list.forEach(item => {
        item.sentence = item.data.sentence;
      });
      yield put({
        type: 'sequenceData',
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

    * saveTextMarkResult({ payload, callback }, { call }) {
      const response = yield call(saveTextMarkResult, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * saveReviewResult({ payload, callback }, { call }) {
      const response = yield call(saveReviewResult, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    * deleteTextMarkResult({ payload, callback }, { call }) {
      const response = yield call(deleteTextMarkResult, payload);
      if (response.status === 'ok') {
        message.success(response.message);
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
    },

    // 答题模式，获取一道题目
    * fetchQuestion({ payload }, { call, put }) {
      const response = yield call(queryOneTextQuestion, payload);
      yield put({
        type: 'saveQuestion',
        payload: response,
      });
    },

    // 答题模式，获取下一道题目
    * fetchNext({ payload, callback }, { call, put }) {
      const response = yield call(queryNextTextQuestion, payload);
      yield put({
        type: 'saveQuestion',
        payload: response,
      });
      if (callback) {
        callback();
      }
    },

    // 答题模式，获取上一道题目
    * fetchPrev({ payload, callback }, { call, put }) {
      const response = yield call(queryPrevTextQuestion, payload);
      yield put({
        type: 'saveQuestion',
        payload: response,
      });
      if (callback) {
        callback();
      }
    },
  },

  reducers: {
    labelData(state, action) {
      const data = action.payload;
      const checkNum = data.list.filter(item => item.reviewResult !== 'unreview').length;
      const passNum = data.list.filter(item => item.reviewResult === 'approve').length;
      return { ...state, data, checkRate: parseInt(checkNum / data.pagination.total * 100, 0), passRate: checkNum !== 0 ? parseInt(passNum / checkNum * 100, 0) : 0 };
    },
    sequenceData(state, action) {
      const data = action.payload;
      const checkNum = data.list.filter(item => item.reviewResult !== 'unreview').length;
      const passNum = data.list.filter(item => item.reviewResult === 'approve').length;
      return { ...state, sequenceData: data, checkRate: parseInt(checkNum / data.pagination.total * 100, 0), passRate: checkNum !== 0 ? parseInt(passNum / checkNum * 100, 0) : 0 };
    },
    saveTool(state, action) {
      return { ...state, markTool: action.payload };
    },
    saveQuestion(state, action) {
      return { ...state, questionInfo: action.payload };
    },
  },
};

export default TextMark;
