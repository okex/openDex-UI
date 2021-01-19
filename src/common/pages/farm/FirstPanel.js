import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import { getCoinIcon } from '../../utils/coinIcon';
import SimpleBtnDialog from './SimpleBtnDialog';
import classNames from 'classnames';
import Stake from './Stake';
import ClaimSuccess from './ClaimSuccess';
import * as api from './util/api';


export default class FarmPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      data: null,
    };
  }

  async componentDidMount() {
    const data = await this.init();
    if(!data.active) this.startTimer();
  }

  componentWillUnmount() {
    this.stopTimer();
  }

  startTimer() {
    this.stopTimer();
    this.interval = setInterval(() => {
      const {data} = this.state;
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

  async init() {
    const data = await api.first();
    if(data.active) this.stopTimer();
    this.setState({ data });
    return data;
  }

  refreshData = () => {
    this.init();
  }

  getTimerDis = (data) => {
    if (!data.active) return `${toLocale('Claim in')} ${data.timeInfo}`;
    return `${toLocale('Claim all')}`;
  };

  render() {
    const { data } = this.state;
    const isLogined = util.isLogined();
    if(!data) return null;
    return (
      <div className="panel-first">
        <div className="info-item">
          <div className="space-between info-item-title">
            <div className="left">
              {data.lock_symbol_info.name}
            </div>
            <div className="right">
              <div className="coin2coin">
                {data.lock_symbol_info.symbols.map((symbol,symbolIndex) => <img src={getCoinIcon(symbol)} key={symbolIndex}/>)}
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
        <div className={classNames('info-account',{disabled: !isLogined})}>
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
            component={() => Stake.getStake({data,onSuccess:this.refreshData})}
          >
          <div className="farm-btn stake-btn">{toLocale('STAKE')}</div>
          </SimpleBtnDialog>
          <SimpleBtnDialog component={() => Stake.getStake({data, isStake:false, onSuccess:this.refreshData})}>
            <div className="farm-btn stake-btn">{toLocale('UNSTAKE')}</div>
          </SimpleBtnDialog>
          <SimpleBtnDialog component={() => ClaimSuccess.getClaim({data, onSuccess:this.props.onDashboard})} disabled={!data.active}>
            <div className={classNames('farm-btn','claim-btn',{active:data.active})}>{this.getTimerDis(data)}</div>
          </SimpleBtnDialog>
        </div>
      </div>
    );
  }
}
