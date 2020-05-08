import { message } from 'antd';
import { queryDefaultTemplate, queryMembers, saveStepOneData, saveStepTwoData, saveStepFourData, queryPreLabelData, queryProjectDetail } from '../service';
import moment from 'moment';
import ItemData from '../map';


const { labelTypeToValue } = ItemData;

const TextProjectFormData = {
  namespace: 'textProjectFormData',
  state: {
    stepOne: {
      projectName: '',
      projectType: '',
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
      classifyName: '',
      defaultTool: '',
      multiple: true,
      saveType: 'nomal',
    },
    projectId: '',
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
    preLabelData: [],
    preLabelResult: [],
    explain: '',
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

    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryProjectDetail, payload);
      yield put({
        type: 'detail',
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

    * fetchPreLabelData({ payload }, { call, put }) {
      const reponse = yield call(queryPreLabelData, payload);
      yield put({
        type: 'savePreLabelData',
        payload: reponse,
      });
    },

    * saveStepOneData({ payload }, { call, put, select }) {
      const forever = yield select(state => state.textProjectFormData.forever);
      const { projectPeriod, ...rest } = payload;
      let startTime = '';
      let endTime = '';
      if (!forever) {
        startTime = projectPeriod[0].format('YYYY-MM-DD HH:mm:ss');
        endTime = projectPeriod[1].format('YYYY-MM-DD HH:mm:ss');
      }
      const response = yield call(saveStepOneData, { startTime, endTime, ...rest });
      if (response.status === 'ok') {
        yield put({
          type: 'saveStepOne',
          payload: { ...payload, projectId: response.message },
        });
      } else {
        message.error(response.message);
      }
    },

    * saveStepTwoData({ payload }, { call, put, select }) {
      const labelType = yield select(state => state.textProjectFormData.labelType);
      const saveTemplate = yield select(state => state.textProjectFormData.saveTemplate);
      const optionData = yield select(state => state.textProjectFormData.optionData);
      let setting = {};
      if (labelType.slice(-1)[0] === 'textClassify') {
        setting = {
          classifyName: payload.classifyName,
          multiple: payload.multiple,
          options: optionData,
        }
      } else if (labelType.slice(-1)[0] === 'sequenceLabeling') {
        setting = {
          classifyName: payload.classifyName,
          multiple: payload.multiple,
          options: optionData,
          saveType: payload.saveType,
        };
      } else if (labelType.slice(-1)[0] === 'textExtension') {
        const minValue = yield select(state => state.textProjectFormData.minValue);
        const maxValue = yield select(state => state.textProjectFormData.maxValue);
        setting = {
          minValue,
          maxValue,
        };
      }

      const templateName = payload.hasOwnProperty('templateName') ? payload.templateName : '';

      const response = yield call(saveStepTwoData, { labelType: labelType.slice(-1)[0], saveTemplate, templateName, setting });
      if (response.status === 'ok') {
        yield put({
          type: 'saveStepTwo',
          payload,
        });
      } else {
        message.error(response.message);
      }
    },

    * sveStepFourData({ payload, callback }, { call }) {
      const response = yield call(saveStepFourData, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        if (callback) {
          callback();
        }
      } else {
        message.error(response.message);
      }
    },

    * saveExplain({ payload }, { put }) {
      yield put({
        type: 'saveExplainData',
        payload,
      });
    },

    * savePreLabelResult({ payload, callback }, { put }) {
      yield put({
        type: 'savePreLabelResultData',
        payload,
      });

      if (callback) {
        callback();
      }
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

    * stepTwoPrevious(_, { put }) {
      yield put({
        type: 'stepTwoPrev',
        payload: 0,
      });
    },

    * saveStepThreeData(_, { put }) {
      yield put({
        type: 'saveStepThree',
        payload: 3,
      });
    },

    * stepThreePrevious(_, { put }) {
      yield put({
        type: 'stepThreePrev',
        payload: 1,
      });
    },

    * stepFourPrevious(_, { put }) {
      yield put({
        type: 'stepFourPrev',
        payload: 2,
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
      const { projectId, ...rest } = action.payload;
      return { ...state, stepOne: { ...rest }, projectId, current: 1 };
    },
    saveRadioData(state, action) {
      return { ...state, forever: action.payload.forever };
    },
    saveStepTwo(state, action) {
      return { ...state, stepTwo: action.payload, current: 2 };
    },
    saveStepThree(state, action) {
      return { ...state, current: action.payload };
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
    stepFourPrev(state, action) {
      return { ...state, current: action.payload };
    },
    saveExplainData(state, action) {
      return { ...state, explain: action.payload };
    },
    savePreLabelData(state, action) {
      return { ...state, preLabelData: action.payload };
    },
    savePreLabelResultData(state, action) {
      return { ...state, preLabelResult: action.payload };
    },
    detail(state, action) {
      const { projectId, projectName, projectType, passRate, checkRate, labelers, inspectors, questionNum, description, startTime, endTime, labelType, templateName = '', saveTemplate, setting, explain } = action.payload;
      const { classifyName = '', multiple = true, options = [], saveType = 'nomal', minValue = null, maxValue = null } = setting;
      let projectPeriod = [];
      let forever = true;
      if (startTime !== '' && endTime !== '') {
        projectPeriod = [moment(startTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss'), moment(endTime, 'YYYY-MM-DD HH:mm:ss')];
        forever = false;
      }
      return {
        ...state,
        projectId,
        stepOne: { projectName, projectType, passRate, checkRate, labeler: labelers, inspector: inspectors, questionNum, projectPeriod, description },
        stepTwo: { templateName, classifyName, multiple, saveType },
        forever,
        labelType: labelTypeToValue[labelType],
        optionData: options,
        minValue,
        maxValue,
        saveTemplate,
        explain,
      };
    },
    resetData(state, _) {
      return {
        ...state,
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
          defaultTool: '',
          multiple: true,
        },
        projectId: '',
        forever: false,
        labelType: [],
        templates: [],
        optionData: [],
        saveTemplate: false,
        explain: '',
        current: 0,
      };
    },
  },
};

export default TextProjectFormData;
