import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from './util/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import * as api from './util/api';
import calc from '_src/utils/calc';

export default class DashboardPanel extends React.Component {

  constructor() {
    super();
    this.initial = false;
    this.state = {
      data: [],
      current: 1,
      pageSize: 15,
      total: 0,
    };
  }

  async componentDidMount() {
    const data = await this.init({ current: this.state.current });
    this.initial = true;
    this.setState(data);
  }

  async init({current}) {
    const { pageSize } = this.state;
    if (!current) current = this.state.current;
    let params = { page: current, per_page: pageSize };
    const { data, param_page } = await api.dashboard(params);
    return { data, total: param_page.total };
  }

  getPanel = () => {
    if(this.initial && !this.state.total) {
      return (
        <div className="panel panel-connect">
          <div className="connect-wallet-tip"><div>{toLocale('Haven’t farmed yet')}<span>128.23%</span>{toLocale('APY')}</div></div>
          <div className="btn">{toLocale('Go stake')}</div>
        </div>
      );
    }
    return null;
  }

  getConnectPanel = () => {
    return (
      <div className="panel panel-connect">
        <div className="connect-wallet-tip">{toLocale('Connect wallet to check your farming')}</div>
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="btn">{toLocale('Connect Wallet')}</div>
        </Link>
      </div>
    )
  }

  onChange = async (current) => {
    const data = await this.init({ current });
    this.setState({ ...data, current });
  };

  stake = (d) => {

  }

  unstake = (d) => {
    
  }

  claim = (d) => {
    
  }

  render() {
    const { data, current, pageSize, total } = this.state;
    const isLogined = util.isLogined();
    if(!isLogined) return this.getConnectPanel();
    return (
      <>
      {!!total ? 
        <div className="panel-farm">
          <div className="info-items info-dashboard-items">
            {data.map((d,index) => (
              <div className="info-item" key={index}>
                <div className="info-item-title">
                  <div className="space-between">
                  <div className="left">
                    <div className="coin2coin">
                      <img src={getCoinIcon(d.lock_symbol)} />
                      <img src={getCoinIcon(d.yield_symbol)} />
                      <span>
                        {d.lock_symbol_dis}/{d.yield_symbol_dis}
                      </span>
                    </div>
                  </div>
                  <div className="right">
                  {toLocale('Will start in')}&nbsp;<span className="timer">01{toLocale('d')} 08{toLocale('h')} 36{toLocale('m')} 52{toLocale('s')}</span>
                  </div>
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
                    {d.total_staked_dis} ({d.pool_ratio_dis})
                  </div>
                  <div className="right">
                    {d.total_farmed} ({d.total_apy})
                  </div>
                </div>
                </div>
                {d.farmed_details.length && 
                <div className="pool-claim">
                  <table>
                    <tbody>
                      <tr className="table-head">
                        <td>{toLocale('Token')}</td>
                        <td>{toLocale('Claimed')}</td>
                        <td>{toLocale('Unclaimed')}</td>
                      </tr>
                      {d.farmed_details.map((detail,index) => (
                        <tr key={index}>
                          <td>{detail.symbol_dis}</td>
                          <td>{detail.claimed_dis}</td>
                          <td>{detail.unclaimed_dis}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                }
                <div className="opt-footer">
                  <div className="linkbtn" onClick={() => this.stake(d)}>{toLocale('STAKE')}</div>
                  <div className="linkbtn" onClick={() => this.unstake(d)}>{toLocale('UNSTAKE')}</div>
                  <div className="btn" onClick={() => this.claim(d)}>{toLocale('Claim all')}</div>
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
        :
        this.getPanel()
      }
      </>
    );
  }
}
