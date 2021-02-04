import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Router, Switch, Redirect } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import util from '../utils/util';
import history from '../utils/history';
import FullTradeHead from '../pages/fullTrade/FullTradeHead';
import routerConfig from './routerConfig';

class App extends React.Component {
  constructor(props) {
    super(props);
    window.OK_GLOBAL.isLogin = util.isLogined();
    window.OK_GLOBAL.senderAddr = util.getMyAddr();
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
    const routes = routerConfig.getRoute({FullTradeHead});
    return (
      <Router basename={window.okGlobal.langPath} history={history}>
        <div className="main-container">
          <Switch>
            {routes}
            <Redirect from="/" to={PageURL.spotFullPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default hot(App);
