const OKDEX_BASE_URL = '{domain}/okchain/v1';
const MASTER_BASE_URL = 'https://www.okex.com/okchain/v1';

const URL = {
  GET_ORDER_OPEN: `${OKDEX_BASE_URL}/order/list/open`,
  GET_ORDER_CLOSED: `${OKDEX_BASE_URL}/order/list/closed`,
  GET_PRODUCT_DEALS: `${OKDEX_BASE_URL}/deals`,
  GET_LATEST_MATCHES: `${OKDEX_BASE_URL}/matches`,
  GET_PRODUCT_TICKERS: `${OKDEX_BASE_URL}/tickers`,
  GET_PRODUCTS: `${OKDEX_BASE_URL}/products`,
  GET_TOKENS: `${OKDEX_BASE_URL}/tokens`,
  GET_DEPTH_BOOK: `${OKDEX_BASE_URL}/order/depthbook`,
  GET_CANDLES: `${OKDEX_BASE_URL}/candles`,
  GET_ACCOUNTS: `${OKDEX_BASE_URL}/accounts`,
  GET_TRANSACTIONS: `${OKDEX_BASE_URL}/transactions`,
  GET_LATEST_HEIGHT: `${OKDEX_BASE_URL}/latestheight`,
  GET_ACCOUNT_DEPOSIT: `${OKDEX_BASE_URL}/dex/deposits`,
  GET_FEES: `${OKDEX_BASE_URL}/dex/fees`,
  GET_LATEST_HEIGHT_MASTER: `${MASTER_BASE_URL}/latestheight`,
};
export default URL;
