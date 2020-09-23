import { combineReducers } from 'redux';
import reducers from '_src/redux/reducers';

export default function () {
  return combineReducers({
    ...reducers
  });
}
