const contentPath = '/dex-test';

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
}

export default {
  ...paths,
  getCurrent() {
    const {pathname,hash} = window.location;
    const match = hash ? hash.slice(1):pathname;
    for(name in paths) {
      if(match === paths[name]) return match;
    }
    return '';
  }
};
