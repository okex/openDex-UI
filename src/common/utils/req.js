import 'whatwg-fetch';
import Message from '_src/component/Message';
import util from './util';
import PageURL from '../constants/PageURL';
import history from './history';

const MOCK = false;

function handleStatus(response) {
  const { status } = response;
  if ([401, 403].includes(status)) {
    const { pathname, search, hash } = window.location;
    const forward = encodeURIComponent(pathname + search + hash);
    history.push(
      `${PageURL.homePage}/dex/account/login?logout=true&forward=${forward}`
    );
  }
  if (status >= 200 && status < 300) {
    const newToken = response.headers.get('x-ok-token');
    if (newToken && newToken.length !== 0) {
      localStorage.setItem('dex_token', newToken);
    }
    return response;
  }
  return Promise.reject(response);
}

function handleError(response, errorCallback) {
  if (errorCallback) {
    return errorCallback(response);
  } else if (response && response.msg) {
    return Message.error({ content: response.msg });
  }
  return false;
}

export function doFetch(url, paramObj, successCallback, errorCallback) {
  if (MOCK) {
    paramObj.method = 'GET';
    url += '.json';
  }
  const fetchParam = {
    headers: {
      Authorization: localStorage.getItem('dex_token') || '',
      devid: localStorage.getItem('devid') || '',
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    ...paramObj,
  };
  return fetch(url, fetchParam)
    .then(handleStatus)
    .then((response) => {
      return response.json();
    })
    .then((response) => {
      if (response && response.code === 0) {
        if (successCallback) {
          return successCallback(response);
        }
        return response;
      } else if ([800].includes(response.code)) {
        window.location.href = '/account/login?logout=true';
        return false;
      }
      return handleError(response, errorCallback);
    })
    .catch((response) => {
      return handleError(response, errorCallback);
    });
}

export function getData(url, params, successCallback, errorCallback) {
  if (typeof params === 'function') {
    errorCallback = successCallback;
    successCallback = params;
    params = {};
  }
  const queryString = util.objToQueryString(params);
  let fetchUrl = url;
  if (queryString && !MOCK) {
    fetchUrl += url.indexOf('?') > 0 ? `&${queryString}` : `?${queryString}`;
  }
  const paramObj = {
    method: 'GET',
  };
  return doFetch(fetchUrl, paramObj, successCallback, errorCallback);
}

export function deleteData(url, params, successCallback, errorCallback) {
  const paramObj = {
    method: 'DELETE',
    body: JSON.stringify(params),
  };
  return doFetch(url, paramObj, successCallback, errorCallback);
}

export function postData(url, params, successCallback, errorCallback) {
  const paramObj = {
    method: 'POST',
    body: JSON.stringify(params),
  };
  return doFetch(url, paramObj, successCallback, errorCallback);
}

export function download(url, data) {
  const header = {
    Accept: 'application/json',
    'Content-Type': 'application/json',
    app_type: 'web',
  };
  header.Authorization = localStorage.getItem('dex_token');
  let fetchUrl = url;
  if (data) {
    let query = '';
    Object.keys(data).forEach((key, i) => {
      const kv = `${key}=${data[key]}`;
      query += (i > 0 ? '&' : '?') + kv;
    });
    fetchUrl += query;
  }

  return fetch(fetchUrl, {
    method: 'GET',
    headers: header,
    credentials: 'include',
  }).then((response) => {
    return response.blob();
  });
}
