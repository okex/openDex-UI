const contentPath = '/dex-test';

export const short = {
  billForce: 'LiquidationOrders',
  readyRisk: 'InsuranceFunds',
};

export default {
  homePage: `${contentPath}`,
  indexPage: `${contentPath}/index`,
  spotDefaultPage: `${contentPath}/spot`, // 全屏交易
  spotFullPage: `${contentPath}/spot/trade`, // 全屏交易
  spotOpenPage: `${contentPath}/spot/open`, // 当前委托
  spotHistoryPage: `${contentPath}/spot/history`, // 历史委托
  spotDealsPage: `${contentPath}/spot/deals`, // 成交明细
  spotOrdersPage: `${contentPath}/spot/orders?isMargin={0}`, // 币币委托
  // loginPage: `${contentPath}account/login?forward={0}&logout=true`, // 登录
  loginPage: `${contentPath}/wallet/import?forward={0}&logout=true`, // 登录
  wallet: `${contentPath}/wallet`, // 钱包
  walletAssets: `${contentPath}/wallet/assets`, // 钱包资产
  walletTransactions: `${contentPath}/wallet/transactions`, // 钱包交易记录
  walletCreate: `${contentPath}/wallet/create`, // 创建钱包
  walletImport: `${contentPath}/wallet/import`, // 导入钱包
  nodeSettingPage: `${contentPath}/node`, // 节点设置
  registerPage: `${contentPath}/register`, // 注册运营商
  issueTokenPage: `${contentPath}/issue-token`, // 发行币种
  listTokenpairPage: `${contentPath}/list-tokenpair`, // 发行币对
  dashboardPage: `${contentPath}/dashboard`, // 总览
};
