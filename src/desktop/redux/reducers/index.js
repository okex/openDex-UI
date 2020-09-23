import { combineReducers } from 'redux';
import reducers from '_src/redux/reducers';
import NodeStore from './NodeReducer';
import LocalNodeStore from './LocalNodeReducer';

export default function () {
  return combineReducers({
    ...reducers,
    NodeStore,
    LocalNodeStore: LocalNodeStore(),
  });
}
