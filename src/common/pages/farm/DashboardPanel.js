import React from 'react';
import Pagination from '_component/Pagination';
import { getCoinIcon } from './util/coinIcon';
import { toLocale } from '_src/locale/react-locale';
import * as api from './util/api';
import calc from '_src/utils/calc';

export default class DashboardPanel extends React.Component {

  constructor() {
    super();
    this.state = {
      data: [],
      current: 1,
      pageSize: 15,
      total: 0,
    };
  }

  componentDidMount() {
    this.init();
  }

  async init() {

  }

  render() {
    const { sort, data, current, pageSize, total } = this.state;
    return (
      <div className="panel-farm">
        <div className="info-items info-dashboard-items">
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
          <div className="info-item">
            <div className="info-item-title">
              <div className="space-between">
              <div className="left">
                <div className="coin2coin">
                  <img src={getCoinIcon()} />
                  <img src={getCoinIcon()} />
                  <span>
                    FAN/USDK
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
                0.03339484 (10.2512%)
              </div>
              <div className="right">
                0.03339484 (10.2512%)
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
                  <tr>
                    <td>OKT</td>
                    <td>8243.00234512</td>
                    <td>8243.00234512</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="opt-footer">
              <div className="linkbtn">{toLocale('STAKE')}</div>
              <div className="linkbtn">{toLocale('UNSTAKE')}</div>
              <div className="btn">{toLocale('Claim all')}</div>
            </div>
          </div>
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
    );
  }
}
