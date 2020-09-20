import OKExChainClient, { crypto } from '@okexchain/javascript-sdk';
import { toLocale } from '_src/locale/react-locale';
import CommonActionType from '../actionTypes/CommonActionType';
import Config from '../../constants/Config';
import FormActionType from '../actionTypes/FormActionType';

export function initOKExChainClient() {
  return (dispatch) => {
    const client = new OKExChainClient(Config.okexchain.clientUrl);
    dispatch({
      type: CommonActionType.SET_OKEXCHAIN_CLIENT,
      data: client,
    });
  };
}

export function validatePassword(pwd, successCallback, errorCallback) {
  return (dispatch) => {
    try {
      const user = JSON.parse(window.localStorage.getItem('dex_user') || '{}');
      const pk = crypto.getPrivateKeyFromKeyStore(user.info, pwd);
      this.setPrivateKey(pk);
      successCallback && successCallback(pk);
      dispatch({
        type: FormActionType.UPDATE_WARNING,
        data: '',
      });
    } catch (e) {
      dispatch({
        type: FormActionType.UPDATE_WARNING,
        data: toLocale('pwd_error'),
      });
      errorCallback && errorCallback();
      return false;
    }
    return true;
  };
}

export function setPrivateKey(pk) {
  return (dispatch) => {
    window.localStorage.setItem(
      'pExpiredTime',
      new Date().getTime() + Config.timeoutMinute
    );
    dispatch({
      type: CommonActionType.SET_PRIVATE_KEY,
      data: pk,
    });
  };
}

export function hidePwdDialog() {
  return (dispatch) => {
    dispatch({
      type: CommonActionType.IS_SHOW_PWD_DIALOG,
      data: false,
    });
  };
}

export function updateLatestHeight(height) {
  return (dispatch) => {
    dispatch({
      type: CommonActionType.UPDATE_LATEST_HEIGHT,
      data: height,
    });
  };
}
