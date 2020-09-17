import { storage } from '_component/okit';
import ActionTypes from '../actionTypes/SpotActionType';

let activeMarket = {};
try {
  activeMarket = JSON.parse(storage.get('activeMarket') || '{}');
  if (!activeMarket.groupId) {
    activeMarket = {
      filterWord: ['tusdk'],
      groupId: 1,
      groupName: 'TUSDK',
    };
  }
} catch (e) {
  console.warn(e); // eslint-disable-line
}

const initialState = {
  wsIsOnlineV3: false, // ws连接状态v3
  wsErrCounterV3: 0, // ws断线重连计数器v3
  wsIsDelayLogin: false, // 获取token时间是否晚于页面执行推送连接
  valuationToken: 'tokt', // OKExChain计价通证 tokt
  activeMarket, // 当前交易区 原来是1
  searchText: '', // 币对搜索input
  billMenuActive: '', // 左侧菜单激活Id
  hasOpenMargin: false, // 币对中是否存在 杠杠
  tickers: {}, // 所有币对行情
  cnyRate: 0, // 人民币对美元汇率
  theme: localStorage.getItem('theme') || 'theme-1', // 白天 or 夜间模式
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_HAS_OPEN_MARGIN:
      return {
        ...state,
        hasOpenMargin: action.data
      };
    case ActionTypes.UPDATE_WS_STATUS_V3:
      return {
        ...state,
        wsIsOnlineV3: action.data
      };
    case ActionTypes.UPDATE_WS_ERR_COUNTER_V3:
      return {
        ...state,
        wsErrCounterV3: action.data
      };
    case ActionTypes.UPDATE_WS_IS_DELAY:
      return {
        ...state,
        wsIsDelayLogin: action.data
      };
    // 更新tickers，通过api
    case ActionTypes.FETCH_SUCCESS_TICKERS:
      return {
        ...state,
        tickers: action.data
      };
    // 更新tickers，通过推送
    case ActionTypes.UPDATE_TICKERS:
      return {
        ...state,
        tickers: action.data
      };
    case ActionTypes.UPDATE_ACTIVE_MARKET:
      return {
        ...state,
        activeMarket: action.data
      };
    case ActionTypes.UPDATE_SEARCH:
      return {
        ...state,
        searchText: action.data
      };
    case ActionTypes.UPDATE_BILL_MENU:
      return {
        ...state,
        billMenuActive: action.data
      };
    case ActionTypes.UPDATE_THEME:
      return {
        ...state,
        theme: action.data
      };
    case ActionTypes.UPDATE_CNY_RATE:
      return {
        ...state,
        cnyRate: action.data
      };
    default:
      return state;
  }
}
