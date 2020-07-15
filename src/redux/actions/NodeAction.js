import { storage } from '_component/okit';
import NodeActionType from '../actionTypes/NodeActionType';
/* eslint-disable */
/**
 * 更新当前节点
 */
export function updateCurrentNode(node) {
  return (dispatch) => {
    storage.set('currentNode', node);
    dispatch({
      type: NodeActionType.UPDATE_CURRENT_NODE,
      data: node,
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
