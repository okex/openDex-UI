import SwapActionType from '../actionTypes/SwapActionType';
import util from '_src/utils/util';

export function setting(data) {
  return (dispatch) => {
    dispatch({
      type: SwapActionType.SETTING,
      data,
    });
  };
}

export function updateAccount(data) {
  return (dispatch, getState) => {
    if (!Array.isArray(data) || !data.length) return;
    const state = getState().SwapStore;
    const account4Swap = { ...state.account4Swap };
    data.forEach((d) => {
      const symbol = d.symbol.toLowerCase();
      account4Swap[symbol] = d;
    });
    dispatch({
      type: SwapActionType.ALL,
      data: { account4Swap },
    });
  };
}
