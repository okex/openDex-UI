import { storage } from '_component/okit';
import { NODE_LIST, DEFAULT_NODE } from '_constants/apiConfig';
import { NODE_TYPE } from '_constants/Node';
import ActionTypes from '../actionTypes/NodeActionType';

function getInitCurrentNode() {
  const n = storage.get('currentNode');
  if (!n || n.type === NODE_TYPE.LOCAL) {
    storage.set('currentNode', DEFAULT_NODE);
    return DEFAULT_NODE;
  }
  return n;
}

const initialState = {
  remoteList: NODE_LIST,
  customList: storage.get('customList') || [],
  currentNode: getInitCurrentNode(),
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
    default:
      return state;
  }
}
