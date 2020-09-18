const okbExplorePrefix = 'okchain-test';
const apiUrl = 'http://www.okex.com';
const exploreUrl = 'https://www.oklink.com';

const Config = {
  okchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`,
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`,
    clientUrl: apiUrl,
  },
  validatePwdDeferSecond: 100,
  operateResultDelaySecond: 500,
  operateResultTipInterval: 2.5 * 1000,
  timeoutMinute: 30 * 60 * 1000,
  intervalSecond: 5 * 1000,
  pwdValidate: {
    lengthReg: /.{10}/,
    chartReg: /(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])/,
  },
  needLegalPrice: false,
};
export default Config;
