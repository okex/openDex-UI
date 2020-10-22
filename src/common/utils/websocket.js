import { storage } from '_src/component/okit';
import { DEFAULT_NODE } from '_constants/apiConfig';
import websocketURL from '../constants/websocketURL';

function canSend() {
  if (
    window.OK_GLOBAL &&
    window.OK_GLOBAL.ws_v3 &&
    window.OK_GLOBAL.ws_v3.isConnected()
  )
    return true;
  return false;
}

export function getWsV3(wsV3) {
  return  {
    canSend() {
      if(!wsV3) return canSend();
      return wsV3.isConnected();
    },
    login(token) {
      if (!this.canSend()) return;
      (wsV3 || window.OK_GLOBAL.ws_v3).sendChannel(
        JSON.stringify({
          op: 'dex_jwt',
          args: [token],
        })
      );
    },
    send(subChannelsArgs = []) {
      if (!this.canSend()) return;
      if(!Array.isArray(subChannelsArgs)) subChannelsArgs = [subChannelsArgs];
      if (subChannelsArgs.length) {
        (wsV3 || window.OK_GLOBAL.ws_v3).sendChannel(
          JSON.stringify({
            op: 'subscribe',
            args: subChannelsArgs,
          })
        );
      }
    },
    stop(subChannelsArgs = []) {
      if (!this.canSend()) return;
      if(!Array.isArray(subChannelsArgs)) subChannelsArgs = [subChannelsArgs];
      if (subChannelsArgs.length) {
        (wsV3 || window.OK_GLOBAL.ws_v3).sendChannel(
          JSON.stringify({
            op: 'unsubscribe',
            args: subChannelsArgs,
          })
        );
      }
    },
  }
}

export const wsV3 = getWsV3();

const formatProduct = (product) => {
  if (!product) {
    return '*';
  }
  return product;
};

export const channelsV3 = {
  getBalance: (token) => {
    return `dex_spot/account:${token}`;
  },
  getBaseBalance: (product) => {
    const base = product && product.split('_')[0];
    return channelsV3.getBalance(base);
  },
  getQuoteBalance: (product) => {
    const quote = product && product.split('_')[1];
    return channelsV3.getBalance(quote);
  },
  getOpenOrder: () => {
    return 'dex_spot/order:*';
  },
  getTicker(product) {
    return `dex_spot/ticker:${formatProduct(product)}`;
  },
  getAllMarketTickers: () => {
    return 'dex_spot/all_ticker_3s';
  },
  getDepth(product) {
    return `dex_spot/optimized_depth:${formatProduct(product)}`;
  },
  getMatches(product) {
    return `dex_spot/matches:${formatProduct(product)}`;
  },
};

export const getWsUrl = () => {
  const host = window.location.hostname;
  const isDevEnv = host.includes('dev-okex');
  const isQaEnv = host.includes('.docker.');
  const isSvc = host.includes('.test-');
  let url = '';
  if (
    host.includes('192.168.') ||
    host.includes('localhost') ||
    host.includes('127.0.0.1')
  ) {
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
  const currentNode = storage.get('currentNode') || DEFAULT_NODE;
  return currentNode.wsUrl;
};

export const getConnectCfg = () => {
  return {
    connectUrl: getWsUrl(),
  };
};
