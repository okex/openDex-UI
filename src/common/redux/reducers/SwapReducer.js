import SwapActionType from '../actionTypes/SwapActionType';
import * as util from '../../pages/swap/util';

const initialState = {
  setting: util.getSetting(),
  account4Swap: {},
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SwapActionType.SETTING:
      return {
        ...state,
        setting: action.data,
      };
    default:
      return {
        ...state,
        ...action.data,
      };
  }
}
