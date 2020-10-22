import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import Router from './Router';
import SwapContext from './SwapContext';
import SwapPanel from './SwapPanel';
import PoolPanel from './PoolPanel';
import WatchlistPanel from './WatchlistPanel';
import { toLocale } from '_src/locale/react-locale';
import SwapPushWrapper from '_app/wrapper/SwapPushWrapper';
import './index.less';

const SWAP = '1';
const POOL = '2';
const WATCHLIST = '3';

@SwapPushWrapper
export default class Swap extends React.Component {
  render() {
    const { wsV3 } = this.props;
    return (
      <SwapContext.Provider value={wsV3}>
        <div className="swap-container">
          <Tabs defaultActiveKey={SWAP} prefixCls="swap">
            <TabPane tab={toLocale('Swap')} key={SWAP}>
              <SwapPanel />
            </TabPane>
            <TabPane tab={toLocale('Pool')} key={POOL}>
              <Router route={{ component: PoolPanel }} />
            </TabPane>
            <TabPane tab={toLocale('Watchlist')} key={WATCHLIST}>
              <Router route={{ component: WatchlistPanel }} />
            </TabPane>
          </Tabs>
        </div>
      </SwapContext.Provider>
    );
  }
}
