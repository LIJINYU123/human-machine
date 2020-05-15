import { createTemplate } from '../service';
import { message } from 'antd';

const CreateTemplate = {
  namespace: 'createTemplate',
  state: {
    optionData: [],
  },
  effects: {
    * addOption({ payload, callback }, { put }) {
      yield put({
        type: 'addOptionData',
        payload,
      });
      if (callback) {
        callback();
      }
    },

    * deleteOption({ payload }, { put }) {
      yield put({
        type: 'deleteOptionData',
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

    * addTemplate({ payload, callback }, { call, put }) {
      const response = yield call(createTemplate, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        yield put({
          type: 'resetOptionData',
          payload,
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
    addOptionData(state, action) {
      const { optionData } = state;
      const response = action.payload;
      // eslint-disable-next-line max-len
      optionData.push({ optionName: response.optionName, color: response.color });
      return { ...state, optionData };
    },
    deleteOptionData(state, action) {
      const { optionData } = state;
      const response = action.payload;
      const filterData = optionData.filter(data => data.optionName !== response.optionName);
      return { ...state, optionData: filterData };
    },
    saveOptionData(state, action) {
      return { ...state, optionData: action.payload };
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
    resetOptionData(state, action) {
      return { ...state, optionData: [] };
    },
  },
};

export default CreateTemplate;
