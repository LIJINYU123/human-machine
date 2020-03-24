import { queryDefaultTemplate, queryMembers } from '../service';


const TextProjectFormData = {
  namespace: 'textProjectFormData',
  state: {
    stepOne: {
      projectName: '',
      passRate: null,
      checkRate: null,
      labeler: [],
      inspector: [],
      questionNum: null,
      projectPeriod: [],
      description: '',
    },
    stepTwo: {
      templateName: '',
      multiple: true,
      saveType: 'nomal',
    },
    forever: false,
    labelType: [],
    templates: [],
    optionData: [],
    minValue: null,
    maxValue: null,
    saveTemplate: false,
    members: {
      labelers: [],
      inspectors: [],
    },
    current: 0,
  },
  effects: {
    * fetchTemplate({ payload }, { call, put }) {
      if (payload.length) {
        const response = yield call(queryDefaultTemplate, { labelType: payload[payload.length - 1] });
        yield put({
          type: 'saveDefaultTemplate',
          payload: response,
        });
      } else {
        yield put({
          type: 'saveDefaultTemplate',
          payload: [],
        });
      }
      yield put({
        type: 'saveLabelType',
        payload,
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

    * saveRadio({ payload }, { put }) {
      yield put({
        type: 'saveRadioData',
        payload,
      });
    },

    * saveOptions({ payload }, { put }) {
      yield put({
        type: 'saveOptionData',
        payload,
      });
    },

    * saveColor({ payload }, { put }) {
      yield put({
        type: 'saveOptionColor',
        payload,
      });
    },

    * deleteOption({ payload }, { put }) {
      yield put({
        type: 'deleteOptionData',
        payload,
      });
    },

    * addOption({ payload, callback }, { put }) {
      yield put({
        type: 'addOptionData',
        payload,
      });
      if (callback) {
        callback();
      }
    },

    * saveCheckBox({ payload }, { put }) {
      yield put({
        type: 'saveCheckBoxData',
        payload,
      });
    },

    * saveMinValue({ payload }, { put }) {
      yield put({
        type: 'saveMinValueData',
        payload,
      });
    },

    * saveMaxValue({ payload }, { put }) {
      yield put({
        type: 'saveMaxValueData',
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

    * resetStepData(_, { put }) {
      yield put({
        type: 'resetData',
        payload: 0,
      });
    },
  },

  reducers: {
    saveDefaultTemplate(state, action) {
      return { ...state, templates: action.payload };
    },
    saveLabelType(state, action) {
      return { ...state, labelType: action.payload };
    },
    saveMembers(state, action) {
      return { ...state, members: action.payload };
    },
    saveStepOne(state, action) {
      return { ...state, stepOne: action.payload, current: 1 };
    },
    saveRadioData(state, action) {
      return { ...state, forever: action.payload.forever };
    },
    saveStepTwo(state, action) {
      return { ...state, stepTwo: action.payload, current: 2 };
    },
    saveOptionData(state, action) {
      return { ...state, optionData: action.payload };
    },
    deleteOptionData(state, action) {
      const { optionData } = state;
      const response = action.payload;
      const filterData = optionData.filter(data => data.optionName !== response.optionName);
      return { ...state, optionData: filterData };
    },
    addOptionData(state, action) {
      const { optionData } = state;
      const response = action.payload;
      // eslint-disable-next-line max-len
      optionData.push({ optionName: response.optionName, color: response.color });
      return { ...state, optionData };
    },
    saveOptionColor(state, action) {
      const { optionData } = state;
      const response = action.payload;
      optionData.forEach(data => {
        if (data.optionName === response.optionName) {
          data.color = response.color;
        }
      });
      return { ...state, optionData };
    },
    saveCheckBoxData(state, action) {
      return { ...state, saveTemplate: action.payload.saveTemplate };
    },
    saveMinValueData(state, action) {
      return { ...state, minValue: action.payload };
    },
    saveMaxValueData(state, action) {
      return { ...state, maxValue: action.payload };
    },
    stepTwoPrev(state, action) {
      return { ...state, current: action.payload };
    },
    stepThreePrev(state, action) {
      return { ...state, current: action.payload };
    },
    resetData(state, _) {
      return {
        ...state,
        stepOne: {
          projectName: '',
          labelType: [],
          passRate: null,
          checkRate: null,
          labeler: [],
          inspector: [],
          questionNum: null,
          projectPeriod: [],
          description: '',
        },
        stepTwo: {
          templateName: '',
          defaultTool: '',
          multiple: true,
        },
        forever: false,
        templates: [],
        optionData: [],
        saveTemplate: false,
        current: 0,
      };
    },
  },
};

export default TextProjectFormData;
