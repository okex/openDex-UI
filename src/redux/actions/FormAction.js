import FormActionType from '../actionTypes/FormActionType';

import Enum from '../../utils/Enum';
import FormatNum from '../../utils/FormatNum';
import Message from '_src/component/Message';
import { toLocale } from '_src/locale/react-locale';


/**
 * 清空表单数据
 */
export function clearForm() {
  return (dispatch) => {
    const actionType = FormActionType.UPDATE_INPUT;
    const data = { // 不清空"价格"input
      amount: '',
      total: '',
      couponId: ''
    };
    dispatch({
      type: actionType,
      data
    });
  };
}

/**
 * 更新买卖类型
 */
export function updateType(type) {
  return (dispatch, getState) => {
    clearForm()(dispatch, getState);
    dispatch({
      type: FormActionType.UPDATE_TYPE,
      data: type
    });
  };
}

/**
 * 更新委托类型
 */
export function updateStrategyType(orderType) {
  return (dispatch, getState) => {
    clearForm()(dispatch, getState);
    dispatch({
      type: FormActionType.UPDATE_STRATEGY_TYPE,
      data: orderType
    });
  };
}

/**
 * 更新input值
 */
export function updateInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_INPUT,
      data: inputObj
    });
  };
}

/**
 * 更新input值 from depth
 */
export function updateDepthInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_DEPTH_INPUT,
      data: inputObj
    });
  };
}

/**
 * 更新计划委托input值
 */
export function updatePlanInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_PLAN_INPUT,
      data: inputObj
    });
  };
}

/**
 * 更新跟踪委托input值
 */
export function updateTrackInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_TRACK_INPUT,
      data: inputObj
    });
  };
}

/**
 * 更新冰山委托input值
 */
export function updateIcebergInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_ICEBERG_INPUT,
      data: inputObj
    });
  };
}

/**
 * 更新时间加权委托input值
 */
export function updateTimeWeightInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_TIME_WEIGHT_INPUT,
      data: inputObj
    });
  };
}

/**
 * 更新错误提示
 */
export function updateWarning(warnText) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_WARNING,
      data: warnText
    });
  };
}

/**
 * 提交表单
 */
export function submitOrder(params, callback, errCallback) {
  return (dispatch, getState) => {
    const { isLoading } = getState().FormStore;
    if (isLoading) {
      return false;
    }
    const { okexchainClient } = getState().Common;
    dispatch({
      type: FormActionType.SUBMIT_ORDER,
      data: {}
    });
    // placeOrder To OKExChain
    return okexchainClient.setAccountInfo(params.pk).then(() => {
      okexchainClient.sendPlaceOrderTransaction(
        params.product,
        (params.side === Enum.placeOrder.type.buy) ? 'BUY' : 'SELL',
        FormatNum.formatNumber2String(params.price),
        FormatNum.formatNumber2String(params.size)
      ).then((placeOrderRes) => { // 成功
        if (placeOrderRes.result.code) {
          dispatch({
            type: FormActionType.SUBMIT_ORDER_ERROR,
            data: placeOrderRes.result.error
          });
          errCallback && errCallback({ msg: placeOrderRes.result.error });
        } else {
          dispatch({
            type: FormActionType.SUBMIT_ORDER_SUCCESS,
            data: ''
          });
          callback && callback(placeOrderRes.result);
        }
      }).catch((err) => { // 失败
        dispatch({
          type: FormActionType.SUBMIT_ORDER_ERROR,
          data: err.message
        });
        errCallback && errCallback(err);
      });
    }).catch((err) => {
      Message.error({ content: err.message, duration: 3 });
      errCallback && errCallback(err);
    });
  };
}

// 仅仅设置redux中loading的状态
// dispatch({
//   type: FormActionType.SUBMIT_ORDER_SUCCESS,
//   data: ''
// });
// this.submitOrderErrCallback(err);
// export function submitOrderErrCallback(res) {
//   return (dispatch) => {
//     dispatch({
//       type: FormActionType.SUBMIT_ORDER_ERROR,
//       data: res.msg
//     });
//   };
// }

/**
 * 禁用表单提交按钮
 */
export function disableSubmit() {
  return (dispatch) => {
    dispatch({
      type: FormActionType.DISABLED_SUBMIT,
      data: {}
    });
  };
}

