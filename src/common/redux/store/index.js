import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';

import Reducer from '_app/redux/reducers';

export default function configureStore() {
  let store = null;
  if (process.env.NODE_ENV === 'production') {
    store = createStore(Reducer(), compose(applyMiddleware(thunk)));
  } else {
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    store = createStore(Reducer(), composeEnhancers(applyMiddleware(thunk)));
  }
  return store;
}