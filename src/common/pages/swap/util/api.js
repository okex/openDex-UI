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
  if(params.base_token && params.quote_token) {
    const temp = params.base_token;
    if(params.base_token > params.quote_token) {
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
    base_token: params.symbol || '',
    address,
    business_type: params.business_type,
  });
}

export function swapTokens(params = {}) {
  params = {...params,business_type:'swap'};
  return tokens(params);
}

export function addLiquidityTokens(params = {}) {
  params = {...params,business_type:'add'};
  return tokens(params);
}

export function createLiquidityTokens(params = {}) {
  params = {...params,business_type:'create'};
  return tokens(params);
}

export function buyInfo(params = {}) {
  //@mock mocker.buyInfo(`${URL.GET_SWAP_BUY_INFO}/${params.token}`);
  return get(`${URL.GET_SWAP_BUY_INFO}/${params.token}`, {sell_token_amount:params.sell_token_amount});
}

export function liquidityInfo(params={}) {
  //@mock mocker.liquidityInfo(URL.GET_SWAP_LIQUIDITY_INFO);
  const address = util.getMyAddr();
  params = {...params,address};
  exchange(params);
  return get(URL.GET_SWAP_LIQUIDITY_INFO, params);
}

export function addInfo(params = {}) {
  //@mock mocker.addInfo(`${URL.GET_SWAP_ADD_INFO}/${params.base_token}`);
  return get(`${URL.GET_SWAP_ADD_INFO}/${params.base_token}`, {quote_token_amount:params.quote_token_amount});
}

export function redeemableAssets(params={}) {
  //@mock mocker.redeemableAssets(`${URL.GET_SWAP_REDEEMABLE_ASSETS}/${params.base_token}_${params.quote_token}`);
  params = {...params};
  exchange(params);
  return get(`${URL.GET_SWAP_REDEEMABLE_ASSETS}/${params.base_token}_${params.quote_token}`, {liquidity:params.liquidity});
}

export function tokenPair(params={}) {
  //@mock mocker.tokenPair(`${URL.GET_SWAP_TOKEN_PAIR}/${params.base_token}_${params.quote_token}`);
  params = {...params};
  exchange(params);
  return get(`${URL.GET_SWAP_TOKEN_PAIR}/${params.base_token}_${params.quote_token}`);
}

export function watchlist(params) {
  //@mock mocker.watchlist(URL.GET_SWAP_WATCHLIST);
  return get(URL.GET_SWAP_WATCHLIST, params);
}
