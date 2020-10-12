import SwapActionType from '../actionTypes/SwapActionType';
import * as api from '../../pages/swap/api';

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

export function exchange(baseToken,targetToken) {
  return (dispatch) => {
    dispatch({
      type: SwapActionType.ALL,
      data: {baseToken:targetToken,targetToken:baseToken},
    });
  };
}

async function updateSwapInfo(data,key) {
  const {value,symbol} = data[key];
  const target = key === 'baseToken' ? data.targetToken : data.baseToken;
  if(value && symbol && target.symbol) {
    const {buy_amount,price,price_impact,fee,route} = await api.buyInfo({amount_to_sell:`${value}${symbol}`,token_to_buy:target.symbol});
    data.exchangeInfo = {price,price_impact,fee,route};
    target.value = buy_amount;
    if(key !== 'baseToken') {
      const temp = await api.buyInfo({amount_to_sell:`${target.value}${target.symbol}`,token_to_buy:symbol});
      data.exchangeInfo = {price:temp.price,price_impact:temp.price_impact,fee:temp.fee,route:temp.route};
    }
  }
}

export function setBaseToken(baseToken) {
  return async (dispatch,getState) => {
    const data = {...getState().SwapStore,baseToken};
    await updateSwapInfo(data,'baseToken');
    dispatch({
      type: SwapActionType.ALL,
      data,
    });
  };
}

export function setTargetToken(targetToken) {
  return async (dispatch,getState) => {
    const data = {...getState().SwapStore,targetToken};
    await updateSwapInfo(data,'targetToken');
    dispatch({
      type: SwapActionType.ALL,
      data,
    });
  };
}
