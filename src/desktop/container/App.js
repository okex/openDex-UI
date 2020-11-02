import { hot } from 'react-hot-loader/root';
import React from 'react';
import { Router, Route, Switch, Redirect } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import history from '_src/utils/history';
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
    return (
      <Router basename={window.okGlobal.langPath} history={history}>
        <div className="main-container">
          <Switch>
            {routerConfig.map((router, index) => {
              const { path, component: Page } = router;
              return (
                <Route
                  path={path}
                  exact
                  component={() => {
                    return (
                      <React.Fragment>
                        {path === PageURL.spotFullPage ? (
                          ''
                        ) : (
                          <div className="full-head">
                            <FullTradeHead />
                          </div>
                        )}
                        <Page />
                      </React.Fragment>
                    );
                  }}
                  key={index}
                />
              );
            })}
            <Redirect from="/" to={PageURL.swapPage} />
          </Switch>
        </div>
      </Router>
    );
  }
}
export default hot(App);
