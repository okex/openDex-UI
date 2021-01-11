import { getPathAndHash } from '../utils/pathUtil';

const testnet = {
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
  pushLogin: '',
};

const mainnet = {
  token: {
    base: 'okt',
    quote: 'usdk',
    quoteName: 'USDK',
    defaultProduct: 'btc_usdk',
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
  pushLogin: '',
};

function envConfig() {
  let { pathname, hash } = getPathAndHash();
  if (/^\/dex\-test/.test(pathname) || /^\/dex\-test/.test(hash))
    return testnet;
  return mainnet;
}

const env = {
  envConfig: envConfig(),
};

export default env;
