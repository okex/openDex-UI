import { calc } from '_component/okit';
import { storage } from '_component/okit';
import Cookies from 'js-cookie';
import Enum from '../../utils/Enum';
import ont from '../../utils/dataProxy';
import SpotActionType from '../actionTypes/SpotActionType';
import util from '../../utils/util';
import URL from '../../constants/URL';
import SpotTradeActionType from '../actionTypes/SpotTradeActionType';


/*
 * 重置当前币对配置信息
 * */
function resetProductConfig(product, productList) {
  if (!product) return;
  const currProduct = productList.filter((item) => { return item.product === product; })[0];
  if (currProduct) {
    let defaultMerge = Enum.defaultMergeType;
    if (currProduct.mergeTypes && currProduct.mergeTypes.split) {
      defaultMerge = currProduct.mergeTypes.split(',')[0] || Enum.defaultMergeType;
    }
    currProduct.mergeType = Cookies.get(`${product}_depth_merge_stock`) || defaultMerge; // 深度合并系数
    window.OK_GLOBAL.productConfig = currProduct;
  }
}

/**
 * 更新ws登录为延迟
 */
export function updateWsIsDelay(status) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_WS_IS_DELAY,
      data: status
    });
  };
}

/**
 * 更新ws连接状态-已连接
 */
export function updateWsStatus(status) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_WS_STATUS_V3,
      data: status
    });
  };
}

/**
 * 更新ws连接状态-断线
 */
export function addWsErrCounter() {
  return (dispatch, getState) => {
    const { wsErrCounterV3 } = getState().Spot;
    dispatch({
      type: SpotActionType.UPDATE_WS_ERR_COUNTER_V3,
      data: wsErrCounterV3 + 1
    });
  };
}

/**
 * 获取所有在线币对
 */
export function fetchProducts() {
  return (dispatch, getState) => {
    ont.get(URL.GET_PRODUCTS).then((res) => {
      const { productList, productObj } = getState().SpotTrade;
      // if (deleteFirst) {
      //   productList.forEach((item) => {
      //     const { groupIds } = item;
      //     const groupIndex = groupIds.indexOf(groupId);
      //     if (groupIndex > -1) {
      //       groupIds.splice(groupIndex, 1);
      //     }
      //   });
      // }
      if (res.data.data) {
        res.data.data.forEach((item, index) => {
          // TODO
          // if (item.quote_asset_symbol === 'tokt') {
          //   item.quote_asset_symbol = 'tusdk';
          // }

          const product = `${item.base_asset_symbol}_${item.quote_asset_symbol}`;
          let newItem = productObj[product];
          if (newItem) {
            // if (!newItem.groupIds.includes(groupId)) {
            //   newItem.groupIds.push(groupId);
            // }
          } else {
            newItem = {
              ...item,
              product,
              // groupIds: [groupId]
            };
            newItem.max_price_digit = Number(newItem.max_price_digit);
            newItem.max_size_digit = Number(newItem.max_size_digit);
            newItem.min_trade_size = Number(newItem.min_trade_size);
            newItem.price = calc.floorTruncate(newItem.price, newItem.max_price_digit);
            productObj[product] = newItem;
            productList.push(newItem);
          }
          // newItem[`productSort${groupId}`] = index;
        });
        // 设置配置信息在 initProduct 方法中
        // window.OK_GLOBAL.productConfig = productObj[product];
        dispatch({
          type: SpotTradeActionType.FETCH_SUCCESS_PRODUCT_LIST,
          data: { productList, productObj }
        });
      }
    });
  };
}

/**
 * 获取所有收藏币对，然后获取币对
 */
export function fetchCollectAndProducts() {
  return () => {
    this.fetchProducts();
  };
}

/**
 * 获取所有币种
 */
export function fetchCurrency() {
  return (dispatch) => {
    ont.get(URL.GET_TOKENS).then((res) => {
      const currencyList = res.data;
      const currencyObjByName = {};
      if (currencyList.length) {
        currencyList.forEach((item) => {
          currencyObjByName[item.symbol] = item;
        });
      }
      dispatch({
        type: SpotActionType.FETCH_SUCCESS_CURRENCY_LIST,
        data: { currencyList, currencyObjByName }
      });
    }).catch((res) => {
      dispatch({
        type: SpotActionType.FETCH_ERROR_CURRENCY_LIST,
        data: res
      });
    });
  };
}

/**
 * 更新交易区
 */
export function updateActiveMarket(market) {
  return (dispatch) => {
    storage.set('activeMarket', JSON.stringify(market || {}));
    dispatch({
      type: SpotActionType.UPDATE_ACTIVE_MARKET,
      data: market
    });
  };
}

/**
 * 更新本地收藏列表
 * @param {Array} list
 */
export function updateFavoriteList(list) {
  return (dispatch) => {
    storage.set('favorites', list || []);
    dispatch({
      type: SpotTradeActionType.UPDATE_FAVORITES,
      data: list,
    });
  };
}

