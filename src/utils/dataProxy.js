import axios from 'axios';
import { settingsAPIs } from '_constants/apiConfig';
import { storage } from '_component/okit';
import PageURL from '../constants/PageURL';
import history from './history';
// 超时时间
const reqTimeout = 10000;

// headers 通用配置
axios.defaults.headers.common.timeout = reqTimeout;
axios.defaults.headers.common['App-Type'] = 'web';
axios.defaults.headers.common['Content-Type'] = 'application/json';
axios.defaults.headers.common.Accept = 'application/json';

// request 预处理 添加 Authorization 和 devId
axios.interceptors.request.use((request) => {
  const { url } = request;
  const time = Date.now();
  const queryMark = url.indexOf('?') > -1 ? '&' : '?';

  // 添加时间戳 防止缓存
  request.url += `${queryMark}t=${time}`;

  const currentNode = storage.get('currentNode') || settingsAPIs.DEFAULT_NODE;
  const { httpUrl = '' } = currentNode;
  request.url = request.url.replace('{domain}', httpUrl);

  const { headers } = request;
  const token = localStorage.getItem('dex_token');

  if (!headers.Authorization && token) {
    headers.Authorization = token;
  }

  return request;
}, (error) => {
  return Promise.reject(error);
});

// 跳登录页
function toLogin() {
  localStorage.removeItem('dex_token');

  const isInApp = /OKApp\/\(\S+\/\S+\)/i.test(navigator.userAgent);

  // 如果不是App的H5环境就跳到登录页面(App需要手动跳转到原生登录界面)
  if (!isInApp) {
    const { pathname, search, hash } = window.location;
    const forwardUrl = `${pathname}${search}${hash}`;
    history.push(`${PageURL.homePage}/wallet/import?logout=true&forward=${encodeURIComponent(forwardUrl)}`);
  }

  return Promise.reject(new Error('Need Login'));
}

// 检查响应状态 处理 token 续期和令牌失效
function checkStatus(response) {
  const hasResponseData = 'data' in response;

  // 避免业务中data.code报错
  if (!hasResponseData) {
    response.data = { msg: 'No Response Data' };
  }

  const { status, data, config } = response;

  if (status >= 200 && status < 300) {
    // 业务层 令牌失效 跳转登录
    if (data.code === 800) {
      // 防止后续代码执行
      return toLogin();
    }
    return response;
  }

  // 无效 跳转登录
  if (status === 401 || status === 403) {
    // 防止后续代码执行
    return toLogin();
  }

  return Promise.reject(response);
}

// response 预处理
axios.interceptors.response.use((response) => {
  return checkStatus(response);
}, (err) => {
  if (err.response) {
    return checkStatus(err.response);
  }

  // 对response做兼容
  const errObj = {
    ...err,
    response: {
      data: { msg: 'Server Error' }
    },
  };

  return Promise.reject(errObj);
});


axios.interceptors.response.use((response) => {
  const { data } = response;
  if (data && Number(data.code) === 0) {
    return Promise.resolve(data);
  }
  return Promise.reject(data || {});
});
export default axios;
