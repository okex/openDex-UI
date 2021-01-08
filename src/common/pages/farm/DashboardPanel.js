import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from './util/coinIcon';
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
  }

  stopTimer() {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
      console.log('stop dashboard');
    }
  }

  async init({ current }) {
    const { pageSize } = this.state;
    if (!current) current = this.state.current;
    let params = { page: current, per_page: pageSize };
    const { data, param_page } = await api.dashboard(params);
    return { data, total: param_page.total };
  }

  getTimerDis = (data) => {
    if (data.active === 1)
      return (
        <>
          {toLocale('Will start in')}&nbsp;
          <span className="timer">{data.timeInfo}</span>
        </>
      );
    return (
      <>
        {toLocale('Will finish in')}&nbsp;
        <span className="timer">{data.timeInfo}</span>
      </>
    );
  };

  getPanel = () => {
    const { maxApy } = this.state;
    if (this.initial && !this.state.total) {
      return (
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
                      className={classNames('tag', { active: d.active === 1 })}
                    ></div>
                  )}
                  <div className="info-item-title">
                    <div className="space-between">
                      <div className="left">
                        <div className="coin2coin">
                          <img src={getCoinIcon(d.lock_symbol)} />
                          <img src={getCoinIcon(d.yield_symbol)} />
                          <Tooltip placement="right" overlay={d.pool_name_dis}>
                            <span>
                              {d.lock_symbol_dis}/{d.yield_symbol_dis}
                            </span>
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
                        {d.total_staked_dis} ({d.pool_ratio_dis_4})
                      </div>
                      <div className="right">
                        {d.total_farmed} ({d.total_apy_4})
                      </div>
                    </div>
                  </div>
                  {d.farmed_details.length && (
                    <div className="pool-claim">
                      <table>
                        <tbody>
                          <tr className="table-head">
                            <td>{toLocale('Token')}</td>
                            <td>{toLocale('Claimed')}</td>
                            <td>{toLocale('Unclaimed')}</td>
                          </tr>
                          {d.farmed_details.map((detail, index) => (
                            <tr key={index}>
                              <td>{detail.symbol_dis}</td>
                              <td>{detail.claimed_dis}</td>
                              <td>{detail.unclaimed_dis}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                  <div className="opt-footer">
                    <SimpleBtnDialog
                      component={() => Stake.getStake(d)}
                      disabled={d.active !== 1}
                    >
                      <div
                        className={classNames('linkbtn', {
                          disabled: d.active !== 1,
                        })}
                      >
                        {toLocale('STAKE')}
                      </div>
                    </SimpleBtnDialog>
                    <SimpleBtnDialog component={() => Stake.getStake(d, false)}>
                      <div className="linkbtn">{toLocale('UNSTAKE')}</div>
                    </SimpleBtnDialog>
                    <SimpleBtnDialog component={<Claim data={d} />}>
                      <div className="farm-btn">{toLocale('Claim all')}</div>
                    </SimpleBtnDialog>
                  </div>
                </div>
              ))}
            </div>
            {total > pageSize && (
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
            )}
          </div>
        ) : (
          this.getPanel()
        )}
      </>
    );
  }
}
