import CommonActionType from '../actionTypes/CommonActionType';

const initialState = {
  okchainClient: {}, // OKChain客户端对象
  privateKey: '', // 私钥
  legalList: [], // 法币货币列表
  legalId: -1, // 法币货币当前id
  legalObj: {}, // 法币货币当前obj
  latestHeight: 0, // OKChain区块最新高度
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case CommonActionType.SET_OKCHAIN_CLIENT:
      return {
        ...state,
        okchainClient: action.data
      };
    case CommonActionType.UPDATE_CURRENCY_LIST:
      return {
        ...state,
        legalList: action.data
      };
    case CommonActionType.UPDATE_CURRENCY_ID:
      return {
        ...state,
        legalId: action.data
      };
    case CommonActionType.UPDATE_CURRENCY_OBJ:
      return {
        ...state,
        legalObj: action.data
      };
    case CommonActionType.SET_PRIVATE_KEY:
      return {
        ...state,
        privateKey: action.data
      };
    case CommonActionType.UPDATE_LATEST_HEIGHT:
      return {
        ...state,
        latestHeight: action.data
      };
    default:
      return state;
  }
}
