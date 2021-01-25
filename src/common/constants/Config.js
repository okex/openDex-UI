import { getCurrentApiUrl } from './getApiUrl';
import Cookies from 'js-cookie';
import env from './env';
const okbExplorePrefix = env.envConfig.oklinkPagePath;
const exploreUrl = 'https://www.oklink.com';
const lang = Cookies.get('locale') || '';
const receiveCoinUrl =
  lang === 'en_US' ? 'https://www.okex.com' : 'https://www.okexcn.com';

const Config = {
  okexchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`,
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`,
    clientUrl: getCurrentApiUrl(),
    homeUrl: receiveCoinUrl,
    receiveCoinUrl: `${receiveCoinUrl}/activities/pro/drawdex`,
    docUrl: `https://okexchain-docs.readthedocs.io/en/latest/`,
    get receiveSwapUrl() {
      if(lang === 'zh_CN') return 'https://sourl.cn/VfNTkc';
      return 'https://www.okex.com/academy/en/how-to-use-okex-swap-farm-pools-okexchain';
    },
    get receiveFarmUrl() {
      if(lang === 'zh_CN') return 'https://sourl.cn/SQbtvR';
      return 'https://www.okex.com/academy/en/how-to-use-okex-swap-farm-pools-okexchain';
    },
    liquidity:''
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
