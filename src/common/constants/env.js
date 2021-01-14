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
};

const mainnet = {
  isTest: false,
  dexUser: 'dex_user',
  dexToken: 'dex_token',
  token: {
    base: 'okt',
    quote: 'usdk',
    quoteName: 'USDK',
    defaultProduct: 'okt_usdk',
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
  mainnet
};

export default env;
