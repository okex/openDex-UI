import ont from '_src/utils/dataProxy';
import { toLocale } from '_src/locale/react-locale';

function ajax(method, url, params) {
  return ont[method](url, params || undefined).then((data) => {
    if (data.code === 0) return data.data;
    else throw new Error(toLocale(`error.code.${data.code}`) || data.msg);
  });
}

export function get(url, params = {}) {
  const method = 'get';
  return ajax(method, url, { params });
}

export function post(url, params = {}) {
  const method = 'post';
  return ajax(method, url, { params });
}
