import { queryMarkTools } from '../service';


const TextProjectFormData = {
  namespace: 'textProjectFormData',
  state: {
    stepOne: {
      projectName: '',
      labelType: '',
    },
    markTools: [],
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
  },

  reducers: {
    saveMarkToolOptions(state, action) {
      return { ...state, markTools: action.payload };
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
  },
};

export default TextProjectFormData;
