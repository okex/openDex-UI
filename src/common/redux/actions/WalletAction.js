import WalletActionType from '../actionTypes/WalletActionType';

export function updateCreateStep(step) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_CREATE_STEP,
      data: step,
    });
  };
}

export function updateIsShowSafeTip(isShow) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_IS_SHOW_SAFE_TIP,
      data: isShow,
    });
  };
}

export function updateIsPass(isPass) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_IS_PASS,
      data: isPass,
    });
  };
}

export function updateMnemonic(mnemonic) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_MNEMONIC,
      data: mnemonic,
    });
  };
}

export function updateKeyStore(keyStore) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_KEYSTORE,
      data: keyStore,
    });
  };
}

export function updatePrivate(privateKey) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_PRIVATE,
      data: privateKey,
    });
  };
}
