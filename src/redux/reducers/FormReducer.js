import FormActionTypes from '../actionTypes/FormActionType';
import Enum from '../../utils/Enum';

const initialState = {
  canSubmit: true, // 是否可以下单
  isLoading: false, // 下单按钮loading状态
  isSuccess: true, // 下单是否成功
  warning: '', // 错误信息
  type: Enum.placeOrder.type.buy, // 买卖类型, buy sell
  strategyType: Enum.placeOrder.strategyType.limit, // 下单策略: 限价单1，市价单2， 计划委托3
  inputObj: { // 下单的input值,限价、市价通用
    price: '',
    amount: '',
    total: '',
    couponId: ''
  },
  inputObjFromDepth: { // 从深度来的下单数据
    type: Enum.placeOrder.type.buy,
    price: '',
    amount: '',
    total: ''
  },
  planInputObj: { // 计划委托input
    triggerPrice: '', // 触发价格
    tradePrice: '', // 委托价格
    amount: '' // 数量
  },
  trackInputObj: { // 跟踪委托input
    range: '', // 回调幅度
    activatePrice: '', // 激活价格
    amount: '' // 数量
  },
  icebergInputObj: { // 冰山委托input
    priceVariance: '', // 委托深度
    totalAmount: '', // 委托总数
    avgAmount: '', // 单笔均值
    priceLimit: '', // 价格限制
  },
  timeWeightInputObj: { // 时间加权委托input
    priceVariance: '', // 扫单范围
    sweepRatio: '', // 扫单比例
    totalAmount: '', // 委托总数
    priceLimitTrade: '', // 单笔上限
    priceLimitBase: '', // 价格限制
    timeInterval: '', // 委托间隔
  }
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    // 更新买卖类型
    case FormActionTypes.UPDATE_TYPE:
      return {
        ...state,
        type: action.data
      };
    // 更新委托类型
    case FormActionTypes.UPDATE_STRATEGY_TYPE:
      return {
        ...state,
        strategyType: action.data
      };
    // 更新input值
    case FormActionTypes.UPDATE_INPUT:
      return {
        ...state,
        inputObj: {
          ...state.inputObj,
          ...action.data
        }
      };
    // 更新input值 from depth
    case FormActionTypes.UPDATE_DEPTH_INPUT:
      return {
        ...state,
        inputObjFromDepth: {
          ...state.inputObjFromDepth,
          ...action.data
        }
      };
    // 更新planInput值
    case FormActionTypes.UPDATE_PLAN_INPUT:
      return {
        ...state,
        planInputObj: {
          ...state.planInputObj,
          ...action.data
        }
      };
    // 更新trackInput值
    case FormActionTypes.UPDATE_TRACK_INPUT:
      return {
        ...state,
        trackInputObj: {
          ...state.trackInputObj,
          ...action.data
        }
      };
    // 更新icebergInput值
    case FormActionTypes.UPDATE_ICEBERG_INPUT:
      return {
        ...state,
        icebergInputObj: {
          ...state.icebergInputObj,
          ...action.data
        }
      };
    // 更新icebergInput值
    case FormActionTypes.UPDATE_TIME_WEIGHT_INPUT:
      return {
        ...state,
        timeWeightInputObj: {
          ...state.timeWeightInputObj,
          ...action.data
        }
      };
    // 更新错误提示
    case FormActionTypes.UPDATE_WARNING:
      return {
        ...state,
        warning: action.data
      };
    // 下单
    case FormActionTypes.SUBMIT_ORDER:
      return {
        ...state,
        isLoading: true,
        warning: ''
      };
    // 下单成功
    case FormActionTypes.SUBMIT_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true
      };
    // 下单失败
    case FormActionTypes.SUBMIT_ORDER_ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        warning: action.data
      };
    // 下单失败
    case FormActionTypes.DISABLED_SUBMIT:
      return {
        ...state,
        canSubmit: false
      };
    default:
      return state;
  }
}
