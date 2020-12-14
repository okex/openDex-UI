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
  const method = 'get';
  return ajax(method, url, { params });
}

function exchange(params) {
  if (params.base_token && params.quote_token) {
    const temp = params.base_token;
    if (params.base_token > params.quote_token) {
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
  }).then((data) => {
    data &&
      data.tokens.forEach(
        (d) => (d.available = util.precisionInput(d.available))
      );
    return data;
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
  //@mock mocker.buyInfo(`${URL.GET_SWAP_BUY_INFO}/${params.token}`);
  return get(`${URL.GET_SWAP_BUY_INFO}/${params.token}`, {
    sell_token_amount: params.sell_token_amount,
  }).then((data) => {
    if (data) {
      data.buy_amount = util.precisionInput(data.buy_amount);
      data.price = util.precisionInput(data.price);
      data.price_impact = util.precisionInput(data.price_impact);
      data.fee = data.fee.replace(/(\d{1,}\.?\d*)/,function($1) {
        return util.precisionInput($1)
      });
    }
    return data;
  });
}

export function liquidityInfo(params = {}) {
  const address = util.getMyAddr();
  params = { ...params };
  exchange(params);
  const token_pair_name = params.base_token
    ? `${params.base_token}_${params.quote_token}`
    : '';
  //@mock mocker.liquidityInfo(URL.GET_SWAP_LIQUIDITY_INFO);
  return get(URL.GET_SWAP_LIQUIDITY_INFO, {
    address,
    token_pair_name,
  }).then((data) => {
    if (data) {
      data.forEach((d) => (d.amount = util.precisionInput(d.amount)));
      data.pool_token_ratio = util.precisionInput(data.pool_token_ratio);
    }
    return data;
  });
}

export function addInfo(params = {}) {
  //@mock mocker.addInfo(`${URL.GET_SWAP_ADD_INFO}/${params.base_token}`);
  return get(`${URL.GET_SWAP_ADD_INFO}/${params.base_token}`, {
    quote_token_amount: params.quote_token_amount,
  }).then((data) => {
    if (data) {
      data.base_token_amount = util.precisionInput(data.base_token_amount);
      data.pool_share = util.precisionInput(data.pool_share);
    }
    return data;
  });
}

export function redeemableAssets(params = {}) {
  params = { ...params };
  exchange(params);
  //@mock mocker.redeemableAssets(`${URL.GET_SWAP_REDEEMABLE_ASSETS}/${params.base_token}_${params.quote_token}`);
  return get(
    `${URL.GET_SWAP_REDEEMABLE_ASSETS}/${params.base_token}_${params.quote_token}`,
    { liquidity: params.liquidity }
  ).then((data) => {
    data && data.forEach((d) => (d.amount = util.precisionInput(d.amount)));
    return data;
  });
}

export function tokenPair(params = {}) {
  params = { ...params };
  exchange(params);
  //@mock mocker.tokenPair(`${URL.GET_SWAP_TOKEN_PAIR}/${params.base_token}_${params.quote_token}`);
  return get(
    `${URL.GET_SWAP_TOKEN_PAIR}/${params.base_token}_${params.quote_token}`
  ).then((data) => {
    if (data) {
      data.quote_pooled_coin.amount = util.precisionInput(
        data.quote_pooled_coin.amount
      );
      data.base_pooled_coin.amount = util.precisionInput(
        data.base_pooled_coin.amount
      );
    }
    return data;
  });
}

export function watchlist(params) {
  //@mock mocker.watchlist(URL.GET_SWAP_WATCHLIST);
  return get(URL.GET_SWAP_WATCHLIST, params).then((data) => {
    if (data.data) {
      data.data.forEach((d) => {
        d.liquidity = util.precisionInput(d.liquidity);
        d.volume24h = util.precisionInput(d.volume24h);
        d.fee_apy = util.precisionInput(d.fee_apy);
        d.last_price = util.precisionInput(d.last_price);
        d.change24h = util.precisionInput(d.change24h);
      });
    }
    return data;
  });
}
