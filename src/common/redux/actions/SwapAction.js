import SwapActionType from '../actionTypes/SwapActionType';
import * as api from '../../pages/swap/util/api';

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

export function exchange(baseToken, targetToken) {
  return async (dispatch, getState) => {
    const data = {
      ...getState().SwapStore,
      baseToken: targetToken,
      targetToken: baseToken,
    };
    data.targetToken.value = '';
    await updateSwapInfo(data, 'baseToken');
    dispatch({
      type: SwapActionType.ALL,
      data,
    });
  };
}

async function updateSwapInfo(data, key) {
  const { value, symbol } = data[key];
  const target = key === 'baseToken' ? data.targetToken : data.baseToken;
  if (value && symbol && target.symbol) {
    const { buy_amount, price, price_impact, fee, route } = await api.buyInfo({
      amount_to_sell: `${value}${symbol}`,
      token_to_buy: target.symbol,
    });
    data.exchangeInfo = { price, price_impact, fee, route };
    target.value = buy_amount;
  } else {
    target.value = '';
  }
}

export function setBaseToken(baseToken) {
  return async (dispatch, getState) => {
    const data = { ...getState().SwapStore, baseToken };
    await updateSwapInfo(data, 'baseToken');
    dispatch({
      type: SwapActionType.ALL,
      data,
    });
  };
}

export function setTargetToken(targetToken) {
  return async (dispatch, getState) => {
    const data = { ...getState().SwapStore, targetToken };
    await updateSwapInfo(data, 'baseToken');
    dispatch({
      type: SwapActionType.ALL,
      data,
    });
  };
}

export function revertPrice() {
  return (dispatch, getState) => {
    const { exchangeInfo } = getState().SwapStore;
    exchangeInfo.isReverse = !exchangeInfo.isReverse;
    dispatch({
      type: SwapActionType.ALL,
      data: { exchangeInfo: { ...exchangeInfo } },
    });
  };
}
