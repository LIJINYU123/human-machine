import { queryTemplateList } from './service';

const Model = {
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
  },
  reducers: {
    template(state, action) {
      return { ...state, data: action.payload };
    },
  },
};

export default Model;
