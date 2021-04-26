import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import classNames from 'classnames';
import { getCoinIcon } from '../../utils/coinIcon';
import Tooltip from '../../component/Tooltip';

import WatchlistPanel from './WatchlistPanel';
import SimpleBtnDialog from './SimpleBtnDialog';
import Stake from './Stake';
import { Dialog } from '../../component/Dialog';
import * as api from './util/api';

@withRouter
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
      const { data } = this.state;
      api.process(data);
      this.setState({});
    }, 1000);
    this.refreshInterval = setInterval(() => {
      this.refreshData();
    }, 3000);
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
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

  renderHelp = (title, desc) => (
    <div className="stake-help-info">
      <div className="help-title">{title}</div>
      <div className="help-desc">{desc}</div>
    </div>
  );

  showHelp = (title, desc) => {
    Dialog.show({
      width: '440px',
      children: this.renderHelp(title, desc),
    });
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
          <i
            className="help"
            onClick={() =>
              this.showHelp(
                toLocale('White listed help'),
                toLocale('White listed help desc')
              )
            }
          />
        </div>
        <div className="info-items">
          {data.map((d, index) => (
            <div className="info-item" key={index}>
              <div className={classNames('tag', 'active')} />
              <div className="coin2coin">
                {d.lock_symbol_info.symbols.map((symbol, symbolIndex) => (
                  <img src={getCoinIcon(symbol)} key={symbolIndex} />
                ))}
                <Tooltip placement="right" overlay={d.pool_name}>
                  <span>{d.lock_symbol_info.name}</span>
                </Tooltip>
              </div>
              <div className="rate">{d.total_apy}</div>
              <div className="rate-tip">
                {d.farm_apy.length > 1
                  ? d.farm_apy_dis
                  : toLocale('Farm APY') +
                    (d.farm_apy[0] ? `（${d.farm_apy[0].denom_dis}）` : '')}
              </div>
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
                  Stake.getStake({
                    data: d,
                    onSuccess: () =>
                      this.props.history.push(PageURL.myfarmingsPage),
                  })
                }
              >
                <div className={classNames('farm-btn')}>
                  {toLocale('STAKE')}
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
            <div className="left">
              {toLocale('Other pools')}
              <i
                className="help"
                onClick={() =>
                  this.showHelp(
                    toLocale('Other pools help'),
                    toLocale('Other pools help desc')
                  )
                }
              />
            </div>
          </div>
        </div>
        <WatchlistPanel />
      </div>
    );
  }
}
