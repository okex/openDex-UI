import { storage } from '_component/okit';
import ActionTypes from '../actionTypes/SpotTradeActionType';
import SpotActionTypes from '../actionTypes/SpotActionType';
import Enum from '../../utils/Enum';

const initialState = {
  groupList: [
    {
      filterWord: ['tusdk'],
      groupId: 1,
      groupName: 'TUSDK',
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
    }], // 交易区列表
  groupObj: {}, // 交易区对象形式
  /* 基础数据 */
  product: '', // 当前币对名称
  // 币对列表
  productList: [], // 所有币对
  productObj: {}, // 所有币对的对象形式
  // 本地收藏币对列表
  favoriteList: JSON.parse(storage.get('favoriteList') || '[]'),

  // 币种列表
  currencyList: [], // 所有币种
  currencyObjByName: {}, // [{symbol->item},...]
  // 当前币对的行情，全部tickers在SpotReducer.js中
  currencyTicker: {
    change: 0, // 涨跌幅
    changePercentage: '--', // 除涨跌幅外跟api接口保持一致
    close: 0,
    high: 0,
    low: 0,
    open: 0,
    price: '--', // 2020-01-09 价格永远不为0
    product: '',
    symbol: '',
    timestamp: '',
    volume: 0
  }, // 当前币对ticker

  // 我的账户余额列表。两个同时更新
  account: {}, // 全部币对资产  [{symbol->item},...]
  spotAsset: [], // 当前币对资产 [{base}, {quote}]

  spotAssetObj: {
    currencyName: '',
    currencyId: 0,
    isShowTransfer: false, // 是否显示资金划转弹窗
  },

  // 深度列表
  depth: {
    asks: [],
    bids: []
  }, // 深度数据
  depth200: {
    asks: [],
    bids: []
  }, // 200档深度数据，供全屏交易K线绘制买卖力度使用
  callMarketObj: {}, // 集合竞价
  // 币币-杠杆设置
  spotOrMargin: Number(window.localStorage.getItem('spot_spotOrMargin')) || Enum.spotOrMargin.spot,

  /* 资产部分 */
  isMarginOpen: false, // 当前币对是否开启杠杆

  marginAccount: {}, // 杠杆资产
  candyInfo: {}, // 当前币对糖果
  marginData: {}, // 当前币对杠杆资产
  marginObj: {
    userMarginSetting: -1, // 用户是否开通杠杆 0未开通 ,1已开通
    isKnewBorrow: 0, // 用户是否了解需要自动借币
    isShowTransfer: false, // 是否显示资金划转弹窗
    isShowLoanLayer: false, // 是否显示借币弹窗
    isShowRepaymentLayer: false, // 是否显示还币弹窗
    isShowRepayCandyLayer: false, // 是否显示还糖果弹窗
  },
  // k线数据
  klineData: [],
  // 最新成交
  deals: [],
  // 开放交易所费率
  fee: {
    maker: '--',
    taker: '--'
  },
  // 开通杠杆币种小时费率
  hourRate: {}
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.FETCH_SUCCESS_PRODUCT_LIST:
      return {
        ...state,
        ...action.data
      };
    case ActionTypes.FETCH_ERROR_PRODUCT_LIST:
      return {
        ...state,
        productList: [],
        productObj: {}
      };
    case SpotActionTypes.COLLECT_PRODUCT:
      return {
        ...state,
        productList: action.data.productList,
        productObj: action.data.productObj
      };
    case SpotActionTypes.UPDATE_SYMBOL:
      return {
        ...state,
        ...action.data
      };
    case ActionTypes.FETCH_SUCCESS_CURRENCY_LIST:
      return {
        ...state,
        ...action.data
      };
    case ActionTypes.FETCH_ERROR_CURRENCY_LIST:
      return {
        ...state,
        currencyList: [],
        currencyObjByName: {}
      };
    case ActionTypes.UPDATE_TICKER:
      return {
        ...state,
        currencyTicker: action.data
      };
    case ActionTypes.FETCH_UPDATE_ASSETS: {
      const { account, spotAsset } = action.data;
      return {
        ...state,
        account,
        spotAsset
      };
    }
    case ActionTypes.REFRESH_ASSETS: {
      const { spotAsset } = action.data;
      return {
        ...state,
        spotAsset
      };
    }
    case ActionTypes.FETCH_ERROR_ASSETS:
      return {
        ...state,
        account: {}
      };
    case ActionTypes.UPDATE_DEPTH:
      return {
        ...state,
        ...action.data
      };
    case ActionTypes.FETCH_CLEAR_UPDATE_DEPTH:
      return {
        ...state,
        depth: {
          asks: [],
          bids: []
        },
        depth200: {
          asks: [],
          bids: []
        }
      };

    case ActionTypes.KNEW_AUTO_BORROW:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isKnewBorrow: 1
        }
      };
    case ActionTypes.FETCH_SUCCESS_USER_MARGIN_SETTING:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          userMarginSetting: action.data.status,
          isKnewBorrow: action.data.type
        }
      };
    case ActionTypes.FETCH_ERROR_USER_MARGIN_SETTING:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          userMarginSetting: -1,
          isKnewBorrow: 0
        }
      };
    case ActionTypes.GET_SUCCESS_MARGIN_ACCOUNT: {
      const { marginAccount, marginData } = action.data;
      return {
        ...state,
        marginAccount,
        marginData
      };
    }

    case ActionTypes.GET_ERROR_MARGIN_ACCOUNT:
      return {
        ...state,
        marginAccount: {}
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
        candyInfo: {}
      };
    case ActionTypes.FETCH_SUCCESS_KLINE_DATA:
      return {
        ...state,
        klineData: action.data
      };
    case ActionTypes.FETCH_UPDATE_WS_MARGINASSETS: {
      const { marginAccount, marginData } = action.data;
      return {
        ...state,
        marginData,
        marginAccount
      };
    }
    case ActionTypes.UPDATE_TRANSFER:
      return {
        ...state,
        spotAssetObj: {
          ...state.spotAssetObj,
          ...action.data
        },
      };
    case ActionTypes.UPDATE_MARGIN_TRANSFER:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowTransfer: action.data
        }
      };
    case ActionTypes.UPDATE_USER_MARGIN_SETTING:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          userMarginSetting: action.data
        }
      };
    case ActionTypes.FETCH_UPDATE_MARGIN_LOAN:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowLoanLayer: action.data
        }
      };
    case ActionTypes.FETCH_UPDATE_MARGIN_REPAYMENT:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowRepaymentLayer: action.data
        }
      };
    case ActionTypes.FETCH_UPDATE_MARGIN_REPAY_CANDY:
      return {
        ...state,
        marginObj: {
          ...state.marginObj,
          isShowRepayCandyLayer: action.data
        }
      };
    case ActionTypes.UPDATE_SPOT_OR_MARGIN:
      return {
        ...state,
        spotOrMargin: action.data
      };
    case ActionTypes.FETCH_SUCCESS_DEALS:
      return {
        ...state,
        deals: action.data
      };
    case ActionTypes.WS_UPDATE_DEALS:
      return {
        ...state,
        deals: action.data
      };
    case ActionTypes.CLEAR_DEALS:
      return {
        ...state,
        deals: []
      };
    case ActionTypes.FETCH_CALLMARKET:
      return {
        ...state,
        ...action.data
      };
    case ActionTypes.REMOVE_CALLMARKET_DATA:
      return {
        ...state,
        callMarketObj: action.data
      };
    case ActionTypes.UPDATE_FULLDEPTH:
      return {
        ...state,
        depth: action.data
      };
    case ActionTypes.UPDATE_FEE:
      return {
        ...state,
        fee: action.data
      };
    case ActionTypes.UPDATE_HOUR_RATE:
      return {
        ...state,
        hourRate: action.data
      };

    case ActionTypes.UPDATE_FAVORITE_LIST:
      return {
        ...state,
        favoriteList: action.data
      };
    default:
      return state;
  }
}
