import { getCurrentApiUrl } from './getApiUrl';
import okexznLogo from '../assets/images/okexzh.png';
import okexenLogo from '../assets/images/okexen.png';
import Cookies from 'js-cookie';
import env from './env';
const okbExplorePrefix = env.envConfig.oklinkPagePath;
const exploreUrl = 'https://www.oklink.com';
const lang = Cookies.get('locale') || '';
const receiveCoinUrl =
  lang === 'en_US' ? 'https://www.okex.com' : window.okGlobal.innerDomain;
const okexLogo = lang === 'zh_CN' ? okexznLogo : okexenLogo;
const Config = {
  okexchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`,
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`,
    detailUrl: `${exploreUrl}/${okbExplorePrefix}/token`,
    clientUrl: getCurrentApiUrl(),
    homeUrl: receiveCoinUrl,
    receiveCoinUrl: `${receiveCoinUrl}/activities/pro/drawdex`,
    docUrl: `https://okexchain-docs.readthedocs.io/en/latest/`,
    get receiveSwapUrl() {
      if (lang === 'zh_CN') return 'https://sourl.cn/VfNTkc';
      return 'https://www.okex.com/academy/en/how-to-use-okex-swap-farm-pools-okexchain';
    },
    get receiveFarmUrl() {
      if (lang === 'zh_CN') return 'https://sourl.cn/SQbtvR';
      return 'https://www.okex.com/academy/en/how-to-use-okex-swap-farm-pools-okexchain';
    },
    get liquidity() {
      if (lang === 'zh_CN') return `${window.okGlobal.innerDomain}/academy/zh/what-is-impermanent-loss`;
      return '';
    },
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
  okexLogo,
};
export default Config;
