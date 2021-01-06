
import React from 'react';
import { toLocale } from '_src/locale/react-locale'
import { getCoinIcon } from '../util/coinIcon';
import InputNum from '_component/InputNum';

export default class Stake extends React.Component {

  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  onInputChange = value => {
    this.setState({value});
  }

  confirm = () => {

  }

  render() {
    const {value} = this.state;
    const {data,isStake=true,onClose} = this.props;
    const locale = isStake ? 'Stake' : 'Unstake';
    const avaliableLocale = isStake ? 'Avaliable to stake':'Avaliable to unstake'
    return (
      <div className="stake-panel">
        <div className="stake-panel-title">{toLocale(locale)}<span className="close" onClick={onClose}>×</span></div>
        <div className="space-between stake-panel-label">
          <div className="left">{toLocale('Number')}</div>
          <div className="right">{toLocale(avaliableLocale)}{data.avaliable}</div>
        </div>
        <div className="space-between stake-panel-input">
          <div className="left">
            <InputNum
              type="text"
              value={value}
              onChange={this.onInputChange}
              placeholder="0.00000000"
              precision={8}
            />
          </div>
          <div className="right">
            <div className="coin2coin">
              <img src={getCoinIcon(data.lock_symbol)} />
              <img src={getCoinIcon(data.yield_symbol)} />
              <span>
                {data.lock_symbol_dis}/{data.yield_symbol_dis}
              </span>
            </div>
          </div>
        </div>
        {isStake &&
          <>
            <div className="space-between stake-panel-detail">
              <div className="left">{toLocale('Pool ratio')}</div>
              <div className="right">{data.pool_ratio_dis}</div>
            </div>
            <div className="space-between stake-panel-detail">
            <div className="left">{toLocale('FARM APY')}</div>
            <div className="right">{data.total_apy} {data.farm_apy_dis}</div>
          </div>
          </>
        }
        <div className="opts">
          <div className="btn cancel" onClick={onClose}>{toLocale('cancel')}</div>
          <div className="btn" onClick={this.confirm}>{toLocale(locale)}</div>
        </div>
      </div>
    );
  }
}
