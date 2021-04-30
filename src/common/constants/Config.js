import Cookies from 'js-cookie';
import { getCurrentApiUrl } from './getApiUrl';
import okexznLogo from '../assets/images/okexzh.png';
import okexenLogo from '../assets/images/okexen.png';
import env from './env';

const okbExplorePrefix = env.envConfig.oklinkPagePath;
const exploreUrl = 'https://www.oklink.com';
const lang = Cookies.get('locale') || '';
const receiveCoinUrl = window.okGlobal.mainDomain || 'https://www.okex.com';
const okexLogo = lang === 'zh_CN' ? okexznLogo : okexenLogo;
const Config = {
  okexchain: {
    browserUrl: `${exploreUrl}/${okbExplorePrefix}`,
    browserAddressUrl: `${exploreUrl}/${okbExplorePrefix}/address`,
    detailUrl: `${exploreUrl}/${okbExplorePrefix}/token`,
    clientUrl: getCurrentApiUrl(),
    homeUrl: receiveCoinUrl,
    receiveCoinUrl: `${receiveCoinUrl}/activities/pro/drawdex`,
    docUrl: 'https://okexchain-docs.readthedocs.io/en/latest/',
    get receiveSwapUrl() {
      if (lang === 'zh_CN') return 'https://sourl.cn/VfNTkc';
      return `${receiveCoinUrl}/academy/en/how-to-use-okex-swap-farm-pools-okexchain`;
    },
    get receiveFarmUrl() {
      if (lang === 'zh_CN') return 'https://sourl.cn/SQbtvR';
      return `${receiveCoinUrl}/academy/en/how-to-use-okex-swap-farm-pools-okexchain`;
    },
    get liquidity() {
      if (lang === 'zh_CN')
        return `${window.okGlobal.innerDomain}/academy/zh/what-is-impermanent-loss`;
      return '';
    },
    get migration() {
      if (lang === 'zh_CN')
        return '/support/hc/zh-cn/articles/360060355371-关于OKExChain主网升级暂停OKT和K资产充提的公告';
      return '/support/hc/en-us/articles/360060355371-OKT-and-k-tokens-deposits-and-withdrawals-to-be-suspended-during-OKExChain-mainnet-upgrade';
    },
    get doubleAddress() {
      if (lang === 'zh_CN') return '/support/hc/zh-cn/articles/360060384071';
      return '/support/hc/en-us/articles/360060384071';
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
