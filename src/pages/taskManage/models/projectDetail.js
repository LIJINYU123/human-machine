import { queryMyTask, queryTaskNumber, queryProjectDetail, queryTaskData, receiveTask } from '../service';
import { message } from 'antd/lib/index';


const ProjectDetail = {
  namespace: 'detail',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    myTask: {
      list: [],
      pagiantion: {},
    },
    basicInfo: {},
    inProgressNum: 0,
    completeNum: 0,
  },
  effects: {
    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryProjectDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
    },

    * fetchTaskData({ payload }, { call, put }) {
      const response = yield call(queryTaskData, payload);
      yield put({
        type: 'taskData',
        payload: response,
      });
    },

    * fetchMyTask({ payload }, { call, put }) {
      const response = yield call(queryMyTask, payload);
      yield put({
        type: 'saveMyData',
        payload: response,
      });
    },

    * fetchTaskNumber(_, { call, put }) {
      const response = yield call(queryTaskNumber);
      yield put({
        type: 'saveTaskNumber',
        payload: response,
      });
    },

    * receiveTask({ payload, callback }, { call }) {
      const response = yield call(receiveTask, payload);
      if (response.status === 'ok') {
        message.success(response.message);
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
    taskData(state, action) {
      return { ...state, data: action.payload };
    },
    saveMyData(state, action) {
      const response = action.payload;
      return { ...state, myTask: { list: response.list, pagination: response.pagination } };
    },
    saveTaskNumber(state, action) {
      const response = action.payload;
      return { ...state, inProgressNum: response.inProgressNum, completeNum: response.completeNum }
    },
  },
};

export default ProjectDetail;
