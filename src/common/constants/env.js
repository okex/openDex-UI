import { getPathAndHash } from '../utils/pathUtil';
const { okGlobal = {} } = window;
const { langPath = '' } = okGlobal;

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
  liquidityCheck: 'liquidity_check_test',
  oklinkPagePath: 'okexchain-test',
  isMainnet: false,
  fee: 0.05,
  firstPoolConf: {
    pool_name: '1st_pool_okt_usdt',
    lock_symbol: 'ammswap_okt_usdt-25a',
    stake_at: 1611309600,
    claim_height: 1003128,
    claim_height_extra: 24 * 60 * 60,
    claim_height_extra1: 3 * 24 * 60 * 60,
    claim_at: 1611655200,
    noticeSetting: 'notice_setting_test',
  },
  contract: 'contract-test',
  web3Provider:'https://exchaintest.okexcn.com'
};

const mainnet = {
  isTest: false,
  dexUser: 'dex_user_main',
  dexToken: 'dex_token_main',
  token: {
    base: 'okt',
    quote: 'usdt-a2b',
    quoteName: 'USDT-A2B',
    defaultProduct: 'btck-ba9_usdt-a2b',
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
  liquidityCheck: 'liquidity_check',
  oklinkPagePath: 'okexchain',
  isMainnet: true,
  fee: 0.0005,
  firstPoolConf: {
    pool_name: '1st_pool_okt_usdt',
    lock_symbol: 'ammswap_okt_usdt-a2b',
    stake_at: 1611309600,
    claim_height: 1003128,
    claim_height_extra: 24 * 60 * 60,
    claim_height_extra1: 3 * 24 * 60 * 60,
    claim_at: 1611655200,
    noticeSetting: 'notice_setting',
  },
  contract: 'contract',
  web3Provider:'https://exchaintest.okexcn.com'
};

function envConfig() {
  let { pathname, hash } = getPathAndHash();
  const regexp = new RegExp(`^${langPath}\/dex\-test`);
  if (regexp.test(pathname) || regexp.test(hash))
    return testnet;
  return mainnet;
}

const env = {
  envConfig: envConfig(),
  testnet,
  mainnet,
};

export default env;
