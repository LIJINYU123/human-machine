import { queryMarkTools, queryMembers } from '../service';

const TextFormData = {
  namespace: 'textFormData',
  state: {
    stepOne: {
      taskName: '',
      taskType: 'textClassify',
      markTool: [],
      deadline: '',
    },
    stepTwo: {
      labeler: '',
      inspector: '',
      acceptor: '',
    },
    allMarkTools: {},
    members: {
      labelers: [],
      inspectors: [],
      acceptors: [],
    },
    current: 0,
  },
  effects: {
    * fetchMarkTool(_, { call, put }) {
      const response = yield call(queryMarkTools);
      yield put({
        type: 'saveMarkToolOptions',
        payload: response,
      });
    },

    * saveStepOneData({ payload }, { put }) {
      yield put({
        type: 'saveStepOne',
        payload,
      });
    },

    * saveStepTwoData({ payload }, { put }) {
      yield put({
        type: 'saveStepTwo',
        payload,
      });
    },

    * stepTwoPrevious(_, { put }) {
      yield put({
        type: 'stepTwoPrev',
        payload: 0,
      });
    },

    * stepThreePrevious(_, { put }) {
      yield put({
        type: 'stepThreePrev',
        payload: 1,
      });
    },

    * fetchMembers({ payload }, { call, put }) {
      const response = yield call(queryMembers, payload);
      yield put({
        type: 'saveMembers',
        payload: response,
      });
    },
  },

  reducers: {
    saveMarkToolOptions(state, action) {
      return { ...state, allMarkTools: action.payload };
    },
    saveStepOne(state, action) {
      return { ...state, stepOne: action.payload, current: 1 };
    },
    saveStepTwo(state, action) {
      return { ...state, stepTwo: action.payload, current: 2 };
    },
    saveMembers(state, action) {
      return { ...state, members: action.payload };
    },
    stepTwoPrev(state, action) {
      return { ...state, current: action.payload };
    },
    stepThreePrev(state, action) {
      return { ...state, current: action.payload };
    },
  },
};

export default TextFormData;
