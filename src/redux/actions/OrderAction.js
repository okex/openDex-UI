import Message from '_src/component/Message';
import ont from '../../utils/dataProxy';
import OrderActionType from '../actionTypes/OrderActionType';
import URL from '../../constants/URL';
import Enum from '../../utils/Enum';
import util from '../../utils/util';
import { OrderStatus } from '../../constants/OrderStatus';

const defaultPage = {
  page: 1,
  per_page: 20,
};
const defaultRespPage = {
  page: 1,
  per_page: 20,
  totalSize: 0,
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
    end,
  };
}

export function handleRequestCommon(params, url) {
  return (dispatch, getState) => {
    const store = getState();
    const { product } = store.SpotTrade;
    const { isHideOthers, periodIntervalType } = store.OrderStore;
    const { senderAddr } = window.OK_GLOBAL;
    const newParams = {
      ...defaultPage,
      product,
      ...params,
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
    const listKey = 'data';
    const pageKey = 'param_page';
    dispatch({
      type: OrderActionType.UPDATE_DATA,
      data: {
        isLoading: true,
        orderList: [],
      },
    });
    ont
      .get(ajaxUrl, { params: newParams })
      .then((res) => {
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
            page: resData[pageKey],
          },
        });
      })
      .catch(() => {
        dispatch({
          type: OrderActionType.UPDATE_DATA,
          data: {
            isLoading: false,
            orderList: [],
            page: defaultRespPage,
          },
        });
      });
  };
}

export function resetData() {
  return (dispatch) => {
    dispatch({
      type: OrderActionType.UPDATE_DATA,
      data: {
        isLoading: false,
        orderList: [],
        page: defaultRespPage,
      },
    });
  };
}

export function getNoDealList(params = {}) {
  return (dispatch, getState) => {
    const store = getState();
    const { product } = store.SpotTrade;
    const { isHideOthers, periodIntervalType } = store.OrderStore;
    const { senderAddr } = window.OK_GLOBAL;
    const newParams = {
      ...defaultPage,
      product,
      ...params,
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
    const listKey = 'data';
    const pageKey = 'param_page';
    ont
      .get(ajaxUrl, { params: newParams })
      .then((res) => {
        const resData = res.data;
        const list = resData[listKey] ? resData[listKey] : [];
        dispatch({
          type: OrderActionType.UPDATE_DATA,
          data: {
            isLoading: false,
            orderList: list,
            page: resData[pageKey],
          },
        });
      })
      .catch(() => {
        dispatch({
          type: OrderActionType.UPDATE_DATA,
          data: {
            isLoading: false,
            orderList: [],
            page: defaultRespPage,
          },
        });
      });
  };
}

export function getHistoryList(params = {}) {
  return (dispatch, getState) => {
    handleRequestCommon(params, URL.GET_ORDER_CLOSED)(dispatch, getState);
  };
}

export function getDetailList(params = {}) {
  return (dispatch, getState) => {
    handleRequestCommon(params, URL.GET_PRODUCT_DEALS)(dispatch, getState);
  };
}

export function getOrderList(params) {
  return (dispatch, getState) => {
    const { type } = getState().OrderStore;
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

export function updateType(type) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_ORDER_TYPE,
      data: type,
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}

export function updatePeriodInterval(type) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_ORDER_PERIOD_INTERVAL,
      data: type,
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}

export function updateHideOthers(isHide) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_HIDE_OTHERS,
      data: isHide,
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}

export function updateHideOrders(isHide) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_HIDE_ORDERS,
      data: isHide,
    });
    getHistoryList()(dispatch, getState);
  };
}

export function updateEntrustType(entrustType) {
  return (dispatch, getState) => {
    dispatch({
      type: OrderActionType.UPDATE_ENTRUST_TYPE,
      data: entrustType,
    });
    getOrderList({ page: 1 })(dispatch, getState);
  };
}

export function cancelOrder(params, successCallback, errCallback) {
  return (dispatch, getState) => {
    const { okexchainClient } = getState().Common;
    okexchainClient
      .setAccountInfo(params.pk)
      .then(() => {
        okexchainClient.sendCancelOrderTransaction(params.order_id).then(
          (r) => {
            if (r.result.code) {
              errCallback && errCallback({ msg: r.result.error });
            } else {
              successCallback && successCallback(r.result);
              const searchConditions = {
                product: params.product,
                side: params.side,
              };
              getNoDealList(searchConditions)(dispatch, getState);
            }
          },
          (e) => {
            errCallback && errCallback(e);
          }
        );
      })
      .catch((err) => {
        Message.error({ content: err.message, duration: 3 });
        errCallback && errCallback();
      });
  };
}

export function cancelAll() {
  return (dispatch, getState) => {
    const store = getState();
    const { wsIsOnline } = store.Spot;
    const { symbol, isMarginOpen, spotOrMargin } = store.SpotTrade;
    const systemType = isMarginOpen ? spotOrMargin : Enum.spotOrMargin.spot;
    const cancelAllUrl = URL.POST_CANCELALL_ORDER.replace(
      '{0}',
      symbol
    ).replace('{1}', systemType);
    ont.delete(cancelAllUrl).then(() => {
      if (!wsIsOnline) {
        getNoDealList()(dispatch, getState);
      }
    });
  };
}

export function wsUpdateList(noDealObj) {
  return (dispatch, getState) => {
    const wsData = noDealObj;
    const store = getState();
    const { type, entrustType, data, isHideOthers } = store.OrderStore;
    if (
      type !== Enum.order.type.noDeal ||
      entrustType !== Enum.order.entrustType.normal
    ) {
      return false;
    }
    if (typeof wsData === 'string') {
      return false;
    }
    const { Open } = OrderStatus;
    let currentData = [...data.orderList];
    if (currentData && currentData.length) {
      wsData.forEach((wsItem) => {
        let idIsExist = false;
        currentData.some((currentItem, currentIndex) => {
          if (wsItem.order_id === currentItem.order_id) {
            idIsExist = true;
            if ([Open].includes(wsItem.status.toString())) {
              currentData[currentIndex] = wsItem;
            } else {
              currentData.splice(currentIndex, 1);
            }
            return true;
          }
          return false;
        });
        if (!idIsExist && [Open].includes(wsItem.status.toString())) {
          currentData.unshift(wsItem);
        }
      });
    } else {
      currentData = wsData.filter((wsItem) => {
        return [Open].includes(wsItem.status.toString());
      });
    }
    if (isHideOthers) {
      const { product } = store.SpotTrade;
      currentData = currentData.filter((item) => {
        return item.product === product;
      });
    }
    return dispatch({
      type: OrderActionType.UPDATE_DATA,
      data: {
        orderList: currentData.splice(0, 20),
      },
    });
  };
}
