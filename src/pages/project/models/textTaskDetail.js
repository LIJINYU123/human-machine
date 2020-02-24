import { queryTaskDetail, queryLabelData, deleteLabelData } from '../service'
import { message } from 'antd';

const TextTaskDetail = {
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

    * deleteLabelData({ payload, callback }, { call, put }) {
      const response = yield call(deleteLabelData, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryLabelData, { taskId: payload.taskId });
        yield put({
          type: 'labelData',
          payload: result,
        });
      } else {
        message.error(response.message);
      }

      if (callback) {
        callback();
      }
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

export default TextTaskDetail;
