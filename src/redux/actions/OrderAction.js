import Message from '_src/component/Message';
import ont from '../../utils/dataProxy';
import OrderActionType from '../actionTypes/OrderActionType';
import URL from '../../constants/URL';
import Enum from '../../utils/Enum';
import util from '../../utils/util';
import { OrderStatus } from '../../constants/OrderStatus';


const defaultPage = {
  page: 1,
  per_page: 20
};
const defaultRespPage = {
  page: 1, // 当前页码
  per_page: 20,
  totalSize: 0
};
export function handleCommonParam(periodInterval) {
  let start = new Date();
  const end = Math.floor(new Date().getTime() / 1000);
  if (periodInterval === Enum.order.periodInterval.oneDay) {
    start = start.setDate(start.getDate() - 1);
  } else if (periodInterval === Enum.order.periodInterval.oneWeek) {
    start = start.setDate(start.getDate() - 7);
  } else if (periodInterval === Enum.order.periodInterval.oneMonth) {
    start = start.setDate(start.getDate() - 30);
  } else if (periodInterval === Enum.order.periodInterval.threeMonth) {
    start = start.setDate(start.getDate() - 90);
  }
  start = Math.floor(new Date(start).getTime() / 1000);
  return {
    start,
    end
  };
}
// 处理未成交订单、已完成订单和成交明细三个接口的请求
export function handleRequestCommon(params, url) {
  return (dispatch, getState) => {
    const store = getState();
    const { product } = store.SpotTrade;
    const { isHideOthers, periodIntervalType } = store.OrderStore;
    const { senderAddr } = window.OK_GLOBAL;
    // const startEnd = handleCommonParam(periodIntervalType);
    const newParams = {
      ...defaultPage,
      // ...startEnd,
      product,
      ...params
    };
    if (newParams.from === 'IndependentPage') {
      if (newParams.product === 'all') {
        delete newParams.product;
      }
      delete newParams.from;
    } else if (!isHideOthers) {
      delete newParams.product;
    }
    if (newParams.side === 'all') {
      delete newParams.side;
    }
    if (senderAddr) {
      newParams.address = senderAddr;
    } else {
      return;
    }
    const ajaxUrl = url;
    const listKey = 'data'; // response中存放数据信息字段名
    const pageKey = 'param_page'; // response中存放分页信息字段名
    dispatch({
      type: OrderActionType.UPDATE_DATA,
      data: {
        isLoading: true,
        orderList: []
      }
    });
    ont.get(ajaxUrl, { params: newParams }).then((res) => {
      const resData = res.data;
      let list = resData[listKey] ? resData[listKey] : [];
      if (ajaxUrl.indexOf('deals') > -1) {
        let newItem = {};
        list = list.map((item) => {
          newItem = { ...item };
          newItem.uniqueKey = newItem.order_id + newItem.block_height;
          return newItem;
        });
      }
      dispatch({
        type: OrderActionType.UPDATE_DATA,
        data: {
          isLoading: false,
          orderList: list,
          page: resData[pageKey]
        }
      });
    }).catch(() => {
      dispatch({
        type: OrderActionType.UPDATE_DATA,
        data: {
          isLoading: false,
          orderList: [],
          page: defaultRespPage
        }
      });
    });
  };
}
/**
 * 重置数据
 */
export function resetData() {
  return (dispatch) => {
    dispatch({
      type: OrderActionType.UPDATE_DATA,
      data: {
        isLoading: false,
        orderList: [],
        page: defaultRespPage
      }
    });
  };
}
/**
 * 获取未成交订单
 */
export function getNoDealList(params = {}) {
  return (dispatch, getState) => {
    const store = getState();
    const { product } = store.SpotTrade;
    const { isHideOthers, periodIntervalType } = store.OrderStore;
    const { senderAddr } = window.OK_GLOBAL;
    // const startEnd = handleCommonParam(periodIntervalType);
    const newParams = {
      ...defaultPage,
      // ...startEnd,
      product,
      ...params
    };
    if (newParams.from === 'IndependentPage') {
      if (newParams.product === 'all') {
        delete newParams.product;
      }
      delete newParams.from;
    } else if (!isHideOthers) {
      delete newParams.product;
    }
    if (newParams.side === 'all') {
      delete newParams.side;
    }
    if (senderAddr) {
      newParams.address = senderAddr;
    } else {
      return;
    }
    const ajaxUrl = URL.GET_ORDER_OPEN;
    const listKey = 'data'; // response中存放数据信息字段名
    const pageKey = 'param_page'; // response中存放分页信息字段名
    ont.get(ajaxUrl, { params: newParams }).then((res) => {
      const resData = res.data;
      const list = resData[listKey] ? resData[listKey] : [];
      dispatch({
        type: OrderActionType.UPDATE_DATA,
        data: {
          isLoading: false,
          orderList: list,
          page: resData[pageKey]
        }
      });
    }).catch(() => {
      dispatch({
        type: OrderActionType.UPDATE_DATA,
        data: {
          isLoading: false,
          orderList: [],
          page: defaultRespPage
        }
      });
    });
  };
}
/**
 * 获取历史订单
 */
export function getHistoryList(params = {}) {
  return (dispatch, getState) => {
    handleRequestCommon(params, URL.GET_ORDER_CLOSED)(dispatch, getState);
  };
}
/**
 * 获取成交明细
 */
