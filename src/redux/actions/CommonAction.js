import OKChainClient, { crypto } from '@okchain/javascript-sdk';
import { toLocale } from '_src/locale/react-locale';
import CommonActionType from '../actionTypes/CommonActionType';
import Config from '../../constants/Config';
import FormActionType from '../actionTypes/FormActionType';

/*
 * 初始化okchain客户端
 * */
export function initOKChainClient() {
  return (dispatch) => {
    const client = new OKChainClient(Config.okchain.clientUrl);
    // client.initChain();
    dispatch({
      type: CommonActionType.SET_OKCHAIN_CLIENT,
      data: client
    });
  };
}

/*
 * 验证密码
 * */
export function validatePassword(pwd, successCallback, errorCallback) {
  return (dispatch) => {
    // 校验密码
    try {
      const user = JSON.parse(window.localStorage.getItem('dex_user') || '{}');
      const pk = crypto.getPrivateKeyFromKeyStore(user.info, pwd);
      this.setPrivateKey(pk); // 重置私钥，30分钟后过期
      successCallback && successCallback(pk);
      dispatch({
        type: FormActionType.UPDATE_WARNING,
        data: '' // e.message
      });
    } catch (e) {
      dispatch({
        type: FormActionType.UPDATE_WARNING,
        data: toLocale('pwd_error') // e.message
      });
      errorCallback && errorCallback();
      return false;
    }
    return true;
  };
}

/*
 * 设置密钥 & 更新过期时间
 * */
export function setPrivateKey(pk) {
  return (dispatch) => {
    window.localStorage.setItem('pExpiredTime', new Date().getTime() + Config.timeoutMinute);
    // 隐去弹窗
    dispatch({
      type: CommonActionType.SET_PRIVATE_KEY,
      data: pk
    });
  };
}

/*
 * 隐藏密码弹窗
 * */
export function hidePwdDialog() {
  return (dispatch) => {
    // 隐去弹窗
    dispatch({
      type: CommonActionType.IS_SHOW_PWD_DIALOG,
      data: false
    });
  };
}

// 更新OKChain区块最新高度
export function updateLatestHeight(height) {
  return (dispatch) => {
    dispatch({
      type: CommonActionType.UPDATE_LATEST_HEIGHT,
      data: height
    });
  };
}
