import { routerRedux } from 'dva/router';
import router from 'umi/router'
import { message } from 'antd';
import { fakeAccountLogin, getFakeCaptcha } from './service';
import { getPageQuery } from './utils/utils';
import { setAuthority } from '@/utils/authority';
import { stringify } from "querystring";

const Model = {
  namespace: 'userAndlogin',
  state: {
    status: undefined,
  },
  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(fakeAccountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: response,
      }); // Login successfully

      if (response.status === 'ok') {
        const urlParams = new URL(window.location.href);
        const params = getPageQuery();
        let { redirect } = params;
        if (redirect) {
          const redirectUrlParams = new URL(redirect);

          if (redirectUrlParams.origin === urlParams.origin) {
            redirect = redirect.substr(urlParams.origin.length);

            if (redirect.match(/^\/.*#/)) {
              redirect = redirect.substr(redirect.indexOf('#') + 1);
            }
          } else {
            window.location.href = redirect;
            return;
          }
          yield put(routerRedux.replace(redirect))
        } else {
          window.location.href = `${urlParams.origin}/`;
        }
        yield put(routerRedux.replace(redirect || '/'));
      } else {
        message.error(response.message);
      }
    },

    *logout(_, { put }) {
      const { redirect } = getPageQuery(); // redirect

      if (window.location.pathname !== '/user/login' && !redirect) {
        const urlParams = new URL(window.location.href);
        yield put(
          routerRedux.replace({
            pathname: '/user/login',
            search: stringify({
              redirect: `${urlParams.origin}/`,
            }),
          }),
        );
      }
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },
  },
  reducers: {
    changeLoginStatus(state, { payload }) {
      setAuthority(payload.currentAuthority);
      return { ...state, status: payload.status };
    },
  },
};
export default Model;
