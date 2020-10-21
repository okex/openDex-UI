import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import Router from './Router';
import SwapPanel from './SwapPanel';
import PoolPanel from './PoolPanel';
import WatchlistPanel from './WatchlistPanel';
import { toLocale } from '_src/locale/react-locale';
import './index.less';

const SWAP = '1';
const POOL = '2';
const WATCHLIST = '3';
export default class Swap extends React.Component {
  constructor() {
    super();
    this.state = {
      tabsClass: '',
    };
  }

  render() {
    return (
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
    );
  }
}
