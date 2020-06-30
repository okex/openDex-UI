/* eslint-disable camelcase */
import { calc } from '_component/okit';
// yao 格式化深度asks/bids数据 两个格式逻辑是一样的因此提取出函数
import util from './util';

const formatDepthArr = (arr) => {
  return {
    price: arr[0],
    quantity: arr[1],
  };
};

const formatProduct = (product) => {
  return product;
  // return symbol.toLowerCase().replace('-', '_');
};

const instrumentId2Product = (instrument_id) => {
  return instrument_id.toLowerCase().split('_');
};

const formatters = {
  account: (data) => { // 币币账户
    return data;
  },
  // 用户交易数据
  order([resData]) {
    return resData;
  },
  kline: (data) => { // k线
    return data.map(({ instrument_id, candle: [timestamp, open, high, low, close, volume] }) => {
      return {
        open,
        high,
        low,
        close,
        volume,
        symbol: instrument_id.replace('-', '_').toLowerCase(),
        createdDate: new Date(timestamp).getTime(),
      };
    });
  },
  ticker([resData]) {
    return {
      high: +resData.high,
      low: +resData.low,
      open: +resData.open,
      volume: +resData.volume,
      price: +resData.price,
      product: formatProduct(resData.product),
      change: resData.price - resData.open,
      changePercentage: util.getChangePercentage(resData),
      last: +resData.price,
    };
  },
  allTickers: (data) => { // 所有币对ticker
    return data.map((resData) => {
      const open = resData.o;
      let changePercent = '0.00';
      if (open && (+resData.p !== -1)) {
        changePercent = calc.floorDiv(calc.sub(resData.p, open) * 100, open, 2);
      }
      // 如果数值是负数 则自带负号
      const changeSignStr = changePercent >= 0 ? '+' : '';
      return {
        high: +resData.h,
        low: +resData.l,
        open: +resData.o,
        volume: +resData.v,
        price: +resData.p,
        product: formatProduct(resData.id),
        change: resData.p - resData.o,
        changePercentage: `${changeSignStr}${changePercent}%`,
        last: +resData.p,
      };
    });
  },
  // 深度
  depth: ({ data, action }) => {
    const [resData] = data;
    const [base, quote] = instrumentId2Product(resData.instrument_id);
    return {
      base,
      quote,
      action,
      data: {
        asks: resData.asks.map(formatDepthArr),
        bids: resData.bids.map(formatDepthArr),
      }
    };
  },
  // 成交的数据
  matches: (data) => {
    return data;
  },
};

export default formatters;
