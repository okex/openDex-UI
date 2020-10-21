import SwapActionType from '../actionTypes/SwapActionType';

export function setting(data) {
  return (dispatch) => {
    dispatch({
      type: SwapActionType.SETTING,
      data,
    });
  };
}

export function hasSetting(data) {
  return (dispatch) => {
    dispatch({
      type: SwapActionType.SETTING_ICON,
      data,
    });
  };
}

export function updateAccount(data) {
  return (dispatch, getState) => {
    if(!Array.isArray(data) || !data.length) return;
    const state = getState().SwapStore;
    const account = { ...state.account };
    data.forEach(d => {
      const currency = d.currency.toLowerCase();
      account[currency] = d;
    });
    dispatch({
      type: SwapActionType.ALL,
      data: { account },
    });
  };
}
