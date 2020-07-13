import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import Load from '_component/Loadable';
// import DexHeader from '_component/DexHeader';
// import DexFooter from '_component/DexFooter';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import util from '../utils/util';
import history from '../utils/history';
import FullTradeHead from '../pages/fullTrade/FullTradeHead';

class App extends React.Component {
  constructor(props) {
    super(props);
    window.OK_GLOBAL.isLogin = util.isLogined();
    window.OK_GLOBAL.senderAddr = util.getMyAddr();
    document.title = toLocale('seoTitle');
  }
  componentDidMount() {
    // 初始化 主题
    const theme = localStorage.getItem('theme');
    if (theme === null) {
      localStorage.setItem('theme', 'theme-1');
      document.body.classList.add('theme-1');
      // document.body.setAttribute('class', 'theme-1');
    } else {
      document.body.classList.add(theme);
      // document.body.setAttribute('class', theme);
    }
  }
  render() {
    return (
      <Router basename={window.okGlobal.langPath} history={history}>
        <React.Fragment>
          {/* <DexHeader /> */}
          <div className="full-head">
            <FullTradeHead />
          </div>
          <div className="main-container">
            <Switch>
              <Route
                path={PageURL.homePage}
                exact
                component={Load(() => {
                return import('../pages/home/index');
              })}
              />
              <Route
                path={PageURL.spotFullPage}
                component={Load(() => {
                  window.OK_GLOBAL.isMarginType = false;
                  return import('../pages/fullTrade/FullTrade');
                })}
              />
              <Route
                path={PageURL.spotOpenPage}
                component={Load(() => {
                window.OK_GLOBAL.isMarginType = false;
                return import('../pages/orders/OpenList');
              })}
              />
              <Route
                path={PageURL.spotHistoryPage}
                component={Load(() => {
                window.OK_GLOBAL.isMarginType = false;
                return import('../pages/orders/HistoryList');
              })}
              />
              <Route
                path={PageURL.spotDealsPage}
                component={Load(() => {
                window.OK_GLOBAL.isMarginType = false;
                return import('../pages/orders/DealsList');
              })}
              />
              <Route
                path={PageURL.spotDefaultPage}
                component={Load(() => { return import('../pages/fullTrade/FullTrade'); }, false)}
              />
              <Route
                path={PageURL.walletCreate}
                component={Load(() => {
                return import('../pages/wallet/CreateWallet');
              })}
              />
              <Route
                path={PageURL.walletImport}
                component={Load(() => {
                return import('../pages/wallet/ImportWallet');
              })}
              />
              <Route
                path={PageURL.walletAssets}
                component={Load(() => {
                return import('../pages/wallet/Assets');
              })}
              />
              <Route
                path={PageURL.walletTransactions}
                component={Load(() => {
                return import('../pages/wallet/Assets');
              })}
              />
              <Route
                path={PageURL.nodeSettingPage}
                component={Load(() => {
                  return import('../pages/nodeSetting');
                })}
              />
              <Route
                path={PageURL.registerPage}
                component={Load(() => {
                  return import('../pages/register');
                })}
              />
              <Route
                path={PageURL.issueTokenPage}
                component={Load(() => {
                  return import('../pages/issueToken');
                })}
              />
              <Route
                path={PageURL.listTokenpairPage}
                component={Load(() => {
                  return import('../pages/listTokenpair');
                })}
              />
              <Route
                path={PageURL.dashboardPage}
                component={Load(() => {
                  return import('../pages/dashboard');
                })}
              />
              <Route
                path={PageURL.issueDetailPage}
                component={Load(() => {
                  return import('../pages/issueDetail');
                })}
              />
              <Route
                path={PageURL.tokenpairDetailPage}
                component={Load(() => {
                  return import('../pages/tokenpairDetail');
                })}
              />
              <Redirect
                from={PageURL.wallet}
                to={PageURL.walletAssets}
              />
              <Redirect
                from="/"
                to={PageURL.spotFullPage}
              />
            </Switch>
          </div>
          {/* <DexFooter /> */}
        </React.Fragment>
      </Router>
    );
  }
}
export default hot(App);
