import { getCurrentApiUrl } from './getApiUrl';

const BASEURL = {
  get BASE_URL() {
    return getCurrentApiUrl();
  },
  get OKDEX_BASE_URL() {
    return `${this.BASE_URL}/okexchain/v1`;
  },
  get OKDEX_SUPPORT_ROOT() {
    return `${this.BASE_URL}/okdex/v1`;
  },
  get SWAP() {
    return `${this.OKDEX_BASE_URL}/swap`;
  },
};

const URL = {
  get GET_ORDER_OPEN() {
    return `${BASEURL.OKDEX_BASE_URL}/order/list/open`;
  },
  get GET_ORDER_CLOSED() {
    return `${BASEURL.OKDEX_BASE_URL}/order/list/closed`;
  },
  get GET_PRODUCT_DEALS() {
    return `${BASEURL.OKDEX_BASE_URL}/deals`;
  },
  get GET_LATEST_MATCHES() {
    return `${BASEURL.OKDEX_BASE_URL}/matches`;
  },
  get GET_PRODUCT_TICKERS() {
    return `${BASEURL.OKDEX_BASE_URL}/tickers`;
  },
  get GET_PRODUCTS() {
    return `${BASEURL.OKDEX_BASE_URL}/products`;
  },
  get GET_TOKENS() {
    return `${BASEURL.OKDEX_BASE_URL}/tokens`;
  },
  get GET_DEPTH_BOOK() {
    return `${BASEURL.OKDEX_BASE_URL}/order/depthbook`;
  },
  get GET_CANDLES() {
    return `${BASEURL.OKDEX_BASE_URL}/candles`;
  },
  get GET_ACCOUNTS() {
    return `${BASEURL.OKDEX_BASE_URL}/accounts`;
  },
  get GET_TRANSACTIONS() {
    return `${BASEURL.OKDEX_BASE_URL}/transactions`;
  },
  get GET_LATEST_HEIGHT() {
    return `${BASEURL.OKDEX_BASE_URL}/latestheight`;
  },
  get GET_ACCOUNT_DEPOSIT() {
    return `${BASEURL.OKDEX_BASE_URL}/dex/deposits`;
  },
  get GET_FEES() {
    return `${BASEURL.OKDEX_BASE_URL}/dex/fees`;
  },
  get GET_LATEST_HEIGHT_MASTER() {
    return `${BASEURL.OKDEX_BASE_URL}/latestheight`;
  },
  get GET_LEGAL_LIST() {
    return `${BASEURL.OKDEX_SUPPORT_ROOT}/index/legalList`;
  },
  get GET_LEGAL_RATE() {
    return `${BASEURL.OKDEX_SUPPORT_ROOT}/index/currency2LegalRate?quoteCurrency={quote}&legalTender={base}`;
  },
  get GET_SWAP_TOKENS() {
    return `${BASEURL.SWAP}/tokens`;
  },
  get GET_SWAP_BUY_INFO() {
    return `${BASEURL.SWAP}/quote`;
  },
  get GET_SWAP_LIQUIDITY_INFO() {
    return `${BASEURL.SWAP}/liquidity/histories`;
  },
  get GET_SWAP_ADD_INFO() {
    return `${BASEURL.SWAP}/liquidity/add_quote`;
  },
  get GET_SWAP_REDEEMABLE_ASSETS() {
    return `${BASEURL.SWAP}/liquidity/remove_quote`;
  },
  get GET_SWAP_TOKEN_PAIR() {
    return `${BASEURL.SWAP}/token_pair`;
  },
  get GET_SWAP_WATCHLIST() {
    retrun`${BASEURL.SWAP}/watchlist`;
  },
};
export default URL;
