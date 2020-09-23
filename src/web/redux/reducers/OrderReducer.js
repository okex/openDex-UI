import OrderActionTypes from '../actionTypes/OrderActionType';
import Enum from '../../utils/Enum';

const initialState = {
  type: Enum.order.type.noDeal,
  periodIntervalType: Enum.order.periodInterval.oneDay,
  isHideOthers: true,
  isHideOrders: false,
  entrustType: Enum.order.entrustType.normal,
  data: {
    isLoading: false,
    orderList: [],
    page: {
      page: 1,
      per_page: 20,
      total: 0,
    },
  },
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case OrderActionTypes.UPDATE_ORDER_TYPE:
      return {
        ...state,
        type: action.data,
      };
    case OrderActionTypes.UPDATE_ORDER_PERIOD_INTERVAL:
      return {
        ...state,
        periodIntervalType: action.data,
      };
    case OrderActionTypes.UPDATE_HIDE_OTHERS:
      return {
        ...state,
        isHideOthers: action.data,
      };
    case OrderActionTypes.UPDATE_HIDE_ORDERS:
      return {
        ...state,
        isHideOrders: action.data,
      };
    case OrderActionTypes.UPDATE_ENTRUST_TYPE:
      return {
        ...state,
        entrustType: action.data,
      };
    case OrderActionTypes.UPDATE_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data,
        },
      };
    default:
      return state;
  }
}
