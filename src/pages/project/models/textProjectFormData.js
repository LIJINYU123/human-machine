import { queryDefaultTemplate, queryMembers } from '../service';


const TextProjectFormData = {
  namespace: 'textProjectFormData',
  state: {
    stepOne: {
      projectName: '',
      labelType: 'textClassify',
    },
    stepTwo: {
      templateName: '',
    },
    templates: [],
    classifyData: [],
    members: {
      labelers: [],
      inspectors: [],
    },
    current: 1,
  },
  effects: {
    * fetchTemplate({ payload }, { call, put }) {
      const response = yield call(queryDefaultTemplate, payload);
      yield put({
        type: 'saveDefaultTemplate',
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

    * saveClassifies({ payload }, { put }) {
      yield put({
        type: 'saveClassifyData',
        payload,
      });
    },

    * saveColor({ payload }, { put }) {
      yield put({
        type: 'saveClassifyColor',
        payload,
      });
    },

    * deleteClassify({ payload }, { put }) {
      yield put({
        type: 'deleteClassifyData',
        payload,
      });
    },

    * addClassify({ payload, callback }, { put }) {
      yield put({
        type: 'addClassifyData',
        payload,
      });
      if (callback) {
        callback();
      }
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

    * resetStep(_, { put }) {
      yield put({
        type: 'resetCurrentStep',
        payload: 0,
      });
    },
  },

  reducers: {
    saveDefaultTemplate(state, action) {
      return { ...state, templates: action.payload };
    },
    saveMembers(state, action) {
      return { ...state, members: action.payload };
    },
    saveStepOne(state, action) {
      const { labelType, ...rest } = action.payload;

      return { ...state, stepOne: { labelType: labelType.pop(), ...rest }, current: 1 };
    },
    saveStepTwo(state, action) {
      return { ...state, stepTwo: action.payload, current: 2 };
    },
    saveClassifyData(state, action) {
      return { ...state, classifyData: action.payload };
    },
    deleteClassifyData(state, action) {
      const { classifyData } = state;
      const response = action.payload;
      const filterData = classifyData.filter(data => data.classifyName !== response.classifyName);
      return { ...state, classifyData: filterData };
    },
    addClassifyData(state, action) {
      const { classifyData } = state;
      const response = action.payload;
      // eslint-disable-next-line max-len
      classifyData.push({ classifyName: response.classifyName, color: response.color });
      return { ...state, classifyData };
    },
    saveClassifyColor(state, action) {
      const { classifyData } = state;
      const response = action.payload;
      classifyData.forEach(data => {
        if (data.classifyId === response.classifyId) {
          data.color = response.color;
        }
      });
      return { ...state, classifyData };
    },
    stepTwoPrev(state, action) {
      return { ...state, current: action.payload };
    },
    stepThreePrev(state, action) {
      return { ...state, current: action.payload };
    },
    resetCurrentStep(state, action) {
      return { ...state, current: action.payload };
    },
  },
};

export default TextProjectFormData;
