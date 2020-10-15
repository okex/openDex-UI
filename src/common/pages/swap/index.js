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

  changeTab = (key) => {
    const tabsClass = key === WATCHLIST ? 'watchlist' : '';
    this.setState({ tabsClass });
  };

  changeRoute = ({component}) => {
    const key = component === WatchlistPanel ? WATCHLIST : '';
    this.changeTab(key);
  }

  render() {
    const { tabsClass } = this.state;
    return (
      <div className="swap-container">
        <Tabs
          defaultActiveKey={SWAP}
          prefixCls="swap"
          onChange={this.changeTab}
          className={tabsClass}
        >
          <TabPane tab={toLocale('Swap')} key={SWAP}>
            <SwapPanel />
          </TabPane>
          <TabPane tab={toLocale('Pool')} key={POOL}>
            <Router route={{component:PoolPanel}}/>
          </TabPane>
          <TabPane tab={toLocale('Watchlist')} key={WATCHLIST}>
            <Router route={{component:WatchlistPanel}} onChange={this.changeRoute}/>
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
