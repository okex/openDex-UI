import React from 'react';
import { connect } from 'react-redux';
import Tabs, { TabPane } from 'rc-tabs';
import SwapPanel from './SwapPanel';
import PoolPanel from './PoolPanel';
import WatchlistPanel from './WatchlistPanel';
import { toLocale } from '_src/locale/react-locale';
import './index.less';

function mapStateToProps(state) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class Swap extends React.Component {
  constructor() {
    super();
    this.state = {
      tabsClass: ''
    }
  }

  changeTab = key => {
    const tabsClass = key === '3' ? 'watchlist' : '';
    this.setState({ tabsClass });
  }

  render() {
    const { tabsClass } = this.state;
    return (
      <div className="swap-container">
        <Tabs defaultActiveKey="1" prefixCls="swap" onChange={this.changeTab} className={tabsClass}>
          <TabPane tab={toLocale('Swap')} key="1">
            <SwapPanel />
          </TabPane>
          <TabPane tab={toLocale('Pool')} key="2">
            <PoolPanel />
          </TabPane>
          <TabPane tab={toLocale('Watchlist')} key="3">
            <WatchlistPanel />
          </TabPane>
        </Tabs>
      </div>
    );
  }
}
