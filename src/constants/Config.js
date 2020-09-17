/*
 * 统一配置管理
 */
const okbExplorePrefix = 'okchain-test';
const apiUrl = 'http://www.okex.com';
const exploreUrl = 'https://www.oklink.com'; // OKChain区块链浏览器基础URL - 域名

// 浏览器URL修改 /explorer
const Config = {
  okchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`, // 浏览器地址
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`, // 我的地址
    clientUrl: apiUrl,
  },
  validatePwdDeferSecond: 100, // 100ms
  operateResultDelaySecond: 500, // 500ms
  operateResultTipInterval: 2.5 * 1000, // 2.5秒
  timeoutMinute: 30 * 60 * 1000, // 30分钟，过期时间
  intervalSecond: 5 * 1000, // 仅api的时候，轮询时间间隔
  pwdValidate: {
    lengthReg: /.{10}/, // 至少10位字符
    chartReg: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/ // 必须包含数字、大小写字母
  },
  needLegalPrice: false, // 是否需要法币计价
};
export default Config;
