import FormActionType from '../actionTypes/FormActionType';
import Enum from '../../utils/Enum';
import FormatNum from '../../utils/FormatNum';
import Message from '_src/component/Message';
import { toLocale } from '../../locale/react-locale';

export function clearForm() {
  return (dispatch) => {
    const actionType = FormActionType.UPDATE_INPUT;
    const data = {
      amount: '',
      total: '',
      couponId: '',
    };
    dispatch({
      type: actionType,
      data,
    });
  };
}

export function updateType(type) {
  return (dispatch, getState) => {
    clearForm()(dispatch, getState);
    dispatch({
      type: FormActionType.UPDATE_TYPE,
      data: type,
    });
  };
}

export function updateStrategyType(orderType) {
  return (dispatch, getState) => {
    clearForm()(dispatch, getState);
    dispatch({
      type: FormActionType.UPDATE_STRATEGY_TYPE,
      data: orderType,
    });
  };
}

export function updateInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_INPUT,
      data: inputObj,
    });
  };
}

export function updateDepthInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_DEPTH_INPUT,
      data: inputObj,
    });
  };
}

export function updatePlanInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_PLAN_INPUT,
      data: inputObj,
    });
  };
}

export function updateTrackInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_TRACK_INPUT,
      data: inputObj,
    });
  };
}

export function updateIcebergInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_ICEBERG_INPUT,
      data: inputObj,
    });
  };
}

export function updateTimeWeightInput(inputObj) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_TIME_WEIGHT_INPUT,
      data: inputObj,
    });
  };
}

export function updateWarning(warnText) {
  return (dispatch) => {
    dispatch({
      type: FormActionType.UPDATE_WARNING,
      data: warnText,
    });
  };
}

export function submitOrder(params, callback, errCallback) {
  return (dispatch, getState) => {
    const { isLoading } = getState().FormStore;
    if (isLoading) {
      return false;
    }
    const { okexchainClient } = getState().Common;
    dispatch({
      type: FormActionType.SUBMIT_ORDER,
      data: {},
    });
    return okexchainClient
      .setAccountInfo(params.pk)
      .then(() => {
        okexchainClient
          .sendPlaceOrderTransaction(
            params.product,
            params.side === Enum.placeOrder.type.buy ? 'BUY' : 'SELL',
            FormatNum.formatNumber2String(params.price),
            FormatNum.formatNumber2String(params.size)
          )
          .then((placeOrderRes) => {
            if (placeOrderRes.result.code) {
              dispatch({
                type: FormActionType.SUBMIT_ORDER_ERROR,
                data: placeOrderRes.result.error,
              });
              errCallback &&
                errCallback({
                  msg: toLocale(`error.code.${placeOrderRes.result.code}`),
                });
            } else {
              dispatch({
                type: FormActionType.SUBMIT_ORDER_SUCCESS,
                data: '',
              });
              callback && callback(placeOrderRes.result);
            }
          })
          .catch((err) => {
            dispatch({
              type: FormActionType.SUBMIT_ORDER_ERROR,
              data: err.message,
            });
            errCallback && errCallback(err);
          });
      })
      .catch((err) => {
        Message.error({ content: err.message, duration: 3 });
        errCallback && errCallback(err);
      });
  };
}

export function disableSubmit() {
  return (dispatch) => {
    dispatch({
      type: FormActionType.DISABLED_SUBMIT,
      data: {},
    });
  };
}
