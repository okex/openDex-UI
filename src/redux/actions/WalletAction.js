import WalletActionType from '../actionTypes/WalletActionType';

/**
 * 更新创建钱包-当前步骤
 */
export function updateCreateStep(step) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_CREATE_STEP,
      data: step
    });
  };
}
/**
 * 更新是否出现安全提示
 */
export function updateIsShowSafeTip(isShow) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_IS_SHOW_SAFE_TIP,
      data: isShow
    });
  };
}
/**
 * 更新助记词校验状态
 */
export function updateIsPass(isPass) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_IS_PASS,
      data: isPass
    });
  };
}
/**
 * 更新助记词
 */
export function updateMnemonic(mnemonic) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_MNEMONIC,
      data: mnemonic
    });
  };
}
/**
 * 更新keyStore
 */
export function updateKeyStore(keyStore) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_KEYSTORE,
      data: keyStore
    });
  };
}
/**
 * 更新私钥
 */
export function updatePrivate(privateKey) {
  return (dispatch) => {
    dispatch({
      type: WalletActionType.UPDATE_PRIVATE,
      data: privateKey
    });
  };
}
