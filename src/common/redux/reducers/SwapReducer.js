import SwapActionType from '../actionTypes/SwapActionType';
import PageURL from '_src/constants/PageURL';

const initialState = {
  hasSetting: PageURL.getCurrent() === PageURL.swapPage,
  setting: {
    slippageTolerance: 0.1,
    transactionDeadline: '',
  },
  baseToken: {
    available:'',
    value:'',
    symbol:'',
  },
  targetToken: {
    available:'',
    value:'',
    symbol:'',
  },
  exchangeInfo: {
    price:'',
    price_impact:'',
    fee:'',
    route:''
  }
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
        ...action.data
      };
  }
}