/*
 * 初始化更新设置当前币对
 * */
export function initProduct(productObj, productList, callback) {
  let product = '';

  const symbolInHash = util.getQueryHashString('product');
  if (symbolInHash) {
    //  1、尝试从url的hash中取当前币对
    if (productObj[symbolInHash.toLowerCase()]) {
      product = symbolInHash.toLowerCase();
    } else {
      // 去掉hash
      window.history.replaceState(null, null, ' ');
    }
  }
  if (!product) {
    const favorites = storage.get('favorites');
    if (favorites) {
      product = favorites[0] || '';
    } else {
      product = 'tbtc_tusdk';
    }
  }
  // 重置当前币对配置信息
  resetProductConfig(product, productList);
  //  更新cookie
  if (!storage.get('product') || storage.get('product') !== product) {
    storage.set('product', product);
  }
  return (dispatch, getState) => {
    // dispatch({
    //   type: SpotActionType.UPDATE_ACTIVE_MARKET,
    //   data: activeMarket
    // });
    const { tickers } = getState().Spot;
    if (product) {
      dispatch({
        type: SpotActionType.UPDATE_SYMBOL,
        data: { product }
      });
      if (tickers && tickers[product]) {
        dispatch({
          type: SpotTradeActionType.UPDATE_TICKER,
          data: tickers[product]
        });
      }
    }
    callback && callback();
  };
}

/**
 * 更新查询条件
 */
export function updateSearch(text) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_SEARCH,
      data: text
    });
  };
}

/**
 * 获取所有币对行情
 */
export function fetchTickers() {
  return (dispatch, getState) => {
    const product = getState().SpotTrade.product;
    ont.get(URL.GET_PRODUCT_TICKERS).then((res) => {
      const tickers = {};
      const arr = res.data;
      if (arr.length) {
        arr.forEach((item) => {
          const newO = { ...item };
          newO.change = (Number(newO.price) === -1) ? 0 : (newO.price - newO.open);
          newO.changePercentage = util.getChangePercentage(newO);
          tickers[item.product] = newO;
        });
      }

      dispatch({
        type: SpotActionType.FETCH_SUCCESS_TICKERS,
        data: tickers
      });
      if (product && tickers[product]) {
        // ws推送连接不上，需用通过这里轮询更新currencyTicker
        dispatch({
          type: SpotTradeActionType.UPDATE_TICKER,
          data: tickers[product]
        });
      }
    });
  };
}

/**
 * 批量更新tickers
 */
export function wsUpdateTickers(data) {
  return (dispatch, getState) => {
    const { tickers } = getState().Spot;
    const newTickers = tickers ? util.cloneDeep(tickers) : {};
    data.forEach((item) => {
      const product = item.product;
      if (product) {
        newTickers[product] = item;
      }
    });
    dispatch({
      type: SpotActionType.UPDATE_TICKERS,
      data: newTickers
    });
  };
}
/*
 * 更新当前币对
 * */
export function updateProduct(product) {
  return (dispatch, getState) => {
    const spotTradeStore = getState().SpotTrade;
    const oldProduct = spotTradeStore.product;
    if (product === oldProduct) {
      return false;
    }
    if (product) { // 去"账单"等页面时，会清空symbol
      if (oldProduct) { // 没有symbol认为是从账单页面跳转过来的，统计由RouterCredential负责
        // 页面统计
        // util.logRecord();
      }
    }
    // 重置当前币对配置信息
    resetProductConfig(product, spotTradeStore.productList);
    dispatch({
      type: SpotActionType.UPDATE_SYMBOL,
      data: {
        product
      }
    });
    dispatch({
      type: SpotTradeActionType.UPDATE_TICKER,
      data: getState().Spot.tickers[product]
    });
    storage.set('product', product);
    return true;
  };
}

/*
 * 币对收藏
 * */
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
    // todo 修改了原始的state，最好Immutable
    productObj[product.product].collect = collect;
    dispatch({
      type: SpotActionType.COLLECT_PRODUCT,
      data: { productList: newList, productObj }
    });
  };
}

/*
 * 获取人民币汇率
 * */
export function fetchCnyRate() {
  return (dispatch) => {
    const fetchParam = {
      headers: {
        Authorization: localStorage.getItem('dex_token') || '',
        Accept: 'application/json',
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      method: 'GET'
    };
    fetch(URL.GET_CNY_RATE, fetchParam)
      .then((response) => { return response.json(); })
      .then((response) => {
        const cnyRate = response.usd_cny_rate;
        dispatch({
          type: SpotActionType.UPDATE_CNY_RATE,
          data: cnyRate
        });
      });
  };
}

/*
 * 更改当前主题
 * */
export function updateTheme(theme) {
  return (dispatch) => {
    dispatch({
      type: SpotActionType.UPDATE_THEME,
      data: theme
    });
  };
}
