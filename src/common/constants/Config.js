import getApiUrl from './getApiUrl';
import Cookies from 'js-cookie';
const okbExplorePrefix = 'okexchain-test';
const exploreUrl = 'https://www.oklink.com';
const lang = Cookies.get('locale') || '';

const Config = {
  okexchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`,
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`,
    clientUrl: getApiUrl(),
    receiveCoinUrl: '/activities/pro/drawdex',
    docUrl: `https://okchain-docs.readthedocs.io/${lang.indexOf('zh') >= 0 ? 'en' : 'en'}/latest/`
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
