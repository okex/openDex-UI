import OKExChainClient, { crypto } from '@okexchain/javascript-sdk';
import { toLocale } from '_src/locale/react-locale';
import CommonActionType from '../actionTypes/CommonActionType';
import Config from '../../constants/Config';
import FormActionType from '../actionTypes/FormActionType';
import ont from '../../utils/dataProxy';
import URL from '../../constants/URL';
import env from '../../constants/env';

const legalCurrencyId = 'dex_legalCurrencyId';

export function initOKExChainClient() {
  return (dispatch) => {
    console.log({
      chainId: env.envConfig.chainId,
      relativePath: `/${env.envConfig.apiPath}`,
      isMainnet: env.envConfig.isMainnet,
    });
    const client = new OKExChainClient(Config.okexchain.clientUrl, {
      chainId: env.envConfig.chainId,
      relativePath: `/${env.envConfig.apiPath}`,
      isMainnet: env.envConfig.isMainnet,
    });
    dispatch({
      type: CommonActionType.SET_OKEXCHAIN_CLIENT,
      data: client,
    });
  };
}

export function validatePassword(pwd, successCallback, errorCallback) {
  return (dispatch) => {
    try {
      const user = JSON.parse(
        window.localStorage.getItem(env.envConfig.dexUser) || '{}'
      );
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

export function fetchChargeUnit() {
  return (dispatch, getState) => {
    let id = 0;
    const legalId = window.localStorage.getItem(legalCurrencyId);
    if (legalId) {
      id = Number(legalId);
    }
    setChargeUnit(id)(dispatch, getState);
  };
}

export function setChargeUnit(legalId) {
  return (dispatch, getState) => {
    const { legalId: oldCurrencyId } = getState().Common; // getState().Spot
    const setCId = (cId) => {
      window.localStorage.setItem(legalCurrencyId, String(cId));
      dispatch({
        type: CommonActionType.UPDATE_CURRENCY_ID,
        data: cId,
      });
    };
    if (oldCurrencyId !== legalId) {
      setCId(legalId);
    }
  };
}

export function setChargeUnitObj(legalObj) {
  return (dispatch, getState) => {
    dispatch({
      type: CommonActionType.UPDATE_CURRENCY_OBJ,
      data: legalObj,
    });
    fetchCurrency2LegalRate(legalObj)(dispatch, getState);
  };
}

export function fetchCurrency2LegalRate(legalObj) {
  return (dispatch, getState) => {
    const { activeMarket } = getState().Spot;
    const quote =
      (activeMarket.groupName && activeMarket.groupName.toLowerCase()) ||
      env.envConfig.token.quote;
    ont
      .get(
        URL.GET_LEGAL_RATE.replace('{quote}', quote).replace(
          '{base}',
          legalObj.isoCode
        )
      )
      .then((res) => {
        dispatch({
          type: CommonActionType.UPDATE_CURRENCY_OBJ,
          data: { ...legalObj, rate: res.data.index },
        });
      })
      .catch(() => {});
  };
}

export function setActivedMenu(activedMenu) {
  return (dispatch) => {
    dispatch({
      type: CommonActionType.ACTIVEDMENU,
      data: activedMenu,
    });
  };
}
