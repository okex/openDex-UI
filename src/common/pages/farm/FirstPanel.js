import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getCoinIcon } from '../../utils/coinIcon';
import SimpleBtnDialog from './SimpleBtnDialog';
import { Dialog } from '../../component/Dialog';
import classNames from 'classnames';
import Stake from './Stake';
import ClaimBtn from './ClaimBtn';
import ClaimCheck from './ClaimCheck';
import * as api from './util/api';
import env from '../../constants/env';

export default class FarmPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
      showCheck: false,
      showUnstake: false,
    };
  }

  check() {
    const now = (Date.now() / 1000).toFixed();
    return now < env.envConfig.firstPoolConf.claim_at;
  }

  onCheckSuccess = async () => {
    const {data} = this.state;
    const showUnstake = await Stake.getStake({
      data,
      isStake: false,
      onClose: () => { this.setState({showUnstake: false})},
      onSuccess: this.refreshData,
    });
    this.setState({showUnstake});
  }

  async componentDidMount() {
    const data = await this.init();
    if (!data.active) this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.interval = setInterval(() => {
      const { data } = this.state;
      api.processFirst(data);
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
    }
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  unstake = () => {
    if(this.check()) this.setState({showCheck: true});
    else this.onCheckSuccess();
  }

  async init() {
    const data = await api.first();
    if (data.active) this.stopTimer();
    this.setState({ data });
    return data;
  }

  refreshData = () => {
    this.init();
  };

  getTimerDis = (data) => {
    if (!data.active) return toLocale('Claim in', { time: data.timeInfo });
    return `${toLocale('Claim all')}`;
  };

  render() {
    const { data,showCheck,showUnstake } = this.state;
    const isLogined = util.isLogined();
    if (!data) return null;
    return (
      <div className="panel-first">
        <div className="info-item">
          <div className="space-between info-item-title">
            <div className="left">{data.lock_symbol_info.name}</div>
            <div className="right">
              <div className="coin2coin">
                {data.lock_symbol_info.symbols.map((symbol, symbolIndex) => (
                  <img src={getCoinIcon(symbol)} key={symbolIndex} />
                ))}
                <span></span>
              </div>
            </div>
          </div>
          <div className="info-item-label">{toLocale('Farm APY')}</div>
          <div className="info-item-apy">{data.farm_apy_dis}</div>
          <div className="info-item-detail">
            <div className="left">
              <div className="title">{data.farm_amount_dis}</div>
              <div className="title-tip">{toLocale('Farm amount (OKT)')}</div>
            </div>
            <div className="right">
              <div className="title">{data.total_staked_dis}</div>
              <div className="title-tip">{toLocale('Total staked')}</div>
            </div>
          </div>
        </div>
        <div className={classNames('info-account', { disabled: !isLogined })}>
          <div className="left">
            <div className="title">{data.account_staked_dis}</div>
            <div className="title-tip">{toLocale('Your Staked LP')}</div>
          </div>
          <div className="right">
            <div className="title">{data.estimated_farm_dis}</div>
            <div className="title-tip">{toLocale('Estimated farm(OKT)')}</div>
          </div>
        </div>
        <div className="info-opt">
          <SimpleBtnDialog
            component={() =>
              Stake.getStake({ data, onSuccess: this.refreshData })
            }
          >
            <div className="farm-btn stake-btn">{toLocale('STAKE')}</div>
          </SimpleBtnDialog>
          <div className="farm-btn stake-btn" onClick={this.unstake}>{toLocale('UNSTAKE')}</div>
          <Dialog visible={showCheck} hideCloseBtn>
            <ClaimCheck onClose={() => this .setState({showCheck: false})} onSuccess={this.onCheckSuccess}/>
          </Dialog>
          {showUnstake && 
            <Dialog visible hideCloseBtn>
              {
                showUnstake
              }
            </Dialog>
          }
          <ClaimBtn
            data={data}
            onSuccess={this.props.onDashboard}
            disabled={!data.active}
          >
            <div
              className={classNames('farm-btn', 'claim-btn', {
                active: data.active,
              })}
            >
              {this.getTimerDis(data)}
            </div>
          </ClaimBtn>
        </div>
      </div>
    );
  }
}
