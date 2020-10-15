import PoolActionType from '../actionTypes/PoolActionType';
import * as api from '../../pages/swap/util/api';

export function liquidityInfo(liquidityInfo) {
  return (dispatch) => {
    dispatch({
      type: PoolActionType.ALL,
      data: { liquidityInfo },
    });
  };
}
