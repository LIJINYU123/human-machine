import { message } from 'antd';
import moment from 'moment';
import {
  queryLabelData,
  saveReviewResult,
  updateStatus,
  queryOneTextQuestion,
  queryNextTextQuestion, queryPrevTextQuestion,
} from '../service';


const VideoMark = {
  namespace: 'videoMark',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    checkRate: 0,
    passRate: 0,
    questionInfo: {},
    dataId: '',
    labelData: {},
    reviewResult: '',
    remark: '',
    schedule: {},
    videoBasicInfo: {},
    userInfo: [],
    dialogRecord: [],
    topicList: [],
    receptionEvaluation: '',
  },

  effects: {
    * fetchLabelData({ payload }, { call, put }) {
      const response = yield call(queryLabelData, payload);
      response.list.forEach(item => {
        item.sentence = item.data.sentence;
      });
      yield put({
        type: 'labelData',
        payload: response,
      });
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

    * addUser({ payload }, { put, select }) {
      const prevUserInfo = yield select(state => state.videoMark.userInfo);
      prevUserInfo.push(payload);

      yield put({
        type: 'user',
        payload: prevUserInfo,
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
      if (response.dataId === '') {
        message.warn('已经到最后一题')
      } else {
        yield put({
          type: 'saveQuestion',
          payload: response,
        });
        if (callback) {
          callback();
        }
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
    saveQuestion(state, action) {
      const { dataId, data, labelResult, reviewResult, remark, schedule } = action.payload;
      if (labelResult.length) {
        const { videoBasicInfo, userInfo, dialogRecord, topicList, receptionEvaluation } = labelResult[0];
        return { ...state, dataId, labelData: data, reviewResult, remark, schedule, videoBasicInfo, userInfo, dialogRecord, topicList, receptionEvaluation };
      }

      return {
        ...state,
        dataId,
        labelData: data,
        reviewResult,
        remark,
        schedule,
        videoBasicInfo: {
          area: '',
          outlet: '',
          receptionPerson: '',
          dialogScene: '',
          dialogTarget: '',
          videoRemark: '',
        },
        userInfo: [],
        dialogRecord: [],
        topicList: [],
        receptionEvaluation: '',
      };
    },
    user(state, action) {
      return { ...state, userInfo: action.payload };
    },
  },
};


export default VideoMark;
