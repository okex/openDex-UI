import { calc, depth } from '_component/okit';
import ont from '../../utils/dataProxy';
import util from '../../utils/util';
import URL from '../../constants/URL';
import SpotTradeActionType from '../actionTypes/SpotTradeActionType';
import Enum from '../../utils/Enum';
import SpotActionType from '../actionTypes/SpotActionType';
import FormatAsset from '../../utils/FormatAsset';
import { wsV3 } from '../../utils/websocket';

export function fetchAccountAssets(callback) {
  return (dispatch, getState) => {
    const senderAddr = util.getMyAddr();
    if (!senderAddr) return;
    ont
      .get(`${URL.GET_ACCOUNTS}/${senderAddr}`)
      .then((res) => {
        const { currencies } = res.data;
        const account = {};
        currencies.forEach((item) => {
          account[item.symbol.toLowerCase()] = item;
        });
        const { product } = getState().SpotTrade;
        const { productConfig } = window.OK_GLOBAL;
        const spotAsset = FormatAsset.getSpotData(
          product,
          account,
          productConfig
        );
        dispatch({
          type: SpotTradeActionType.FETCH_UPDATE_ASSETS,
          data: { account, spotAsset },
        });
        return callback && callback();
      })
      .catch((res) =>
        dispatch({
          type: SpotTradeActionType.FETCH_ERROR_ASSETS,
          data: res.msg,
        })
      );
  };
}

const transferDepth = (data) => {
  const result = {
    bids: [],
    asks: [],
  };
  if (data.bids) {
    result.bids = data.bids.map((item) => [
      +item.price,
      +item.quantity,
      calc.mul(+item.price, +item.quantity),
    ]);
  }
  if (data.asks) {
    result.asks = data.asks.map((item) => [
      +item.price,
      +item.quantity,
      calc.mul(+item.price, +item.quantity),
    ]);
  }
  return result;
};

export function clearSortPushDepthData() {
  return (dispatch) => {
    depth.clear();
    dispatch({
      type: SpotTradeActionType.FETCH_CLEAR_UPDATE_DEPTH,
    });
  };
}

export function fetchDepth(product) {
  return (dispatch) => {
    ont.get(URL.GET_DEPTH_BOOK, { params: { product } }).then((res) => {
      if (wsV3.canSend()) {
        return;
      }
      const formattedData = transferDepth(res.data);
      const { productConfig, tradeType } = window.OK_GLOBAL;
      dispatch(clearSortPushDepthData());

      const depth200 = depth.addData(formattedData);
      const depthSize = tradeType === Enum.tradeType.normalTrade ? 20 : 30;
      const defaultMergeType = util.generateMergeType(
        Number(productConfig.max_price_digit)
      );
      const depthData = depth.getDepth(defaultMergeType, depthSize);
      dispatch({
        type: SpotTradeActionType.UPDATE_DEPTH,
        data: {
          depth: depthData,
          depth200,
        },
      });
    });
  };
}

export function wsUpdateDepth(data) {
  return (dispatch, getState) => {
    const tradeState = getState().SpotTrade;
    if (data.action === 'partial') {
      dispatch(clearSortPushDepthData());
    }

    const { product } = tradeState;
    if (product === '') {
      return false;
    }
    if (`${data.base}_${data.quote}` !== product) {
      return false;
    }
    const formattedData = transferDepth(data.data);
    const { productConfig, tradeType } = window.OK_GLOBAL;
    const depth200 = depth.addData(formattedData);
    const depthSize = tradeType === Enum.tradeType.fullTrade ? 30 : 20;
    const defaultMergeType = util.generateMergeType(
      Number(productConfig.max_price_digit)
    );
    const depthData = depth.getDepth(defaultMergeType, depthSize);
    return dispatch({
      type: SpotTradeActionType.UPDATE_DEPTH,
      data: {
        depth: depthData,
        depth200,
      },
    });
  };
}

export function refreshAsset() {
  return (dispatch, getState) => {
    const { product, account } = getState().SpotTrade;
    const { productConfig } = window.OK_GLOBAL;
    const spotAsset = FormatAsset.getSpotData(product, account, productConfig);
    return dispatch({
      type: SpotTradeActionType.REFRESH_ASSETS,
      data: { spotAsset },
    });
  };
}

export function wsUpdateAsset(data) {
  return (dispatch, getState) => {
    const { product, currencyObjByName } = getState().SpotTrade;
    const state = getState().SpotTrade;
    const account = { ...state.account };
    if (data instanceof Array && data.length) {
      for (let i = 0; i < data.length; i++) {
        const symbol = data[i].symbol;
        if (currencyObjByName[symbol]) {
          account[currencyObjByName[symbol].symbol.toLowerCase()] = data[i];
        }
      }
    } else if (
      Object.prototype.toString.call(data) === '[object Object]' &&
      Object.keys(data).length > 0
    ) {
      account[currencyObjByName[data.symbol].symbol.toLowerCase()] = data;
    }
    const { productConfig } = window.OK_GLOBAL;
    const spotAsset = FormatAsset.getSpotData(product, account, productConfig);
    dispatch({
      type: SpotTradeActionType.FETCH_UPDATE_ASSETS,
      data: { account, spotAsset },
    });
  };
}

