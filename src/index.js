import React from 'react';
// import '@babel/polyfill';
import { Provider } from 'react-redux';
import { render } from 'react-dom';
import { LocaleProvider } from '_src/locale/react-locale';
// import { storage } from '_component/okit';
import Cookies from 'js-cookie';

import configureStore from './redux/store';
import App from './container/App';
import './index.less';
import './assets/fonts/iconfont.css';
import './assets/fonts/iconfont';
import util from './utils/util';


window.OK_GLOBAL = {
  webTypes: { OKEx: 'OKEx', DEX: 'DEX' }, // 站点列表
  webType: 'DEX', // 站点标示
  ws: undefined, // websocket实例
  tradeType: undefined, // 交易模式(全屏/非全屏)
  isMarginType: false, // 杠杠模式(是否开启杠杠模式 false不开启，true开启)
  productObj: undefined, // 所有币对配置
  productConfig: {
    // max_price_digit: '',
    // max_size_digit: '',
    min_trade_size: ''
  }, // 当前币对配置
  isLogin: undefined,
};


const store = configureStore();
import('./locale').then((localeMessage) => {
  const language = util.getSupportLocale(Cookies.get('locale') || 'en_US');
  const localProviderProps = {
    localeData: localeMessage.default(language)
  };

  render(
    <LocaleProvider {...localProviderProps} >
      <Provider store={store}>
        <App />
      </Provider>
    </LocaleProvider>,
    document.querySelector('#app')
  );
});