export function getDetailList(params = {}) {
  return (dispatch, getState) => {
    handleRequestCommon(params, URL.GET_PRODUCT_DEALS)(dispatch, getState);
  };
}
/**
 * 获取订单，本action内部自动判断获取"未成交"还是"历史"
 */
export function getOrderList(params) {
  return (dispatch, getState) => {
    const { type } = getState().OrderStore;
    // const { isLogin } = window.OK_GLOBAL;
    if (util.isLogined()) {
      if (type === Enum.order.type.noDeal) {
        getNoDealList(params)(dispatch, getState);
      } else if (type === Enum.order.type.history) {
        getHistoryList(params)(dispatch, getState);
      } else if (type === Enum.order.type.detail) {
        getDetailList(params)(dispatch, getState);
      }
    }
  };
}
/**
 * 更新一级tab类型
 */
export function updateType(type) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_ORDER_TYPE,
      data: type
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}
/**
 * 更新二级 周期间隔
 */
export function updatePeriodInterval(type) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_ORDER_PERIOD_INTERVAL,
      data: type
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}
/**
 * 隐藏其他币对
 */
export function updateHideOthers(isHide) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_HIDE_OTHERS,
      data: isHide
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}
/**
 * 隐藏已撤销
 */
export function updateHideOrders(isHide) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_HIDE_ORDERS,
      data: isHide
    });
    // const symbol = isHide ? getState().SpotTrade.symbol : 'all';
    getHistoryList()(dispatch, getState);
  };
}
/**
 * 更新二级委托类型
 */
export function updateEntrustType(entrustType) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_ENTRUST_TYPE,
      data: entrustType
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}
/**
 * 撤销订单
 */
export function cancelOrder(params, successCallback, errCallback) {
  return (dispatch, getState) => {
    const { okexchainClient } = getState().Common;
    // const { senderAddr } = window.OK_GLOBAL; // senderAddr,
    okexchainClient.setAccountInfo(params.pk).then(() => {
      okexchainClient.sendCancelOrderTransaction(params.order_id).then((r) => {
        if (r.result.code) {
          errCallback && errCallback({ msg: r.result.error });
        } else {
          successCallback && successCallback(r.result);
          const searchConditions = {
            // start: params.start,
            // end: params.end,
            product: params.product,
            side: params.side
          };
          getNoDealList(searchConditions)(dispatch, getState);
        }
      }, (e) => {
        errCallback && errCallback(e);
      });
    }).catch((err) => {
      Message.error({ content: err.message, duration: 3 });
      errCallback && errCallback();
    });
  };
}
/**
 * 当前币对全撤
 */
export function cancelAll() {
  return (dispatch, getState) => {
    const store = getState();
    const { wsIsOnline } = store.Spot;
    const { symbol, isMarginOpen, spotOrMargin } = store.SpotTrade;
    const systemType = isMarginOpen ? spotOrMargin : Enum.spotOrMargin.spot;
    const cancelAllUrl = URL.POST_CANCELALL_ORDER.replace('{0}', symbol).replace('{1}', systemType);
    ont.delete(cancelAllUrl).then(() => {
      // 只能发生在未成交普通委托情况下，会有推送
      if (!wsIsOnline) {
        getNoDealList()(dispatch, getState);
      }
    });
  };
}
/**
 * 推送数据更新普通未成交订单
 */
export function wsUpdateList(noDealObj) {
  return (dispatch, getState) => {
    const wsData = noDealObj;
    const store = getState();
    const {
      type, entrustType, data, isHideOthers
    } = store.OrderStore;// 隐藏其他币对
    if (type !== Enum.order.type.noDeal || entrustType !== Enum.order.entrustType.normal) {
      // 只在普通委托未成交下处理推送数据
      return false;
    }
    if (typeof wsData === 'string') {
      return false;
    }
    // noDealObj是后端返回的数组
    // if (Object.prototype.toString.call(noDealObj) === '[object Object]' &&
    //   Object.keys(noDealObj).length > 0) {
    //   // 转换之后的数据如果是对象，则转换成数组
    //   wsData = [noDealObj];
    // } else {
    //   return false;
    // }
    const { Open } = OrderStatus;
    let currentData = [...data.orderList];
    // 未成交列表中有数据
    if (currentData && currentData.length) {
      wsData.forEach((wsItem) => {
        let idIsExist = false;
        currentData.some((currentItem, currentIndex) => {
          if (wsItem.order_id === currentItem.order_id) {
            idIsExist = true;
            // 部分成交、撤单中等其他状态，则直接数据覆盖更新状态
            if ([Open].includes(wsItem.status.toString())) {
              currentData[currentIndex] = wsItem;
            } else { // 在未成交列表中，状态发生变化，变为"已撤销"或者"完全成交"，则删除该条数据
              currentData.splice(currentIndex, 1);
            }
            return true;
          }
          return false;
        });
        // 不在未成交列表中，且状态不是"已撤销"或者"完全成交"，则插入该条数据
        if (!idIsExist && [Open].includes(wsItem.status.toString())) {
          currentData.unshift(wsItem);
        }
      });
    } else {
      // 未成交列表中没有数据
      currentData = wsData.filter((wsItem) => {
        return [Open].includes(wsItem.status.toString());
      });
    }
    // 当隐藏其他币对勾选时，筛除其他币对
    if (isHideOthers) {
      const { product } = store.SpotTrade;
      currentData = currentData.filter((item) => {
        return item.product === product;
      });
    }
    return dispatch({
      type: OrderActionType.UPDATE_DATA,
      data: {
        orderList: currentData.splice(0, 20)
      }
    });
  };
}
