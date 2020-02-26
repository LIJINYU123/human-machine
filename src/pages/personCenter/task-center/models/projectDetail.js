import { queryProjectDetail, queryTaskData } from '../service';


const ProjectDetail = {
  namespace: 'detail',
  state: {
    data: {
      list: [],
      pagination: {},
    },
    basicInfo: {},
  },
  effects: {
    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryProjectDetail, payload);
      yield put({
        type: 'detail',
        payload: response,
      });
    },

    * fetchTaskData({ payload }, { call, put }) {
      const response = yield call(queryTaskData, payload);
      yield put({
        type: 'taskData',
        payload: response,
      });
    },
  },

  reducers: {
    detail(state, action) {
      return { ...state, basicInfo: action.payload };
    },
    taskData(state, action) {
      const response = action.payload;
      // const list = response.list.map(item => ({ projectId: item.projectId, taskId: item.taskId, taskName: item.taskName, status: item.status === 'initial' }));
      // response.list = list;
      // console.log(response);
      return { ...state, data: response };
    },
  },
};

export default ProjectDetail;
