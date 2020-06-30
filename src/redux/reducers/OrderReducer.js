import OrderActionTypes from '../actionTypes/OrderActionType';
import Enum from '../../utils/Enum';

const initialState = {
  type: Enum.order.type.noDeal, // 一级tab类型  未成交 or 历史委托
  periodIntervalType: Enum.order.periodInterval.oneDay,
  isHideOthers: true, // 是否勾选"隐藏其他币对",
  isHideOrders: false, // 是否勾选"隐藏已撤销",
  entrustType: Enum.order.entrustType.normal, // 二级委托类型 普通、计划、跟踪。。。
  data: { // table数据展示
    isLoading: false,
    orderList: [],
    page: {
      page: 1, // 当前页码
      per_page: 20,
      total: 0
    }
  }
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    // 更新一级tab类型
    case OrderActionTypes.UPDATE_ORDER_TYPE:
      return {
        ...state,
        type: action.data
      };
    // 更新二级 周期间隔
    case OrderActionTypes.UPDATE_ORDER_PERIOD_INTERVAL:
      return {
        ...state,
        periodIntervalType: action.data
      };
    // 更新是否勾选"隐藏其他币对"
    case OrderActionTypes.UPDATE_HIDE_OTHERS:
      return {
        ...state,
        isHideOthers: action.data
      };
    // 更新是否勾选"隐藏已撤单"
    case OrderActionTypes.UPDATE_HIDE_ORDERS:
      return {
        ...state,
        isHideOrders: action.data
      };
    // 更新二级委托类型
    case OrderActionTypes.UPDATE_ENTRUST_TYPE:
      return {
        ...state,
        entrustType: action.data
      };
    // 更新table数据
    case OrderActionTypes.UPDATE_DATA:
      return {
        ...state,
        data: {
          ...state.data,
          ...action.data
        }
      };
    default:
      return state;
  }
}
