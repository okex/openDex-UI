import WalletActionType from '../actionTypes/WalletActionType';

const initialState = {
  isShowSafeTip: true, // 在Step2加载时，是否自动出现下载Keystore的安全提示
  isPass: true, // 助记词校验状态
  step: 1, // 创建钱包-当前步骤
  mnemonic: '', // 助记词
  privateKey: '', // 私钥
  keyStore: '', // keyStore
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    // 更新创建钱包-当前步骤
    case WalletActionType.UPDATE_CREATE_STEP:
      return {
        ...state,
        step: action.data
      };
      // 更新助记词校验状态
    case WalletActionType.UPDATE_IS_PASS:
      return {
        ...state,
        isPass: action.data
      };
    // 更新是否显示安全提示
    case WalletActionType.UPDATE_IS_SHOW_SAFE_TIP:
      return {
        ...state,
        isShowSafeTip: action.data
      };
    // 更新助记词
    case WalletActionType.UPDATE_MNEMONIC:
      return {
        ...state,
        mnemonic: action.data
      };
    // 更新私钥
    case WalletActionType.UPDATE_PRIVATE:
      return {
        ...state,
        privateKey: action.data
      };
    // 更新keystore
    case WalletActionType.UPDATE_KEYSTORE:
      return {
        ...state,
        keyStore: action.data
      };
    default:
      return state;
  }
}
