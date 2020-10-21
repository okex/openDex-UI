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
