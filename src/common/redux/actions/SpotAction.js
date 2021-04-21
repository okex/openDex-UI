import { calc, storage } from '_component/okit';

import Cookies from 'js-cookie';
import Enum from '../../utils/Enum';
import ont from '../../utils/dataProxy';
import SpotActionType from '../actionTypes/SpotActionType';
import util from '../../utils/util';
import URL from '../../constants/URL';
import SpotTradeActionType from '../actionTypes/SpotTradeActionType';
import env from '../../constants/env';

function resetProductConfig(product, productList) {
  if (!product) return;
  const currProduct = productList.filter((item) => item.product === product)[0];
  if (currProduct) {
    let defaultMerge = Enum.defaultMergeType;
    if (currProduct.mergeTypes && currProduct.mergeTypes.split) {
      defaultMerge =
        currProduct.mergeTypes.split(',')[0] || Enum.defaultMergeType;
    }
    currProduct.mergeType =
      Cookies.get(`${product}_depth_merge_stock`) || defaultMerge;
    window.OK_GLOBAL.productConfig = currProduct;
  }
}

export function updateWsIsDelay(status) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_WS_IS_DELAY,
      data: status,
    });
  };
}

export function updateWsStatus(status) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_WS_STATUS_V3,
      data: status,
    });
  };
}

export function addWsErrCounter() {
  return (dispatch, getState) => {
    const { wsErrCounterV3 } = getState().Spot;
    dispatch({
      type: SpotActionType.UPDATE_WS_ERR_COUNTER_V3,
      data: wsErrCounterV3 + 1,
    });
  };
}

export function fetchProducts() {
  return (dispatch, getState) => {
    ont.get(URL.GET_PRODUCTS).then((res) => {
      const { productList, productObj } = getState().SpotTrade;
      if (res.data.data) {
        res.data.data.forEach((item) => {
          const product = `${item.base_asset_symbol}_${item.quote_asset_symbol}`;
          let newItem = productObj[product];
          if (!newItem) {
            newItem = {
              ...item,
              product,
            };
            newItem.max_price_digit = Number(newItem.max_price_digit);
            newItem.max_size_digit = Number(newItem.max_size_digit);
            newItem.min_trade_size = Number(newItem.min_trade_size);
            newItem.price = calc.floorTruncate(
              newItem.price,
              newItem.max_price_digit
            );
            productObj[product] = newItem;
            productList.push(newItem);
          }
        });
        dispatch({
          type: SpotTradeActionType.FETCH_SUCCESS_PRODUCT_LIST,
          data: { productList, productObj },
        });
      }
    });
  };
}

export function fetchCollectAndProducts() {
  return () => {
    this.fetchProducts();
  };
}

export function fetchCurrency() {
  return (dispatch) => {
    ont
      .get(URL.GET_TOKENS)
      .then((res) => {
        const currencyList = res.data;
        const currencyObjByName = {};
        if (currencyList.length) {
          currencyList.forEach((item) => {
            currencyObjByName[item.symbol] = item;
          });
        }
        dispatch({
          type: SpotActionType.FETCH_SUCCESS_CURRENCY_LIST,
          data: { currencyList, currencyObjByName },
        });
      })
      .catch((res) => {
        dispatch({
          type: SpotActionType.FETCH_ERROR_CURRENCY_LIST,
          data: res,
        });
      });
  };
}

export function updateActiveMarket(market) {
  return (dispatch) => {
    storage.set(
      env.envConfig.token.activeMarketKey,
      JSON.stringify(market || {})
    );
    dispatch({
      type: SpotActionType.UPDATE_ACTIVE_MARKET,
      data: market,
    });
  };
}

export function updateFavoriteList(list) {
  return (dispatch) => {
    storage.set(env.envConfig.token.favoritesKey, list || []);
    dispatch({
      type: SpotTradeActionType.UPDATE_FAVORITES,
      data: list,
    });
  };
}

