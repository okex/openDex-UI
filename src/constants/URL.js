const OKDEX_BASE_URL = '{domain}/okchain/v1';
const MASTER_BASE_URL = 'https://www.okex.com/okchain/v1';

/*
 * URL统一管理
 */
const URL = {
  GET_ORDER_OPEN: `${OKDEX_BASE_URL}/order/list/open`,
  GET_ORDER_CLOSED: `${OKDEX_BASE_URL}/order/list/closed`,
  GET_PRODUCT_DEALS: `${OKDEX_BASE_URL}/deals`,
  GET_LATEST_MATCHES: `${OKDEX_BASE_URL}/matches`,
  GET_PRODUCT_TICKERS: `${OKDEX_BASE_URL}/tickers`,
  GET_PRODUCTS: `${OKDEX_BASE_URL}/products`, // `${OKDEX_BASE_URL}/products` 原:`${OKDEX_SUPPORT_ROOT}/okchain/product/list`
  GET_TOKENS: `${OKDEX_BASE_URL}/tokens`,
  GET_DEPTH_BOOK: `${OKDEX_BASE_URL}/order/depthbook`,
  GET_CANDLES: `${OKDEX_BASE_URL}/candles`,
  GET_ACCOUNTS: `${OKDEX_BASE_URL}/accounts`, // 所有账户
  GET_TRANSACTIONS: `${OKDEX_BASE_URL}/transactions`, // 交易记录
  GET_LATEST_HEIGHT: `${OKDEX_BASE_URL}/latestheight`, // 查询最新高度
  GET_ACCOUNT_DEPOSIT: `${OKDEX_BASE_URL}/dex/deposits`, // 查询对应地址的币对
  GET_FEES: `${OKDEX_BASE_URL}/dex/fees`, // 查询运营方币对手续费
  GET_LATEST_HEIGHT_MASTER: `${MASTER_BASE_URL}/latestheight`,
};
export default URL;
