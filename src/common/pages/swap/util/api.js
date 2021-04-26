import { get } from '_src/utils/apiUtil';
import URL from '_constants/URL';
import util from '_src/utils/util';

function exchange(params) {
  if (params.base_token && params.quote_token) {
    const temp = params.base_token;
    if (params.base_token > params.quote_token) {
      params.base_token = params.quote_token;
      params.quote_token = temp;
    }
  }
}

// @mock let mocker = require('./mock');
export function tokens(params = {}) {
  // @mock mocker.tokens(URL.GET_SWAP_TOKENS);
  const address = util.getMyAddr();
  return get(URL.GET_SWAP_TOKENS, {
    base_token: params.symbol || '',
    address,
    business_type: params.business_type,
  });
}

export function swapTokens(params = {}) {
  params = { ...params, business_type: 'swap' };
  return tokens(params);
}

export function addLiquidityTokens(params = {}) {
  params = { ...params, business_type: 'add' };
  return tokens(params);
}

export function createLiquidityTokens(params = {}) {
  params = { ...params, business_type: 'create' };
  return tokens(params);
}

export function buyInfo(params = {}) {
  // @mock mocker.buyInfo(`${URL.GET_SWAP_BUY_INFO}/${params.token}`);
  if (!params.token || !/\d$/.test(params.value)) return {};
  return get(`${URL.GET_SWAP_BUY_INFO}/${params.token}`, {
    sell_token_amount: params.sell_token_amount,
  });
}

export function liquidityInfo(params = {}) {
  const address = util.getMyAddr();
  if (!address || (params.base_token && !params.quote_token)) return null;
  params = { ...params };
  exchange(params);
  const token_pair_name = params.base_token
    ? `${params.base_token}_${params.quote_token}`
    : '';
  // @mock mocker.liquidityInfo(URL.GET_SWAP_LIQUIDITY_INFO);
  return get(URL.GET_SWAP_LIQUIDITY_INFO, {
    address,
    token_pair_name,
  });
}

export function addInfo(params = {}) {
  // @mock mocker.addInfo(`${URL.GET_SWAP_ADD_INFO}/${params.base_token}`);
  if (!params.base_token || !/\d$/.test(params.value)) return {};
  return get(`${URL.GET_SWAP_ADD_INFO}/${params.base_token}`, {
    quote_token_amount: params.quote_token_amount,
  });
}

export function redeemableAssets(params = {}) {
  params = { ...params };
  exchange(params);
  // @mock mocker.redeemableAssets(`${URL.GET_SWAP_REDEEMABLE_ASSETS}/${params.base_token}_${params.quote_token}`);
  return get(
    `${URL.GET_SWAP_REDEEMABLE_ASSETS}/${params.base_token}_${params.quote_token}`,
    { liquidity: params.liquidity }
  );
}

export function tokenPair(params = {}) {
  params = { ...params };
  exchange(params);
  // @mock mocker.tokenPair(`${URL.GET_SWAP_TOKEN_PAIR}/${params.base_token}_${params.quote_token}`);
  if (!params.base_token || !params.quote_token) return null;
  return get(
    `${URL.GET_SWAP_TOKEN_PAIR}/${params.base_token}_${params.quote_token}`
  );
}

export function watchlist(params) {
  // @mock mocker.watchlist(URL.GET_SWAP_WATCHLIST);
  return get(URL.GET_SWAP_WATCHLIST, params);
}

export async function getLiquidity(base, quote) {
  const params = {
    base_token: base,
    quote_token: quote,
  };
  let liquidity = null;
  let _liquidityInfo = null;
  let userLiquidity = null;
  try {
    liquidity = await tokenPair(params);
    _liquidityInfo = await liquidityInfo(params);
    userLiquidity = _liquidityInfo && _liquidityInfo[0];
  } catch (e) {}
  return { liquidity, liquidityInfo: _liquidityInfo, userLiquidity };
}
