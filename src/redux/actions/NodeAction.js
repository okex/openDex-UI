import { storage } from '_component/okit';
import { NODE_TYPE, MAX_LATENCY } from '_constants/Node';
import NodeActionType from '../actionTypes/NodeActionType';
/* eslint-disable */
/**
 * 更新当前节点
 */
export function updateCurrentNode(node) {
  return (dispatch, getState) => {
    let n;
    const { isSync } = getState().LocalNodeStore;
    if (node.type === NODE_TYPE.NONE && isSync) {
      const {
        rest, ws,
      } = getState().LocalNodeStore;
      const localNode = {
        name: 'Local',
        httpUrl: `http://127.0.0.1:${rest}`,
        wsUrl: `ws://127.0.0.1:${ws}/ws/v3?compress=true`,
        latency: MAX_LATENCY,
        id: '00000000',
        type: NODE_TYPE.LOCAL,
      };
      n = localNode;
    } else {
      n = node;
    }
    storage.set('currentNode', n);
    dispatch({
      type: NodeActionType.UPDATE_CURRENT_NODE,
      data: n,
    });
  };
}

export function updateRemoteList(list) {
  return (dispatch) => {
    dispatch({
      type: NodeActionType.UPDATE_REMOTE_LIST,
      data: list,
    })
  }
}

export function updateCustomList(list) {
  return (dispatch) => {
    storage.set('customList', list);
    dispatch({
      type: NodeActionType.UPDATE_CUSTOM_LIST,
      data: list,
    })
  }
}
