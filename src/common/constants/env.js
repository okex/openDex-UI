import { getPathAndHash } from '../utils/pathUtil';

const testnet = {
  token: {
    base: 'tokt',
    quote: 'tusdk',
    quoteName: 'TUSDK',
    defaultProduct: 'tbtc_tusdk',
    productKey: 'product_test',
    activeMarketKey: 'activeMarket_test',
    favoritesKey: 'favorites_test',
    favorites: ['tbtc_tusdk', 'tokb_tusdk', 'tokt_tusdk'],
    valuationUnitKey: 'valuationUnit_test',
    spot_spotOrMarginKey: 'spot_spotOrMargin_test',
  },
  apiPath: 'okexchaintestnet',
  pagePath: 'dex-test',
  chainId: 'okexchaintestnet-1',
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
  apiPath: 'okexchain',
  pagePath: 'dex',
  chainId: 'okexchain-1',
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
