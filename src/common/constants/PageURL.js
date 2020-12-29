import {getPathAndHash} from '../utils/util';
import {envConfig} from './env';
const contentPath = `/${envConfig.pagePath}`;

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
};

export default {
  ...paths,
  getCurrent() {
    let { pathname, hash } = getPathAndHash();
    for (name in paths) {
      const temp = paths[name];
      if (pathname === temp || hash === temp) return temp;
    }
    return '';
  },
};
