import { storage } from '_component/okit';
import { settingsAPIs } from '_constants/apiConfig';
import { MAX_LATENCY } from '_constants/Node';
import ActionTypes from '../actionTypes/NodeActionType';

const getRenderRemoteList = () => {
  const nodeList = settingsAPIs.NODE_LIST;
  return nodeList.map((node) => {
    return {
      ...node,
      latency: MAX_LATENCY,
    };
  });
};

const initialState = {
  remoteList: getRenderRemoteList(),
  customList: storage.get('customList') || [],
  currentNode: storage.get('currentNode') || {
    ...settingsAPIs.DEFAULT_NODE,
    latency: MAX_LATENCY,
  },
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
