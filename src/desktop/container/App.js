import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Router, Switch } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import history from '_src/utils/history';
import { crypto } from '@okexchain/javascript-sdk';
import FullTradeHead from '../pages/fullTrade/FullTradeHead';
import routerConfig from './routerConfig';

class App extends React.Component {
  constructor(props) {
    super(props);
    window.OK_GLOBAL.isLogin = util.isLogined();
    window.OK_GLOBAL.senderAddr = util.getMyAddr();
    window.OK_GLOBAL.generalAddr =
      window.OK_GLOBAL.senderAddr &&
      crypto.convertBech32ToHex(window.OK_GLOBAL.senderAddr)[0];
    document.title = toLocale('seoTitle');
  }

  componentDidMount() {
    const theme = localStorage.getItem('theme');
    if (theme === null) {
      localStorage.setItem('theme', 'theme-1');
      document.body.classList.add('theme-1');
    } else {
      document.body.classList.add(theme);
    }
  }

  render() {
    const routes = routerConfig.getRoute({ FullTradeHead });
    return (
      <Router basename={window.okGlobal.langPath} history={history}>
        <div className="main-container">
          <Switch>{routes}</Switch>
        </div>
      </Router>
    );
  }
}
export default hot(App);
