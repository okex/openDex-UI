import axios from 'axios';
import { DEFAULT_NODE } from '_constants/apiConfig';
import { storage } from '_component/okit';
import PageURL from '../constants/PageURL';
import history from './history';
const reqTimeout = 10000;

axios.defaults.headers.common.timeout = reqTimeout;
axios.defaults.headers.common['App-Type'] = 'web';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

axios.interceptors.request.use(
  (request) => {
    const { url } = request;
    const time = Date.now();
    const queryMark = url.indexOf('?') > -1 ? '&' : '?';

    request.url += `${queryMark}t=${time}`;

    const currentNode = storage.get('currentNode') || DEFAULT_NODE;
    const { httpUrl = '' } = currentNode;
    request.url = request.url.replace('{domain}', httpUrl);

    const { headers } = request;
    const token = localStorage.getItem('dex_token');

    if (!headers.Authorization && token) {
      headers.Authorization = token;
    }
    return request;
  },
  (error) => {
    return Promise.reject(error);
  }
);

function toLogin() {
  localStorage.removeItem('dex_token');

  const isInApp = /OKApp\/\(\S+\/\S+\)/i.test(navigator.userAgent);

  if (!isInApp) {
    const { pathname, search, hash } = window.location;
    const forwardUrl = `${pathname}${search}${hash}`;
    history.push(
      `${PageURL.walletImport}?logout=true&forward=${encodeURIComponent(
        forwardUrl
      )}`
    );
  }

  return Promise.reject(new Error('Need Login'));
}

function checkStatus(response) {
  const hasResponseData = 'data' in response;

  if (!hasResponseData) {
    response.data = { msg: 'No Response Data' };
  }

  const { status, data, config } = response;

  if (status >= 200 && status < 300) {
    if (data.code === 800) {
      return toLogin();
    }
    return response;
  }

  if (status === 401 || status === 403) {
    return toLogin();
  }

  return Promise.reject(response);
}

axios.interceptors.response.use(
  (response) => {
    return checkStatus(response);
  },
  (err) => {
    if (err.response) {
      return checkStatus(err.response);
    }

    const errObj = {
      ...err,
      response: {
        data: { msg: 'Server Error' },
      },
    };

    return Promise.reject(errObj);
  }
);

axios.interceptors.response.use((response) => {
  const { data } = response;
  if (data && Number(data.code) === 0) {
    return Promise.resolve(data);
  }
  return Promise.reject(data || {});
});
export default axios;
