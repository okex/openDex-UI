import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getCoinIcon } from './util/coinIcon';
import { getLangURL } from '_src/utils/navigation';
import Tooltip from '../../component/Tooltip';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import WatchlistPanel from './WatchlistPanel';
import Confirm from '../../component/Confirm';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}

@connect(mapStateToProps)
export default class FarmPanel extends React.Component {

  componentDidMount() {
    this.init();
  }

  async init() {
  }

  getBtn() {
    const { baseToken, targetToken } = this.state;
    let btn;
    if (!util.isLogined()) {
      btn = (
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="btn">{toLocale('Connect Wallet')}</div>
        </Link>
      );
    } else if (!baseToken.symbol || !targetToken.symbol) {
      btn = <div className="btn disabled">{toLocale('Invalid Pair')}</div>;
    } else if (!Number(baseToken.value) || !Number(targetToken.value)) {
      btn = <div className="btn disabled">{toLocale('Input an amount')}</div>;
    } else {
      btn = (
        <Confirm
          onClick={this.confirm}
          loadingTxt={toLocale('pending transactions')}
          successTxt={toLocale('transaction confirmed')}
        >
          <div className="btn">{toLocale('Confirm')}</div>
        </Confirm>
      );
    }
    return <div className="btn-wrap">{btn}</div>;
  }

  confirm = () => {
  };

  render() {
    const isLogined = util.isLogined();
    return (
      <div className="panel-farm">
          {!isLogined && 
          <div className="space-between connect-wallet">
            <div className="left">
              <div className="connect-wallet-tip">{toLocale('You haven’t connected a wallet.')}</div>
            </div>
            <div className="right">
              <Link to={getLangURL(PageURL.walletCreate)}>
                <div className="btn">{toLocale('Connect Wallet')}</div>
              </Link>
            </div>
          </div>
          }
          <div className="title-wrap">
            {toLocale('White listed')}
            <Tooltip
              placement="right"
              overlay={toLocale('Minimum received help')}
            >
              <i className="help" />
            </Tooltip>
          </div>
          <div className="info-items">
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}&nbsp;<span className="timer">01{toLocale('d')} 08{toLocale('h')} 36{toLocale('m')} 52{toLocale('s')}</span></div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn disabled"><span className="timer">01{toLocale('d')} 08{toLocale('h')} 36{toLocale('m')} 52{toLocale('s')}</span></div>
            </div>
            <div className="info-item">
              <div className="tag active"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn disabled">{toLocale('STAKE')}</div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}</div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}</div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}</div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}</div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}</div>
            </div>
            <div className="info-item">
              <div className="tag"></div>
              <div className="coin2coin">
                <img src={getCoinIcon()} />
                <img src={getCoinIcon()} />
                <span>
                  FAN/USDK
                </span>
              </div>
              <div className="rate">128.23%</div>
              <div className="rate-tip">10.20%FAN+118.13%OKT</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="info-detail">{toLocale('Total staked：')}$12,666</div>
              <div className="btn">{toLocale('STAKE')}</div>
            </div>
          </div>
          <div className="title-wrap">
            <div className="space-between">
              <div className="left">
                {toLocale('Other pools')}
                <Tooltip
                  placement="right"
                  overlay={toLocale('Minimum received help')}
                >
                  <i className="help" />
                </Tooltip>
              </div>
              <div className="right">
                <div className="search-wrap iconfont">
                  <input
                    placeholder={toLocale('Search name')}
                  />
                </div>
              </div>
            </div>
          </div>
          <WatchlistPanel />
        </div>
    );
  }
}
