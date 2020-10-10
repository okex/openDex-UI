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
        <div className="panel-swap-setting">
          <div className="swap-setting-header">{toLocale('Advanced setting')}</div>
          <div className="swap-setting-content">
            <div className="space-between">
              <div className="left">{toLocale('Set slippage tolerance')}</div>
              <div className="right"><i className="help" /></div>
            </div>
            <div className="space-between check-btns">
              <div className="left">
                <div className="check-btn-wrap">
                  <div className="check-btn-item">0.1%</div>
                  <div className="check-btn-item active">0.5%</div>
                  <div className="check-btn-item">1%</div>
                </div>
              </div>
              <div className="right">
                <div className="check-btn-input">
                  <div className="input">
                    <input type="text"/>
                  </div>
                  <i>%</i>
                </div>
              </div>
            </div>
            <div className="error-tip">*{toLocale('Your transaction may fail')}</div>
            <div className="space-between deadline">
              <div className="left">{toLocale('Transaction deadline')}</div>
              <div className="right"><i className="help" /></div>
            </div>
            <div className="deadline-input">
              <div className="input">
                <input type="text"/>
              </div>
              <i>{toLocale('Minutes')}</i>
            </div>
              <div className="setting-btn">{toLocale('Confirm')}</div>
          </div>
        </div>
      </div>
    );
  }
}
