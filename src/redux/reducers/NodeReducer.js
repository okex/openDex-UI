import { storage } from '_component/okit';
import { NODE_LIST, DEFAULT_NODE } from '_constants/apiConfig';
import { NODE_TYPE } from '_constants/Node';
import ActionTypes from '../actionTypes/NodeActionType';

const electronUtils = window.require('electron').remote.require('./src/utils');

function getInitCurrentNode(isStarted) {
  const n = storage.get('currentNode');
  if (!n || (n.type === NODE_TYPE.LOCAL && !isStarted)) {
    // !isStarted 过滤存储为 LocalNode 情况
    storage.set('currentNode', DEFAULT_NODE);
    return DEFAULT_NODE;
  }
  return n;
}

const initialState = {
  remoteList: NODE_LIST,
  customList: storage.get('customList') || [],
  currentNode: getInitCurrentNode(!!electronUtils.localNodeServerClient.get()),
  breakTime: 0, // unit:s
  tempBreakTime: 0, // unit:s
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CURRENT_NODE:
      return {
        ...state,
        currentNode: action.data,
      };
    case ActionTypes.UPDATE_REMOTE_LIST:
      return {
        ...state,
        remoteList: action.data,
      };
    case ActionTypes.UPDATE_CUSTOM_LIST:
      return {
        ...state,
        customList: action.data,
      };
    case ActionTypes.UPDATE_BREAK_TIME:
      return {
        ...state,
        breakTime: action.data,
      };
    case ActionTypes.UPDATE_TEMP_BREAK_TIME:
      return {
        ...state,
        tempBreakTime: action.data,
      };
    default:
      return state;
  }
}
