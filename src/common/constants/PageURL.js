import env from './env';
import { getPathAndHash } from '../utils/pathUtil';
const contentPath = `/${env.envConfig.pagePath}`;

const paths = {
  homePage: `${contentPath}`,
  indexPage: `${contentPath}/index`,
  spotDefaultPage: `${contentPath}/spot`,
  spotFullPage: `${contentPath}/spot/trade`,
  spotOpenPage: `${contentPath}/spot/open`,
  spotHistoryPage: `${contentPath}/spot/history`,
  spotDealsPage: `${contentPath}/spot/deals`,
  spotOrdersPage: `${contentPath}/spot/orders?isMargin={0}`,
  loginPage: `${contentPath}/wallet/import?forward={0}&logout=true`,
  wallet: `${contentPath}/wallet`,
  walletAssets: `${contentPath}/wallet/assets`,
  walletTransactions: `${contentPath}/wallet/transactions`,
  walletCreate: `${contentPath}/wallet/create`,
  walletImport: `${contentPath}/wallet/import`,
  nodeSettingPage: `${contentPath}/node`,
  registerPage: `${contentPath}/register`,
  issueTokenPage: `${contentPath}/issue-token`,
  listTokenpairPage: `${contentPath}/list-tokenpair`,
  dashboardPage: `${contentPath}/dashboard`,
  issueDetailPage: `${contentPath}/issue`,
  tokenpairDetailPage: `${contentPath}/tokenpair`,
  feesPage: `${contentPath}/fees`,
  swapPage: `${contentPath}/swap`,
  liquidityPage: `${contentPath}/swap/liquidity`,
  reduceLiquidityPage: `${contentPath}/swap/liquidity/reduce`,
  createLiquidityPage: `${contentPath}/swap/liquidity/create`,
  addLiquidityPage: `${contentPath}/swap/liquidity/add`,
  watchlistPage: `${contentPath}/swap/watchlist`,
  farmPage: `${contentPath}/farm`,
  myfarmingsPage: `${contentPath}/farm/myfarmings`,
};

export default {
  ...paths,
  getCurrent() {
    let { pathname, hash } = getPathAndHash();
    let result = '';
    for (name in paths) {
      const temp = paths[name];
      if (pathname.startsWith(temp) || hash.startsWith(temp)) {
        if(temp.length > result.length) result = temp;
      };
    }
    return result;
  },
};
