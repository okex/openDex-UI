import LocalNodeActionType from '../actionTypes/LocalNodeActionType';

const initialState = {
  logs: '',
  okchaind: null,
  isStarted: false,
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case LocalNodeActionType.UPDATE_LOGS:
      return {
        ...state,
        logs: action.data,
      };
    case LocalNodeActionType.UPDATE_OKCHAIND:
      return {
        ...state,
        okchaind: action.data,
      };
    case LocalNodeActionType.UPDATE_IS_STARTED:
      return {
        ...state,
        isStarted: action.data,
      };
    case LocalNodeActionType.UPDATE_SETTING:
      return {
        ...state,
        localNodeSetting: action.data,
      };
    default:
      return state;
  }
}