export function initProduct(productObj, productList, callback) {
  let product = '';

  const symbolInHash = util.getQueryHashString('product');
  if (symbolInHash) {
    if (productObj[symbolInHash.toLowerCase()]) {
      product = symbolInHash.toLowerCase();
    } else {
      window.history.replaceState(null, null, ' ');
    }
  }
  if (!product) {
    const favorites = storage.get(env.envConfig.token.favoritesKey);
    if (favorites) {
      product = favorites[0] || '';
    } else {
      product = env.envConfig.token.defaultProduct;
    }
  }
  resetProductConfig(product, productList);
  if (
    !storage.get(env.envConfig.token.productKey) ||
    storage.get(env.envConfig.token.productKey) !== product
  ) {
    storage.set(env.envConfig.token.productKey, product);
  }
  return (dispatch, getState) => {
    const { tickers } = getState().Spot;
    if (product) {
      dispatch({
        type: SpotActionType.UPDATE_SYMBOL,
        data: { product },
      });
      if (tickers && tickers[product]) {
        dispatch({
          type: SpotTradeActionType.UPDATE_TICKER,
          data: tickers[product],
        });
      }
    }
    callback && callback();
  };
}

export function updateSearch(text) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_SEARCH,
      data: text,
    });
  };
}

export function fetchTickers() {
  return (dispatch, getState) => {
    const { product } = getState().SpotTrade;
    ont.get(URL.GET_PRODUCT_TICKERS).then((res) => {
      const tickers = {};
      const arr = res.data;
      if (arr && arr.length) {
        arr.forEach((item) => {
          const newO = { ...item };
          newO.change = Number(newO.price) === -1 ? 0 : newO.price - newO.open;
          newO.changePercentage = util.getChangePercentage(newO);
          tickers[item.product] = newO;
        });
      }

      dispatch({
        type: SpotActionType.FETCH_SUCCESS_TICKERS,
        data: tickers,
      });
      if (product && tickers[product]) {
        dispatch({
          type: SpotTradeActionType.UPDATE_TICKER,
          data: tickers[product],
        });
      }
    });
  };
}

export function wsUpdateTickers(data) {
  return (dispatch, getState) => {
    const { tickers } = getState().Spot;
    const newTickers = tickers ? util.cloneDeep(tickers) : {};
    data.forEach((item) => {
      const { product } = item;
      if (product) {
        newTickers[product] = item;
      }
    });
    dispatch({
      type: SpotActionType.UPDATE_TICKERS,
      data: newTickers,
    });
  };
}

export function updateProduct(product) {
  return (dispatch, getState) => {
    const spotTradeStore = getState().SpotTrade;
    const oldProduct = spotTradeStore.product;
    if (product === oldProduct) {
      return false;
    }
    resetProductConfig(product, spotTradeStore.productList);
    dispatch({
      type: SpotActionType.UPDATE_SYMBOL,
      data: {
        product,
      },
    });
    dispatch({
      type: SpotTradeActionType.UPDATE_TICKER,
      data: getState().Spot.tickers[product],
    });
    storage.set(env.envConfig.token.productKey, product);
    return true;
  };
}

export function collectProduct(product) {
  return (dispatch, getState) => {
    const state = { ...getState().SpotTrade };
    const { productList, productObj } = state;
    const collect = product.collect ? 1 : 0;
    const newList = productList.map((item) => {
      const newItem = item;
      if (item.product === product.product) {
        newItem.collect = collect;
      }
      return newItem;
    });
    productObj[product.product].collect = collect;
    dispatch({
      type: SpotActionType.COLLECT_PRODUCT,
      data: { productList: newList, productObj },
    });
  };
}

export function fetchCnyRate() {
  return (dispatch) => {
    const fetchParam = {
      headers: {
        Authorization: localStorage.getItem(env.envConfig.dexToken) || '',
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      method: 'GET',
    };
    fetch(URL.GET_CNY_RATE, fetchParam)
      .then((response) => response.json())
      .then((response) => {
        const cnyRate = response.usd_cny_rate;
        dispatch({
          type: SpotActionType.UPDATE_CNY_RATE,
          data: cnyRate,
        });
      });
  };
}

export function updateTheme(theme) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_THEME,
      data: theme,
    });
  };
}
