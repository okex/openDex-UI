import React from 'react';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { LocaleProvider } from '_src/locale/react-locale';
import Cookies from 'js-cookie';

import configureStore from './redux/store';
import App from './container/App';
import './index.less';
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont';
import util from './utils/util';

window.OK_GLOBAL = {
  webTypes: { OKEx: 'OKEx', DEX: 'DEX' },
  webType: 'DEX',
  ws: undefined,
  tradeType: undefined,
  isMarginType: false,
  productObj: undefined,
  productConfig: {
    min_trade_size: '',
  },
  isLogin: undefined,
};


const store = configureStore();
import('./locale').then((localeMessage) => {
  const language = util.getSupportLocale(Cookies.get('locale') || 'en_US');
  const localProviderProps = {
    localeData: localeMessage.default(language)
  };

  render(
    <LocaleProvider {...localProviderProps}>
      <Provider store={store}>
        <App />
      </Provider>
    </LocaleProvider>,
    document.querySelector('#app')
  );
});

