import { storage } from '_src/component/okit';
import { settingsAPIs } from '_constants/apiConfig';
import websocketURL from '../constants/websocketURL';
import util from './util';


// v3 订阅频道 和 取消订阅频道 登录 方法
export const wsV3 = {
  login: (token) => {
    window.OK_GLOBAL.ws_v3.sendChannel(JSON.stringify({
      op: 'dex_jwt', args: token,
    }));
  },
  send: (subChannelsArgs = []) => {
    if (subChannelsArgs.length) {
      window.OK_GLOBAL.ws_v3.sendChannel(JSON.stringify({
        op: 'subscribe',
        args: subChannelsArgs
      }));
    }
  },
  stop: (subChannelsArgs = []) => {
    if (subChannelsArgs.length) {
      window.OK_GLOBAL.ws_v3.sendChannel(JSON.stringify({
        op: 'unsubscribe',
        args: subChannelsArgs
      }));
    }
  },
};

/**
 * yao 格式化币对,兼容v3版本
 * @param product
 * @returns {string} 如果product为真值 返回大写横线链接的币对; 否则返回*
 */
const formatProduct = (product) => {
  if (!product) {
    return '*';
  }
  return product;
  // return product.replace('_', '-').toUpperCase();
};

// 币币交易用到的所有频道v3
export const channelsV3 = {
  getBaseBalance: (product) => { // 交易币种
    const base = product && product.split('_')[0];
    return `dex_spot/account:${base}`; // :${formatProduct(symbol)}
  },
  getQuoteBalance: (product) => { // 计价币种
    const quote = product && product.split('_')[1];
    return `dex_spot/account:${quote}`; // :${formatProduct(symbol)}
  },
  getOpenOrder: () => { // 币币交易，获取指定币对策略委托交易数据
    return 'dex_spot/order:*';
    // return `dex_spot/open_order:${addr}`;
  },
  // ticker
  getTicker(product) {
    return `dex_spot/ticker:${formatProduct(product)}`;
  },
  getAllMarketTickers: () => { // 订阅所有行情(3s)
    return 'dex_spot/all_ticker_3s';
  },
  // 市场深度
  getDepth(product) {
    return `dex_spot/optimized_depth:${formatProduct(product)}`;
  },
  // 最新成交
  getMatches(product) {
    return `dex_spot/matches:${formatProduct(product)}`;
  },
};

export const getWsUrl = () => {
  const host = window.location.hostname;
  const isDevEnv = host.includes('dev-okex'); // 开发联调环境
  const isQaEnv = host.includes('.docker.'); // 测试环境
  const isSvc = host.includes('.test-'); // k8s 开发环境
  let url = '';
  if (host.includes('192.168.')
    || host.includes('localhost')
    || host.includes('127.0.0.1')) { // 本地调试
    url = websocketURL.LOCAL;
  } else if (isDevEnv) {
    url = websocketURL.DEV;
  } else {
    const SITE = 'DEX';
    let ENV = 'PROD';
    let svcServer = '';
    if (isQaEnv) {
      ENV = 'QA';
    } else if (isSvc) {
      ENV = 'SVC';
      const svcReg = /test-.-(okex|com|coinall)/;
      svcServer = host.match(svcReg)[0];
    }
    url = websocketURL[SITE][ENV];
    if (isSvc) {
      url = url.replace('{server}', svcServer);
    }
  }
  // return url;
  // new
  const currentNode = storage.get('currentNode') || settingsAPIs.DEFAULT_NODE;
  return currentNode.wsUrl;
};

// 获取 websocket 连接所需配置信息
export const getConnectCfg = () => {
  return {
    connectUrl: getWsUrl()
  };
};
