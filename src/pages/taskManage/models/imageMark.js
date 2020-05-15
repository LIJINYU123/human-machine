import { message } from 'antd';
import { queryLabelData, queryMarkTool, queryNextTextQuestion, queryOneTextQuestion, queryPrevTextQuestion, saveReviewResult, saveTextMarkResult, updateStatus } from '../service';


const ImageMark = {
  namespace: 'imageMark',
  state: {
    data: {
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
      yield put({
        type: 'labelData',
        payload: response,
      });
    },

    * fetchMarkTool({ payload }, { call, put }) {
      const response = yield call(queryMarkTool, payload);
      yield put({
        type: 'saveTool',
        payload: response,
      });
    },

    * saveMarkResult({ payload, callback }, { call }) {
      const response = yield call(saveTextMarkResult, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
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

    * updateStatus({ payload, callback }, { call }) {
      const response = yield call(updateStatus, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    // 答题模式，获取一道题目
    * fetchQuestion({ payload, callback }, { call, put }) {
      const response = yield call(queryOneTextQuestion, payload);
      yield put({
        type: 'saveQuestion',
        payload: response,
      });
      if (callback) {
        callback();
      }
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
      return {
        ...state,
        data,
        checkRate: parseInt(checkNum / data.pagination.total * 100, 0),
        passRate: checkNum !== 0 ? parseInt(passNum / checkNum * 100, 0) : 0,
      };
    },
    saveTool(state, action) {
      return {
        ...state,
        markTool: action.payload,
      };
    },
    saveQuestion(state, action) {
      return {
        ...state,
        questionInfo: action.payload,
      };
    },
  },
};

export default ImageMark;
