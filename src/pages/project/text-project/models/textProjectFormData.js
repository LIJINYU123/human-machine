import { queryMarkTools } from '../service';


const TextProjectFormData = {
  namespace: 'textProjectFormData',
  state: {
    stepOne: {
      projectName: '',
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
  },
};

export default TextProjectFormData;
