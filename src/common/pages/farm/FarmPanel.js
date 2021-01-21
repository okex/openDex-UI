import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getCoinIcon } from '../../utils/coinIcon';
import { getLangURL } from '_src/utils/navigation';
import Tooltip from '../../component/Tooltip';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import WatchlistPanel from './WatchlistPanel';
import SimpleBtnDialog from './SimpleBtnDialog';
import classNames from 'classnames';
import Stake from './Stake';
import { Dialog } from '../../component/Dialog';
import * as api from './util/api';

export default class FarmPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      show: false,
    };
  }

  componentDidMount() {
    this.init();
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.interval = setInterval(() => {
      console.log('start farm');
      const { data } = this.state;
      api.process(data);
      this.setState({});
    }, 1000);
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 5000);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('stop farm');
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  async init() {
    const { data = [] } = await api.whitelist();
    this.setState({ data });
  }

  refreshData = () => {
    this.init();
  };

  renderHelp = () => {
    return (
      <div className="stake-help-info">
        <div className="help-title">{toLocale('White listed help')}</div>
        <div className="help-desc">{toLocale('White listed help desc')}</div>
      </div>
    );
  };

  showHelp = () => {
    Dialog.show({
      width: '440px',
      children: this.renderHelp(),
    });
  };

  getTimerDis = (data) => {
    if (data.active === 0) return data.timeInfo;
    if (data.active === 1) return toLocale('Finish in', {time: data.timeInfo});
    if (data.active === 2) return toLocale('Start in', {time: data.timeInfo});
    return null;
  };

  render() {
    const isLogined = util.isLogined();
    const { data } = this.state;
    if (!data) return null;
    return (
      <div className="panel-farm">
        {!isLogined && (
          <div className="space-between connect-wallet">
            <div className="left">
              <div className="connect-wallet-tip">
                {toLocale('You haven’t connected a wallet.')}
              </div>
            </div>
            <div className="right">
              <Link to={getLangURL(PageURL.walletCreate)}>
                <div className="farm-btn">{toLocale('Connect Wallet')}</div>
              </Link>
            </div>
          </div>
        )}
        <div className="title-wrap">
          {toLocale('White listed')}
          <i className="help" onClick={this.showHelp} />
        </div>
        <div className="info-items">
          {data.map((d, index) => (
            <div className="info-item" key={index}>
              <div
                className={classNames('tag', { active: d.active !== 2 })}
              ></div>
              <div className="coin2coin">
                {d.lock_symbol_info.symbols.map((symbol, symbolIndex) => (
                  <img src={getCoinIcon(symbol)} key={symbolIndex} />
                ))}
                <Tooltip placement="right" overlay={d.pool_name}>
                  <span>{d.lock_symbol_info.name}</span>
                </Tooltip>
              </div>
              <div className="rate">{d.total_apy}</div>
              <div className="rate-tip">{d.farm_apy_dis}</div>
              <div className="info-detail">
                {toLocale('Total staked：')}
                {d.total_staked_dis}
              </div>
              <div className="info-detail">
                {toLocale('Pool rate：')}
                {d.pool_rate_dis}/{toLocale('1Day')}
              </div>
              <SimpleBtnDialog
                component={() =>
                  Stake.getStake({ data: d, onSuccess: this.refreshData })
                }
                disabled={d.active === 2}
              >
                <div
                  className={classNames('farm-btn', {
                    disabled: d.active === 2,
                  })}
                >
                  {toLocale('STAKE')}
                  {!d.poolEmpty && (
                    <span className="timer">&nbsp;{this.getTimerDis(d)}</span>
                  )}
                </div>
              </SimpleBtnDialog>
            </div>
          ))}
          {!data.length && (
            <div className="nodata">{toLocale('watchlist noData')}</div>
          )}
        </div>
        <div className="title-wrap">
          <div className="space-between">
            <div className="left">{toLocale('Other pools')}</div>
          </div>
        </div>
        <WatchlistPanel />
      </div>
    );
  }
}
