import { message } from 'antd';
import { fakeDetailViewForm } from './service';

const Model = {
  namespace: 'detailViewForm',
  state: {
    userInfo: {},
    dialogInfos: [],
  },
  effects: {
    *submitDetailView({ payload }, { call }) {
      yield call(fakeDetailViewForm, payload);
      message.success('提交成功');
    },
  },
};

export default Model;
