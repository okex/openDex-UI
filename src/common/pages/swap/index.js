import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import Router from '../../component/Router';
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
  constructor() {
    super();
    this.state = {
      activekey: SWAP,
    };
    this.router = React.createRef();
    this.swap = null;
    this.watchlist = null;
  }

  onTrade = ({ baseSymbol, targetSymbol }) => {
    this.onChange(SWAP,() => {
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

  onChange = (activekey, callback) => {
    this.setState({ activekey },() => {
      callback && callback();
    });
  };

  componentDidMount() {
    this.preSeoTitle = document.title;
    document.title = toLocale('seoSwapTitle');
  }

  componentWillUnmount() {
    document.title = this.preSeoTitle;
  }

  render() {
    const { wsV3 } = this.props;
    const { activekey } = this.state;
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
              <SwapPanel getRef={(instance) => (this.swap = instance)} />
            </TabPane>
            <TabPane tab={toLocale('Pool')} key={POOL}>
              <Router route={{ component: PoolPanel }} ref={this.router} />
            </TabPane>
            <TabPane tab={toLocale('Watchlist')} key={WATCHLIST}>
              <WatchlistPanel
                onTrade={this.onTrade}
                onAddLiquidity={this.onAddLiquidity}
                getRef={(instance) => (this.watchlist = instance)}
              />
            </TabPane>
          </Tabs>
        </div>
      </SwapContext.Provider>
    );
  }
}
