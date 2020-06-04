import { message } from 'antd';
import { deleteTextMarkResult, queryLabelData, queryMarkTool, queryNextTextQuestion, queryOneTextQuestion, queryPrevTextQuestion, saveReviewResult, saveTextMarkResult, updateStatus } from '../service';

const SequenceMark = {
  namespace: 'sequenceMark',
  state: {
    sequenceData: {
      list: [],
      pagination: {},
    },
    checkRate: 0,
    passRate: 0,
    markTool: {},
    questionInfo: {},
    schedule: 0,
  },

  effects: {
    * fetchSequenceData({ payload }, { call, put }) {
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
        type: 'sequenceData',
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

    * updateSchedule({ payload }, { put }) {
      yield put({
        type: 'schedule',
        payload: payload.schedule,
      });
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
    schedule(state, action) {
      return { ...state, schedule: action.payload };
    },
  },
};

export default SequenceMark;
