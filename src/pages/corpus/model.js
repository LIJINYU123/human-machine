import { message } from 'antd';
import router from 'umi/router';
import { fakeSubmitForm } from './service';

const Model = {
  namespace: 'formCorpusForm',
  state: {},
  effects: {
    * submitCorpusForm({ payload }, { call }) {
      const response = yield call(fakeSubmitForm, payload);
      if (response.message === 'success') {
        message.success('提交成功');
        router.push('/');
      } else {
        message.success('提交失败');
      }
    },
  },
};

export default Model;
