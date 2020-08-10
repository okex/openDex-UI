import { combineReducers } from 'redux';
import Common from './CommonReducer';
import Spot from './SpotReducer';
import SpotTrade from './SpotTradeReducer';
import FormStore from './FormReducer';
import OrderStore from './OrderReducer';
import WalletStore from './WalletReducer';
import NodeStore from './NodeReducer';
import LocalNodeStore from './LocalNodeReducer';

const rootReducer = combineReducers({
  Common,
  Spot,
  SpotTrade,
  FormStore,
  OrderStore,
  WalletStore,
  NodeStore,
  LocalNodeStore,
});
export default rootReducer;
