import { crypto } from '@okexchain/javascript-sdk';
import env from '../../constants/env';

const walletUtil = {
  setUserInSessionStroageByWalletConnect(addr) {
    const user = {
      addr,
    };
    window.localStorage.setItem(env.envConfig.dexUser, JSON.stringify(user));
    window.OK_GLOBAL.senderAddr = addr;
    window.OK_GLOBAL.isLogin = true;
  },
  setUserInSessionStroage(privateKey, keyStore) {
    const addr = crypto.getAddressFromPrivateKey(
      privateKey,
      env.envConfig.addressPrefix
    );
    const user = {
      addr,
      info: keyStore,
    };
    window.localStorage.setItem(env.envConfig.dexUser, JSON.stringify(user));
    window.OK_GLOBAL.senderAddr = addr;
    window.OK_GLOBAL.isLogin = true;
  },
  getPasswordInputType() {
    return window.navigator.userAgent.match(/webkit/i) ? 'text' : 'password';
  },
};
export default walletUtil;
