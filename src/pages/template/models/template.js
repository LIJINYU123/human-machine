import { queryTemplateList, deleteTemplateList } from '../service';
import { message } from 'antd/lib/index';

const Template = {
  namespace: 'templateManage',
  state: {
    data: [],
  },

  effects: {
    * fetchTemplate({ payload }, { call, put }) {
      const response = yield call(queryTemplateList, payload);
      yield put({
        type: 'template',
        payload: response,
      });
    },

    * deleteTemplate({ payload, callback }, { call, put }) {
      const response = yield call(deleteTemplateList, payload);
      if (response.status === 'ok') {
        message.success(response.message);
        const result = yield call(queryTemplateList, payload);
        yield put({
          type: 'template',
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
    template(state, action) {
      return { ...state, data: action.payload };
    },
  },
};

export default Template;
