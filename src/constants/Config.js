/*
 * 统一配置管理
 */
const BASE_HOST = `${window.location.protocol}//${window.location.host}`;
const okbExplorePrefix = 'okexchain-test';
const host = window.location.hostname;

// online
let apiUrl = BASE_HOST;
const exploreUrl = 'https://www.oklink.com'; // OKExChain区块链浏览器基础URL - 域名

// test
if (host.includes('192.168.') || host.includes('localhost') || host.includes('127.0.0.1')) { // 本地调试
  apiUrl = 'http://127.0.0.1:7777';
}

if (navigator.userAgent.includes('Electron') && window.location.protocol.includes('file')) {
  apiUrl = 'http://www.okex.com';
}

// 浏览器URL修改 /explorer
const Config = {
  okexchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`, // 浏览器地址
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`, // 我的地址
    clientUrl: apiUrl,
  },
  jwtTokenExpiredTime: 30 * 24 * 60 * 60 * 1000, // 30天 60 * 1000, //
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
