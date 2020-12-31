import { storage } from '_component/okit';
import ActionTypes from '../actionTypes/SpotActionType';
import env from '../../constants/env';

let activeMarket = {};
try {
  activeMarket = JSON.parse(storage.get('activeMarket') || '{}');
  if (!activeMarket.groupId) {
    activeMarket = {
      filterWord: [env.envConfig.token.quote],
      groupId: 1,
      groupName: env.envConfig.token.quoteName,
    };
  }
} catch (e) {
  console.warn(e);
}

const initialState = {
  wsIsOnlineV3: false,
  wsErrCounterV3: 0,
  wsIsDelayLogin: false,
  valuationToken: env.envConfig.token.base,
  activeMarket,
  searchText: '',
  billMenuActive: '',
  hasOpenMargin: false,
  tickers: {},
  cnyRate: 0,
  theme: localStorage.getItem('theme') || 'theme-1',
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_HAS_OPEN_MARGIN:
      return {
        ...state,
        hasOpenMargin: action.data,
      };
    case ActionTypes.UPDATE_WS_STATUS_V3:
      return {
        ...state,
        wsIsOnlineV3: action.data,
      };
    case ActionTypes.UPDATE_WS_ERR_COUNTER_V3:
      return {
        ...state,
        wsErrCounterV3: action.data,
      };
    case ActionTypes.UPDATE_WS_IS_DELAY:
      return {
        ...state,
        wsIsDelayLogin: action.data,
      };
    case ActionTypes.FETCH_SUCCESS_TICKERS:
      return {
        ...state,
        tickers: action.data,
      };
    case ActionTypes.UPDATE_TICKERS:
      return {
        ...state,
        tickers: action.data,
      };
    case ActionTypes.UPDATE_ACTIVE_MARKET:
      return {
        ...state,
        activeMarket: action.data,
      };
    case ActionTypes.UPDATE_SEARCH:
      return {
        ...state,
        searchText: action.data,
      };
    case ActionTypes.UPDATE_BILL_MENU:
      return {
        ...state,
        billMenuActive: action.data,
      };
    case ActionTypes.UPDATE_THEME:
      return {
        ...state,
        theme: action.data,
      };
    case ActionTypes.UPDATE_CNY_RATE:
      return {
        ...state,
        cnyRate: action.data,
      };
    default:
      return state;
  }
}
