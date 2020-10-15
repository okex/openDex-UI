import SwapActionType from '../actionTypes/SwapActionType';
import PageURL from '_src/constants/PageURL';
import * as util from '../../pages/swap/util';

const initialState = {
  hasSetting: PageURL.getCurrent() === PageURL.swapPage,
  setting: util.getSetting(),
  baseToken: {
    available: '',
    value: '',
    symbol: '',
  },
  targetToken: {
    available: '',
    value: '',
    symbol: '',
  },
  exchangeInfo: {
    price: '',
    price_impact: '',
    fee: '',
    route: '',
    isReverse: false,
  },
};
export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SwapActionType.SETTING:
      return {
        ...state,
        setting: action.data,
      };
    case SwapActionType.SETTING_ICON:
      return {
        ...state,
        hasSetting: action.data,
      };
    default:
      return {
        ...state,
        ...action.data,
      };
  }
}
