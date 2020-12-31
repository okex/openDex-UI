import { storage } from '_component/okit';
import ActionTypes from '../actionTypes/SpotTradeActionType';
import SpotActionTypes from '../actionTypes/SpotActionType';
import Enum from '../../utils/Enum';
import env from '../../constants/env';

const initialState = {
  groupList: [
    {
      filterWord: [env.envConfig.token.quote],
      groupId: 1,
      groupName: env.envConfig.token.quoteName,
      type: 'normal',
    },
    {
      filterWord: [],
      groupId: 2,
      groupKey: 'group_hot',
      type: 'hot',
    },
    {
      filterWord: [],
      groupId: 3,
      groupKey: 'group_new',
      type: 'new',
    },
  ],
  groupObj: {},
  product: '',
  productList: [],
  productObj: {},
  favorites: storage.get('favorites') || env.envConfig.token.favorites,

  currencyList: [],
  currencyObjByName: {},
  currencyTicker: {
    change: 0,
    changePercentage: '--',
    close: 0,
    high: 0,
    low: 0,
    open: 0,
    price: '--',
    product: '',
    symbol: '',
    timestamp: '',
    volume: 0,
  },

  account: {},
  spotAsset: [],

  spotAssetObj: {
    currencyName: '',
    currencyId: 0,
    isShowTransfer: false,
  },

  depth: {
    asks: [],
    bids: [],
  },
  depth200: {
    asks: [],
    bids: [],
  },
  callMarketObj: {},
  spotOrMargin:
    Number(window.localStorage.getItem('spot_spotOrMargin')) ||
    Enum.spotOrMargin.spot,

  isMarginOpen: false,

  marginAccount: {},
  candyInfo: {},
  marginData: {},
  marginObj: {
    userMarginSetting: -1,
    isKnewBorrow: 0,
    isShowTransfer: false,
    isShowLoanLayer: false,
    isShowRepaymentLayer: false,
    isShowRepayCandyLayer: false,
  },
  klineData: [],
  deals: [],
  fee: {
    maker: '--',
    taker: '--',
  },
  hourRate: {},
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_SUCCESS_PRODUCT_LIST:
      return {
        ...state,
        ...action.data,
      };
    case ActionTypes.FETCH_ERROR_PRODUCT_LIST:
      return {
        ...state,
        productList: [],
        productObj: {},
      };
    case SpotActionTypes.COLLECT_PRODUCT:
      return {
        ...state,
        productList: action.data.productList,
        productObj: action.data.productObj,
      };
    case SpotActionTypes.UPDATE_SYMBOL:
      return {
        ...state,
        ...action.data,
      };
    case ActionTypes.FETCH_SUCCESS_CURRENCY_LIST:
      return {
        ...state,
        ...action.data,
      };
    case ActionTypes.FETCH_ERROR_CURRENCY_LIST:
      return {
        ...state,
        currencyList: [],
        currencyObjByName: {},
      };
    case ActionTypes.UPDATE_TICKER:
      return {
        ...state,
        currencyTicker: action.data,
      };
    case ActionTypes.FETCH_UPDATE_ASSETS: {
      const { account, spotAsset } = action.data;
      return {
        ...state,
        account,
        spotAsset,
      };
    }
    case ActionTypes.REFRESH_ASSETS: {
      const { spotAsset } = action.data;
      return {
        ...state,
        spotAsset,
      };
    }
    case ActionTypes.FETCH_ERROR_ASSETS:
      return {
        ...state,
        account: {},
      };
    case ActionTypes.UPDATE_DEPTH:
      return {
        ...state,
        ...action.data,
      };
    case ActionTypes.FETCH_CLEAR_UPDATE_DEPTH:
      return {
        ...state,
        depth: {
          asks: [],
          bids: [],
        },
        depth200: {
          asks: [],
          bids: [],
        },
      };

    case ActionTypes.KNEW_AUTO_BORROW:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isKnewBorrow: 1,
        },
      };
    case ActionTypes.FETCH_SUCCESS_USER_MARGIN_SETTING:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          userMarginSetting: action.data.status,
          isKnewBorrow: action.data.type,
        },
      };
    case ActionTypes.FETCH_ERROR_USER_MARGIN_SETTING:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          userMarginSetting: -1,
          isKnewBorrow: 0,
        },
      };
    case ActionTypes.GET_SUCCESS_MARGIN_ACCOUNT: {
      const { marginAccount, marginData } = action.data;
      return {
        ...state,
        marginAccount,
        marginData,
      };
    }

    case ActionTypes.GET_ERROR_MARGIN_ACCOUNT:
      return {
        ...state,
        marginAccount: {},
      };
    case ActionTypes.GET_SUCCESS_MARGIN_CANDY: {
      return {
        ...state,
        candyInfo: action.data,
      };
    }

    case ActionTypes.GET_ERROR_MARGIN_CANDY:
      return {
        ...state,
        candyInfo: {},
      };
    case ActionTypes.FETCH_SUCCESS_KLINE_DATA:
      return {
        ...state,
        klineData: action.data,
      };
    case ActionTypes.FETCH_UPDATE_WS_MARGINASSETS: {
      const { marginAccount, marginData } = action.data;
      return {
        ...state,
        marginData,
        marginAccount,
      };
    }
    case ActionTypes.UPDATE_TRANSFER:
      return {
        ...state,
        spotAssetObj: {
          ...state.spotAssetObj,
          ...action.data,
        },
      };
    case ActionTypes.UPDATE_MARGIN_TRANSFER:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowTransfer: action.data,
        },
      };
    case ActionTypes.UPDATE_USER_MARGIN_SETTING:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          userMarginSetting: action.data,
        },
      };
    case ActionTypes.FETCH_UPDATE_MARGIN_LOAN:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowLoanLayer: action.data,
        },
      };
    case ActionTypes.FETCH_UPDATE_MARGIN_REPAYMENT:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowRepaymentLayer: action.data,
        },
      };
    case ActionTypes.FETCH_UPDATE_MARGIN_REPAY_CANDY:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowRepayCandyLayer: action.data,
        },
      };
    case ActionTypes.UPDATE_SPOT_OR_MARGIN:
      return {
        ...state,
        spotOrMargin: action.data,
      };
    case ActionTypes.FETCH_SUCCESS_DEALS:
      return {
        ...state,
        deals: action.data,
      };
    case ActionTypes.WS_UPDATE_DEALS:
      return {
        ...state,
        deals: action.data,
      };
    case ActionTypes.CLEAR_DEALS:
      return {
        ...state,
        deals: [],
      };
    case ActionTypes.FETCH_CALLMARKET:
      return {
        ...state,
        ...action.data,
      };
    case ActionTypes.REMOVE_CALLMARKET_DATA:
      return {
        ...state,
        callMarketObj: action.data,
      };
    case ActionTypes.UPDATE_FULLDEPTH:
      return {
        ...state,
        depth: action.data,
      };
    case ActionTypes.UPDATE_FEE:
      return {
        ...state,
        fee: action.data,
      };
    case ActionTypes.UPDATE_HOUR_RATE:
      return {
        ...state,
        hourRate: action.data,
      };

    case ActionTypes.UPDATE_FAVORITES:
      return {
        ...state,
        favorites: action.data,
      };
    default:
      return state;
  }
}
