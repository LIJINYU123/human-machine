import { queryMarkTools, queryMembers } from '../service';


const TextProjectFormData = {
  namespace: 'textProjectFormData',
  state: {
    stepOne: {
      projectName: '',
      labelType: '',
    },
    markTools: [],
    members: {
      labelers: [],
      inspectors: [],
    },
    current: 0,
  },
  effects: {
    * fetchMarkTool({ payload }, { call, put }) {
      const response = yield call(queryMarkTools, payload);
      yield put({
        type: 'saveMarkToolOptions',
        payload: response,
      });
    },

    * fetchMembers({ payload }, { call, put }) {
      const response = yield call(queryMembers, payload);
      yield put({
        type: 'saveMembers',
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
  },

  reducers: {
    saveMarkToolOptions(state, action) {
      return { ...state, markTools: action.payload };
    },
    saveMembers(state, action) {
      return { ...state, members: action.payload };
    },
    saveStepOne(state, action) {
      return { ...state, stepOne: action.payload, current: 1 };
    },
    saveStepTwo(state, action) {
      return { ...state, stepTwo: action.payload, current: 2 };
    },
    stepTwoPrev(state, action) {
      return { ...state, current: action.payload };
    },
    stepThreePrev(state, action) {
      return { ...state, current: action.payload };
    },
  },
};

export default TextProjectFormData;
