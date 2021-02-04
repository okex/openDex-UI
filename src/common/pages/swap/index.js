import React from 'react';
import { withRouter } from 'react-router-dom';
import Tabs, { TabPane } from 'rc-tabs';
import SwapContext from './SwapContext';
import PageURL from '_constants/PageURL';
import { toLocale } from '_src/locale/react-locale';
import SwapPushWrapper from '_app/wrapper/SwapPushWrapper';
import './index.less';

const SWAP = '1';
const POOL = '2';
const WATCHLIST = '3';

@withRouter
@SwapPushWrapper
export default class Swap extends React.Component {

  onTrade = ({ baseSymbol, targetSymbol }) => {
    this.onChange(SWAP, () => {
      this.swap &&
        this.swap.init({
          baseToken: {
            available: '',
            value: '',
            symbol: baseSymbol,
          },
          targetToken: {
            available: '',
            value: '',
            symbol: targetSymbol,
          },
        });
    });
  };

  onAddLiquidity = (route) => {
    this.onChange(POOL);
    const { current: router } = this.router;
    router.push(route, true);
  };

  onChange = (activekey) => {
    let route = PageURL.swapPage;
    if (activekey === POOL) {
      route = PageURL.liquidityPage;
    } else if (activekey === WATCHLIST) {
      route = PageURL.watchlistPage;
    }
    this.props.history.push(route);
  };

  componentDidMount() {
    this.preSeoTitle = document.title;
    document.title = toLocale('seoSwapTitle');
  }

  componentWillUnmount() {
    document.title = this.preSeoTitle;
  }

  render() {
    const { wsV3,activekey=SWAP,children } = this.props;
    return (
      <SwapContext.Provider value={wsV3}>
        <div className="swap-container">
          <Tabs
            activeKey={activekey}
            prefixCls="swap"
            onChange={this.onChange}
            destroyInactiveTabPane
          >
            <TabPane tab={toLocale('Swap')} key={SWAP}>
              {children}
            </TabPane>
            <TabPane tab={toLocale('Pool')} key={POOL}>
              {children}
            </TabPane>
            <TabPane tab={toLocale('Watchlist')} key={WATCHLIST}>
              {children}
            </TabPane>
          </Tabs>
        </div>
      </SwapContext.Provider>
    );
  }
}
