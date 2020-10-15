import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import util from '_src/utils/util';

function ajax(method, url, params) {
  return ont[method](url, params || undefined).then((data) => {
    if (data.code === 0) return data.data;
    else throw new Error(data.msg);
  });
}

function get(url, params = {}) {
  let method = 'get';
  //@mock method = 'post';
  return ajax(method, url, { params });
}

function exchange(params) {
  if (params.base_token && params.quote_token) {
    const temp = params.base_token;
    if (temp > params.quote_token) {
      params.base_token = params.quote_token;
      params.quote_token = temp;
    }
  }
}

//@mock let mocker = require('./mock');
export function tokens(params = {}) {
  //@mock mocker.tokens(URL.GET_SWAP_TOKENS);
  const address = util.getMyAddr();
  return get(URL.GET_SWAP_TOKENS, {
    base_token_name: params.symbol || '',
    address,
    support_route: !!params.support_route,
  });
}

export function buyInfo(params) {
  //@mock mocker.buyInfo(URL.GET_SWAP_BUY_INFO);
  return get(URL.GET_SWAP_BUY_INFO, params);
}

export function liquidityInfo(params = {}) {
  //@mock mocker.liquidityInfo(URL.GET_SWAP_LIQUIDITY_INFO);
  const address = util.getMyAddr();
  const _params = { ...params, address };
  exchange(_params);
  return get(URL.GET_SWAP_LIQUIDITY_INFO, _params);
}

export function addInfo(params) {
  //@mock mocker.addInfo(URL.GET_SWAP_ADD_INFO);
  return get(URL.GET_SWAP_ADD_INFO, params);
}

export function redeemableAssets(params = {}) {
  //@mock mocker.redeemableAssets(URL.GET_SWAP_REDEEMABLE_ASSETS);
  const _params = { ...params };
  exchange(_params);
  return get(URL.GET_SWAP_REDEEMABLE_ASSETS, _params);
}

export function tokenPair(params = {}) {
  //@mock mocker.tokenPair(URL.GET_SWAP_TOKEN_PAIR);
  const _params = { ...params };
  exchange(_params);
  return get(URL.GET_SWAP_TOKEN_PAIR, _params);
}

export function createLiquidityTokens(params) {
  //@mock mocker.createLiquidityTokens(URL.GET_SWAP_CREATE_LIQUIDITY_TOKENS);
  const address = util.getMyAddr();
  return get(URL.GET_SWAP_CREATE_LIQUIDITY_TOKENS, { ...params, address });
}

export function watchlist(params) {
  //@mock mocker.watchlist(URL.GET_SWAP_WATCHLIST);
  return get(URL.GET_SWAP_WATCHLIST, params);
}
