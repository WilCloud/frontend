// @ts-nocheck

import axios from 'axios';
import naiveui from './naiveui';
import { t } from '../i18n';

export const Axios = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

Axios.defaults.transformResponse = [
  (data, headers) => {
    if (
      typeof data === 'string' &&
      headers['content-type'] === 'application/json'
    ) {
      try {
        data = JSON.parse(data);
      } catch (e) {}
    }
    return data;
  },
];

Axios.interceptors.response.use(
  res => {
    res = res.data;
    if (res.message) {
      if (typeof res.message === 'string') {
        res.message = [res.message];
      }
      const params = [];
      for (let i = 1; i < res.message.length; i++) {
        params.push(t(res.message[i]));
      }
      if (res.status === 'forbidden') {
        naiveui.message.error(t(res.message[0], params));
        return Promise.reject(res);
      }
      if (res.status === 'success') {
        naiveui.message.success(t(res.message[0], params));
      }
    }
    return res;
  },
  _err => {
    naiveui.message.error(t('error.network'));
  }
);

export default Axios;
