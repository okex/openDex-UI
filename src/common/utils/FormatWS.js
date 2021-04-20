import { calc } from '_component/okit';
import util from './util';

const formatDepthArr = (arr) => ({
  price: arr[0],
  quantity: arr[1],
});

const formatProduct = (product) => product;

const instrumentId2Product = (instrument_id) =>
  instrument_id.toLowerCase().split('_');

const formatters = {
  account: (data) => data,
  order([resData]) {
    return resData;
  },
  kline: (data) =>
    data.map(
      ({
        instrument_id,
        candle: [timestamp, open, high, low, close, volume],
      }) => ({
        open,
        high,
        low,
        close,
        volume,
        symbol: instrument_id.replace('-', '_').toLowerCase(),
        createdDate: new Date(timestamp).getTime(),
      })
    ),
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
  allTickers: (data) =>
    data.map((resData) => {
      const open = resData.o;
      let changePercent = '0.00';
      if (open && +resData.p !== -1) {
        changePercent = calc.floorDiv(calc.sub(resData.p, open) * 100, open, 2);
      }
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
    }),
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
      },
    };
  },
  matches: (data) => data,
};

export default formatters;
