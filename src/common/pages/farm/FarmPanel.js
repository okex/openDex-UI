import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getCoinIcon } from './util/coinIcon';
import { getLangURL } from '_src/utils/navigation';
import Tooltip from '../../component/Tooltip';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import { Dialog } from '../../component/Dialog';
import WatchlistPanel from './WatchlistPanel';
import Confirm from '../../component/Confirm';
import SimpleBtnDialog from './SimpleBtnDialog';
import Stake from './Stake';
import * as api from './util/api'; 

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}

@connect(mapStateToProps)
export default class FarmPanel extends React.Component {

  constructor() {
    super();
    this.state = {
      data:[],
      stakeInfo:null
    }
  }

  componentDidMount() {
    this.init();
  }

  async init() {
    const {data=[]} = await api.whitelist();
    this.setState({data});
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

  stake = (stakeInfo) => {
    this.setState({stakeInfo});
  }

  onClose = () => {
    this.setState({stakeInfo:null});
  }

  render() {
    const isLogined = util.isLogined();
    const {data,stakeInfo} = this.state;
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
          {data.map((d,index) => (
            <div className="info-item" key={index}>
              <div className="tag active"></div>
              <div className="coin2coin">
                <img src={getCoinIcon(d.lock_symbol)} />
                <img src={getCoinIcon(d.yield_symbol)} />
                <Tooltip
                placement="right"
                overlay={d.pool_name_dis}
              >
                <span>
                  {d.lock_symbol_dis}/{d.yield_symbol_dis}
                </span>
              </Tooltip>
              </div>
              <div className="rate">{d.total_apy}</div>
              <div className="rate-tip">{d.farm_apy_dis}</div>
              <div className="info-detail">{toLocale('Total staked：')}{d.total_staked_dis}</div>
              <div className="info-detail">{toLocale('Pool rate：')}{d.pool_rate_dis}/1Day</div>
              <SimpleBtnDialog component={<Stake data={d} />}>
                <div className="btn">{toLocale('STAKE')}&nbsp;<span className="timer">01{toLocale('d')} 08{toLocale('h')} 36{toLocale('m')} 52{toLocale('s')}</span></div>
              </SimpleBtnDialog>
            </div>
          ))}
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
        {stakeInfo && 
          <Dialog visible onClose={this.onClose}>
            <Stake data={stakeInfo} onClose={this.onClose}/>
          </Dialog>
        }
      </div>
    );
  }
}
