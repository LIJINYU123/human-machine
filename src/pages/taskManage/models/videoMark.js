import { message } from 'antd';
import {
  queryLabelData,
  saveReviewResult,
  updateStatus,
  queryOneTextQuestion,
  queryNextTextQuestion, queryPrevTextQuestion, queryTaskSchedule
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
    taskSchedule: 0,
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
        // yield put({
        //   type: 'schedule',
        //   payload: response.reviewSchedule,
        // });
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

    * updateSchedule({ payload }, { call, put }) {
      const response = yield call(queryTaskSchedule, payload);
      yield put({
        type: 'schedule',
        payload: response,
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
    * fetchNext({ payload, callback }, { call, put, select }) {
      const response = yield call(queryNextTextQuestion, payload);
      const dataId = yield select(state => state.videoMark.dataId);
      if (response.dataId === dataId) {
        message.warn('已经到最后一题!')
      }
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
      return { ...state, data: action.payload };
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
          videoNo: '',
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
    schedule(state, action) {
      return { ...state, taskSchedule: action.payload.schedule, checkRate: action.payload.checkRate, passRate: action.payload.passRate };
    },
  },
};


export default VideoMark;
