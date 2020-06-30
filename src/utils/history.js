import { createBrowserHistory, createHashHistory } from 'history';


let Router = createBrowserHistory();
if (process.env.ROUTE_TYPE === 'hash') {
  Router = createHashHistory();
}


const proxy = new Proxy(Router, {
  get(target, key) {
    return target[key];
  },
  set(target, key, value) {
    target[key] = value; // eslint-disable-line
  }
});

export default proxy;
