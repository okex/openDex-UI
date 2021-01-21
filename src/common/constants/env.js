import { getPathAndHash } from '../utils/pathUtil';

const testnet = {
  isTest: true,
  dexUser: 'dex_user_test',
  dexToken: 'dex_token_test',
  token: {
    base: 'okt',
    quote: 'usdk',
    quoteName: 'USDK',
    defaultProduct: 'btc_usdk',
    productKey: 'product_test',
    activeMarketKey: 'activeMarket_test',
    favoritesKey: 'favorites_test',
    favorites: ['btc_usdk', 'okb_usdk', 'okt_usdk'],
    valuationUnitKey: 'valuationUnit_test',
    spot_spotOrMarginKey: 'spot_spotOrMargin_test',
  },
  apiPath: 'okexchain-test/v1',
  pagePath: 'dex-test',
  chainId: 'okexchain-65',
  kId: 'okex-dex-test',
  swapSetting: 'swap_setting_config_test',
  oklinkPagePath: 'okexchain-test',
  isMainnet: false,
  firstPoolConf: {
    pool_name: '1st_pool_okt_usdt',
    lock_symbol: 'ammswap_okt_usdk',
    stake_at: 1611150900,
    claim_height: 1003128,
    claim_height_extra: 24 * 60 * 60,
    claim_height_extra1: 3 * 24 * 60 * 60,
    claim_at: 1611219000,
  },
};

const mainnet = {
  isTest: false,
  dexUser: 'dex_user',
  dexToken: 'dex_token',
  token: {
    base: 'okt',
    quote: 'usdt-a2b',
    quoteName: 'USDT-A2B',
    defaultProduct: 'okt_usdt-a2b',
    productKey: 'product',
    activeMarketKey: 'activeMarket',
    favoritesKey: 'favorites',
    favorites: ['btc_usdk', 'okb_usdk', 'okt_usdk'],
    valuationUnitKey: 'valuationUnit',
    spot_spotOrMarginKey: 'spot_spotOrMargin',
  },
  apiPath: 'okexchain/v1',
  pagePath: 'dex',
  chainId: 'okexchain-66',
  kId: 'okex-dex',
  swapSetting: 'swap_setting_config',
  oklinkPagePath: 'okexchain',
  isMainnet: true,
  firstPoolConf: {
    pool_name: '1st_pool_okt_usdt',
    lock_symbol: 'ammswap_okt_usdk',
    stake_at: 1611150900,
    claim_height: 1003128,
    claim_height_extra: 24 * 60 * 60,
    claim_height_extra1: 3 * 24 * 60 * 60,
    claim_at: 1611219000,
  },
};

function envConfig() {
  let { pathname, hash } = getPathAndHash();
  if (/^\/dex\-test/.test(pathname) || /^\/dex\-test/.test(hash))
    return testnet;
  return mainnet;
}

const env = {
  envConfig: envConfig(),
  testnet,
  mainnet,
};

export default env;
