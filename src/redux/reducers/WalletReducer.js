import WalletActionType from '../actionTypes/WalletActionType';

const initialState = {
  isShowSafeTip: true,
  isPass: true,
  step: 1,
  mnemonic: '',
  privateKey: '',
  keyStore: '',
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case WalletActionType.UPDATE_CREATE_STEP:
      return {
        ...state,
        step: action.data,
      };
    case WalletActionType.UPDATE_IS_PASS:
      return {
        ...state,
        isPass: action.data,
      };
    case WalletActionType.UPDATE_IS_SHOW_SAFE_TIP:
      return {
        ...state,
        isShowSafeTip: action.data,
      };
    case WalletActionType.UPDATE_MNEMONIC:
      return {
        ...state,
        mnemonic: action.data,
      };
    case WalletActionType.UPDATE_PRIVATE:
      return {
        ...state,
        privateKey: action.data,
      };
    case WalletActionType.UPDATE_KEYSTORE:
      return {
        ...state,
        keyStore: action.data,
      };
    default:
      return state;
  }
}
