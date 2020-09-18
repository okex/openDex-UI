import FormActionTypes from '../actionTypes/FormActionType';
import Enum from '../../utils/Enum';

const initialState = {
  canSubmit: true,
  isLoading: false,
  isSuccess: true,
  warning: '',
  type: Enum.placeOrder.type.buy,
  strategyType: Enum.placeOrder.strategyType.limit,
  inputObj: {
    price: '',
    amount: '',
    total: '',
    couponId: '',
  },
  inputObjFromDepth: {
    type: Enum.placeOrder.type.buy,
    price: '',
    amount: '',
    total: '',
  },
  planInputObj: {
    triggerPrice: '',
    tradePrice: '',
    amount: '',
  },
  trackInputObj: {
    range: '',
    activatePrice: '',
    amount: '',
  },
  icebergInputObj: {
    priceVariance: '',
    totalAmount: '',
    avgAmount: '',
    priceLimit: '',
  },
  timeWeightInputObj: {
    priceVariance: '',
    sweepRatio: '',
    totalAmount: '',
    priceLimitTrade: '',
    priceLimitBase: '',
    timeInterval: '',
  },
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case FormActionTypes.UPDATE_TYPE:
      return {
        ...state,
        type: action.data,
      };
    case FormActionTypes.UPDATE_STRATEGY_TYPE:
      return {
        ...state,
        strategyType: action.data,
      };
    case FormActionTypes.UPDATE_INPUT:
      return {
        ...state,
        inputObj: {
          ...state.inputObj,
          ...action.data,
        },
      };
    case FormActionTypes.UPDATE_DEPTH_INPUT:
      return {
        ...state,
        inputObjFromDepth: {
          ...state.inputObjFromDepth,
          ...action.data,
        },
      };
    case FormActionTypes.UPDATE_PLAN_INPUT:
      return {
        ...state,
        planInputObj: {
          ...state.planInputObj,
          ...action.data,
        },
      };
    case FormActionTypes.UPDATE_TRACK_INPUT:
      return {
        ...state,
        trackInputObj: {
          ...state.trackInputObj,
          ...action.data,
        },
      };
    case FormActionTypes.UPDATE_ICEBERG_INPUT:
      return {
        ...state,
        icebergInputObj: {
          ...state.icebergInputObj,
          ...action.data,
        },
      };
    case FormActionTypes.UPDATE_TIME_WEIGHT_INPUT:
      return {
        ...state,
        timeWeightInputObj: {
          ...state.timeWeightInputObj,
          ...action.data,
        },
      };
    case FormActionTypes.UPDATE_WARNING:
      return {
        ...state,
        warning: action.data,
      };
    case FormActionTypes.SUBMIT_ORDER:
      return {
        ...state,
        isLoading: true,
        warning: '',
      };
    case FormActionTypes.SUBMIT_ORDER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isSuccess: true,
      };
    case FormActionTypes.SUBMIT_ORDER_ERROR:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        warning: action.data,
      };
    case FormActionTypes.DISABLED_SUBMIT:
      return {
        ...state,
        canSubmit: false,
      };
    default:
      return state;
  }
}
