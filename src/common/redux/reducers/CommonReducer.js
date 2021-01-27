import CommonActionType from '../actionTypes/CommonActionType';

const initialState = {
  okexchainClient: {},
  privateKey: '',
  legalList: [],
  legalId: -1,
  legalObj: {},
  latestHeight: 0,
  qrcodeUri: '',
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CommonActionType.SET_OKEXCHAIN_CLIENT:
      return {
        ...state,
        okexchainClient: action.data,
      };
    case CommonActionType.UPDATE_CURRENCY_LIST:
      return {
        ...state,
        legalList: action.data,
      };
    case CommonActionType.UPDATE_CURRENCY_ID:
      return {
        ...state,
        legalId: action.data,
      };
    case CommonActionType.UPDATE_CURRENCY_OBJ:
      return {
        ...state,
        legalObj: action.data,
      };
    case CommonActionType.SET_PRIVATE_KEY:
      return {
        ...state,
        privateKey: action.data,
      };
    case CommonActionType.UPDATE_LATEST_HEIGHT:
      return {
        ...state,
        latestHeight: action.data,
      };
    case CommonActionType.WALLET_CONNECT_QRCODE:
      return {
        ...state,
        qrcodeUri: action.data,
      };
    default:
      return state;
  }
}
