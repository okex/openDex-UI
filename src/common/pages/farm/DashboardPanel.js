import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from '../../utils/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import Tooltip from '../../component/Tooltip';
import * as api from './util/api';
import SimpleBtnDialog from './SimpleBtnDialog';
import classNames from 'classnames';
import Stake from './Stake';
import Claim from './Claim';

export default class DashboardPanel extends React.Component {
  constructor() {
    super();
    this.initial = false;
    this.state = {
      data: [],
      current: 1,
      pageSize: 15,
      total: 0,
      maxApy: null,
      hasFirstPool: false
    };
  }

  async componentDidMount() {
    const data = await this.init({ current: this.state.current });
    let maxApy = {
      data_dis: '0.00%',
    };
    if (!data.length) {
      maxApy = await api.maxApy();
    }
    this.initial = true;
    this.setState({ ...data, maxApy });
    this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    const { data } = this.state;
    this.interval = setInterval(() => {
      console.log('start dashboard');
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
      console.log('stop dashboard');
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  async init({ current }) {
    const { pageSize } = this.state;
    if (!current) current = this.state.current;
    let params = { page: current, per_page: pageSize };
    const { data, param_page, hasFirstPool } = await api.dashboard(params);
    return { data, total: param_page.total, hasFirstPool };
  }

  refreshData = async () => {
    const data = await this.init({});
    this.setState(data);
  };

  getTimerDis = (data) => {
    if (data.active !== 2)
      return (
        <>
          {toLocale('Will finish in')}
          <span className="timer">&nbsp;{data.timeInfo}</span>
        </>
      );
    return (
      <>
        {toLocale('Will start in')}
        <span className="timer">&nbsp;{data.timeInfo}</span>
      </>
    );
  };

  getPanel = () => {
    const { maxApy,hasFirstPool } = this.state;
    if (this.initial && !this.state.total) {
      return hasFirstPool ? <div className="panel-watchlist"><div className="nodata">{toLocale('watchlist noData')}</div></div>: (
        <div className="panel panel-connect">
          <div className="connect-wallet-tip">
            <div>
              {toLocale('Haven’t farmed yet')}
              <span>{maxApy.data_dis}</span>
              {toLocale('APY')}
            </div>
          </div>
          <div className="farm-btn" onClick={this.props.onFarm}>
            {toLocale('Go stake')}
          </div>
        </div>
      );
    }
    return null;
  };

  getConnectPanel = () => {
    return (
      <div className="panel panel-connect">
        <div className="connect-wallet-tip">
          {toLocale('Connect wallet to check your farming')}
        </div>
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="farm-btn">{toLocale('Connect Wallet')}</div>
        </Link>
      </div>
    );
  };

  onChange = async (current) => {
    const data = await this.init({ current });
    this.setState({ ...data, current });
  };

  render() {
    const { data, current, pageSize, total } = this.state;
    const isLogined = util.isLogined();
    if (!isLogined) return this.getConnectPanel();
    return (
      <>
        {!!total ? (
          <div className="panel-farm">
            <div className="info-items info-dashboard-items">
              {data.map((d, index) => (
                <div className="info-item" key={index}>
                  {d.in_whitelist && (
                    <div
                      className={classNames('tag', { active: d.active !== 2 })}
                    ></div>
                  )}
                  <div className="info-item-title">
                    <div className="space-between">
                      <div className="left">
                        <div className="coin2coin">
                          {d.lock_symbol_info.symbols.map(
                            (symbol, symbolIndex) => (
                              <img
                                src={getCoinIcon(symbol)}
                                key={symbolIndex}
                              />
                            )
                          )}
                          <Tooltip placement="right" overlay={d.pool_name}>
                            <span>{d.lock_symbol_info.name}</span>
                          </Tooltip>
                        </div>
                      </div>
                      <div className="right">{this.getTimerDis(d)}</div>
                    </div>
                  </div>
                  <div className="pool-detail-wrap">
                    <div className="space-between pool-detail-label">
                      <div className="left">
                        {toLocale('Total staked LP / Pool ratio')}
                      </div>
                      <div className="right">
                        {toLocale('Total farmed / Farm APY')}
                      </div>
                    </div>
                    <div className="space-between pool-detail">
                      <div className="left">
                        {d.user_staked_dashbord_dis} ({d.pool_ratio_dis_4})
                      </div>
                      <div className="right">
                        {d.total_farmed_dis} ({d.total_apy_4})
                      </div>
                    </div>
                  </div>
                  <div className="pool-claim">
                    <table>
                      <tbody>
                        <tr className="table-head">
                          <td>{toLocale('Token')}</td>
                          <td>{toLocale('Claimed')}</td>
                          <td>{toLocale('Unclaimed')}</td>
                        </tr>
                        {!!d.farmed_details.length &&
                          d.farmed_details.map((detail, index) => (
                            <tr key={index}>
                              <td>{detail.symbol_dis}</td>
                              <td>{detail.claimed_dis}</td>
                              <td>{detail.unclaimed_dis}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="opt-footer">
                    <SimpleBtnDialog
                      component={() =>
                        Stake.getStake({ data: d, onSuccess: this.refreshData })
                      }
                      disabled={d.active === 2}
                    >
                      <div
                        className={classNames('linkbtn', {
                          disabled: d.active === 2,
                        })}
                      >
                        {toLocale('STAKE')}
                      </div>
                    </SimpleBtnDialog>
                    <SimpleBtnDialog
                      component={() =>
                        Stake.getStake({
                          data: d,
                          isStake: false,
                          onSuccess: this.refreshData,
                        })
                      }
                    >
                      <div className="linkbtn">{toLocale('UNSTAKE')}</div>
                    </SimpleBtnDialog>
                    <SimpleBtnDialog
                      component={
                        <Claim data={d} onSuccess={this.refreshData} />
                      }
                    >
                      <div className="farm-btn">{toLocale('Claim all')}</div>
                    </SimpleBtnDialog>
                  </div>
                </div>
              ))}
            </div>
            <div className="pagination-wrap">
              <Pagination
                className="watchlist-pagination"
                total={total}
                pageSize={pageSize}
                current={current}
                onChange={this.onChange}
                hideOnSinglePage={false}
              />
            </div>
          </div>
        ) : (
          this.getPanel()
        )}
      </>
    );
  }
}