export function wsUpdateTicker(data) {
  return (dispatch, getState) => {
    const { currencyTicker, product } = getState().SpotTrade;
    if (product.toLowerCase() !== data.product.toLowerCase()) {
      return false;
    }
    let newCurrencyTicker = currencyTicker
      ? util.cloneDeep(currencyTicker)
      : {};
    if (data instanceof Array) {
      newCurrencyTicker = { ...newCurrencyTicker, ...data[0] };
    } else {
      newCurrencyTicker = { ...newCurrencyTicker, ...data };
    }
    const { tickers } = getState().Spot;
    const newTickers = tickers ? util.cloneDeep(tickers) : {};
    newTickers[product] = newCurrencyTicker;
    dispatch({
      type: SpotTradeActionType.UPDATE_TICKER,
      data: newCurrencyTicker,
    });
    dispatch({
      type: SpotActionType.UPDATE_TICKERS,
      data: newTickers,
    });
    return false;
  };
}

export function clearKlineData() {
  return (dispatch) => {
    dispatch({
      type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
      data: [],
    });
  };
}

export function getKlineDataByAjax(product, callback) {
  return (dispatch, getState) => {
    ont
      .get(URL.GET_KLINE_DATA, {
        params: {
          product,
          type: '1min',
        },
      })
      .then((res) => {
        if (getState().SpotTrade.product.toLowerCase() !== product) {
          return false;
        }
        let klineData = res.data;
        if (klineData.length > 300) {
          klineData = klineData.slice(klineData.length - 300);
        }
        dispatch({
          type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
          data: klineData,
        });
        return callback && callback();
      });
  };
}

export function wsUpdateKlineData(klinedata) {
  return (dispatch, getState) => {
    const state = getState().SpotTrade;
    const { product } = state;
    if (product === '') {
      return false;
    }
    if (
      product.toLowerCase() !==
      `${klinedata.base}_${klinedata.quote}`.toLowerCase()
    ) {
      return false;
    }
    const data = klinedata.data;
    let klineData = [...state.klineData];
    if (klineData.length) {
      const lastItem = klineData[klineData.length - 1];
      const appendData = [];
      for (let i = 0; i < data.length; i++) {
        const e = data[i];
        if (Number(e.createdDate) === Number(lastItem.createdDate)) {
          const isEqual = Number(lastItem.close) === Number(e.close);
          if (!isEqual) {
            klineData[klineData.length - 1] = e;
          }
        } else if (Number(e.createdDate) > Number(lastItem.createdDate)) {
          appendData.push(e);
        }
      }
      if (appendData.length) {
        let newData = klineData.concat(appendData);
        if (newData.length > 300) {
          newData = newData.slice(newData.length - 300);
        }
        klineData = newData;
      }
    } else {
      return false;
    }

    return dispatch({
      type: SpotTradeActionType.FETCH_SUCCESS_KLINE_DATA,
      data: klineData,
    });
  };
}

export function updateTransfer(value) {
  return (dispatch) => {
    dispatch({
      type: SpotTradeActionType.UPDATE_TRANSFER,
      data: value,
    });
  };
}

export function addColorToDeals(arr) {
  const data = [...arr];
  const l = data.length;
  if (!data[l - 1].color) {
    data[l - 1].color = 'deals-green';
  }
  if (data.length === 1) {
    return data;
  }
  for (let i = l - 1; i > 0; i--) {
    if (data[i - 1].price > data[i].price) {
      data[i - 1].color = 'deals-green';
    } else if (data[i - 1].price < data[i].price) {
      data[i - 1].color = 'deals-red';
    } else if (data[i].color === 'deals-green') {
      data[i - 1].color = 'deals-green';
    } else {
      data[i - 1].color = 'deals-red';
    }
  }
  return data;
}

export function getDeals(product, callback) {
  return (dispatch) => {
    ont
      .get(URL.GET_LATEST_MATCHES, {
        params: { product, page: 1, per_page: 60 },
      })
      .then((res) => {
        const data = res.data.data || [];
        data.sort((d1, d2) => d2.timestamp - d1.timestamp);
        const Finalist = data.length > 0 ? addColorToDeals(data) : [];
        dispatch({
          type: SpotTradeActionType.FETCH_SUCCESS_DEALS,
          data: Finalist,
        });
        callback && callback();
      });
  };
}

export function clearDeals() {
  return (dispatch) => {
    dispatch({
      type: SpotTradeActionType.CLEAR_DEALS,
      data: [],
    });
  };
}

export function wsUpdateDeals(data = []) {
  return (dispatch, getState) => {
    const state = getState().SpotTrade;
    const { product } = state;
    if (product === '') {
      return false;
    }
    const dataFilted = data.filter((item) => {
      const itemProduct = item.product;
      if (itemProduct) {
        return itemProduct.toLowerCase() === product;
      }
      return false;
    });
    if (dataFilted.length > 0) {
      let deals = [...state.deals];
      deals = dataFilted.concat(deals);
      let newArr = [];
      const newObj = {};
      for (let i = 0, len = deals.length; i < len; i++) {
        deals[i].id =
          deals[i].product +
          deals[i].timestamp +
          deals[i].block_height +
          deals[i].price +
          deals[i].volume;
        if (deals[i].id && !newObj[deals[i].id]) {
          newObj[deals[i].id] = true;
          newArr.push(deals[i]);
        }
      }
      if (newArr.length > 60) {
        newArr = newArr.slice(0, 60);
      }
      newArr.sort((d1, d2) => d2.timestamp - d1.timestamp);
      const Finalist = data.length > 0 ? addColorToDeals(newArr) : [];
      dispatch({
        type: SpotTradeActionType.WS_UPDATE_DEALS,
        data: Finalist,
      });
    }
    return true;
  };
}
