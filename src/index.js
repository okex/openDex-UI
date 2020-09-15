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

//  x
// 是否开放交易所，来自javaWeb工程注入
// window.isBroker = true;
// window.brokerObj = {
//   logo: ''
// };

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
// const language = 'zh_CN';
// 多语言配置
const language = util.getSupportLocale(Cookies.get('locale') || 'en_US');
const languageType = 2; // 1远程，2本地
let localProviderProps = {};


const electronUtils = window.require('electron').remote.require('./src/utils');
const { emitter } = electronUtils;

emitter.on('downloadOkchainStart', () => {
  console.log('downloadOkchainStart');
});

emitter.on('downloadOkchainProgress', (res) => {
  console.log('downloadOkchainProgress', res);
});

function checkLocalNode() {
  new Promise(resolve => {
    electronUtils.shell.exec('ps aux | grep -v grep | grep okchaind',function(err, stdout, sdterr){
      if(err || !stdout) resolve(false);
      else resolve(true);
    });
  });
}


const renderDom = async () => {
  const result = await checkLocalNode();
  window.localStorage.setItem('isStarted',!!result);
  const store = configureStore();
  render(
    <LocaleProvider {...localProviderProps} >
      <Provider store={store}>
        <App />
      </Provider>
    </LocaleProvider>,
    document.querySelector('#app')
  );
};

if (languageType === 2) {
  import('./locale').then((localeMessage) => {
    localProviderProps = {
      localeData: localeMessage.default(language)
    };
    renderDom();
  });
} else {
  const fetchConfig = {
    site: 'okex',
    project: 'spot',
    locale: language,
    needParts: ['transfer']
  };
  localProviderProps = { fetchConfig };
  renderDom();
}
