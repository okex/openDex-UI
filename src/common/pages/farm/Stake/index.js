import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../util/coinIcon';
import classNames from 'classnames';
import InputNum from '_component/InputNum';
import LiquidityInfoTip from '../LiquidityInfoTip';
import ConnectInfoTip from '../ConnectInfoTip';
import util from '_src/utils/util';
import { connect } from 'react-redux';
import Confirm from '../../../component/Confirm';
import * as api from '../util/api';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  const { account4Swap } = state.SwapStore;
  return { okexchainClient, account4Swap };
}

@connect(mapStateToProps)
export default class Stake extends React.Component {

  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  onInputChange = (value) => {
    this.setState({ value });
  };

  confirm = () => {
    const { value } = this.state;
    const { okexchainClient, data, isStake } = this.props;
    const params = [
      data.pool_name,
      data.lock_symbol,
      util.precisionInput(value),
      '',
      null,
    ];
    if (isStake) okexchainClient.sendFarmLockTransaction(...params);
    return okexchainClient.sendFarmUnLockTransaction(...params);
  };

  getAvailable(data) {
    let { balance_dis, pool_name } = data;
    let { account4Swap } = this.props;
    const temp = account4Swap[pool_name];
    if (temp) balance_dis = util.precisionInput(temp.available, 8);
    return balance_dis;
  }

  render() {
    const { value } = this.state;
    const { data, isStake = true, onClose } = this.props;
    const locale = isStake ? 'Stake' : 'Unstake';
    const avaliableLocale = isStake
      ? 'Avaliable to stake'
      : 'Avaliable to unstake';
    return (
      <div className="stake-panel">
        <div className="stake-panel-title">
          {toLocale(locale)}
          <span className="close" onClick={onClose}>
            ×
          </span>
        </div>
        <div className="stake-panel-content">
          <div className="space-between stake-panel-label">
            <div className="left">{toLocale('Number')}</div>
            <div className="right">
              {toLocale(avaliableLocale)}
              {this.getAvailable(data)}
            </div>
          </div>
          <div className="stake-panel-input-wrap">
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
            {/* <div className="error-tip">*12121212</div> */}
          </div>
          {isStake && (
            <>
              <div className="space-between stake-panel-detail">
                <div className="left">{toLocale('Pool ratio')}</div>
                <div className="right">{data.pool_ratio_dis}</div>
              </div>
              <div className="space-between stake-panel-detail">
                <div className="left">{toLocale('FARM APY')}</div>
                <div className="right">
                  {data.total_apy} {data.farm_apy_dis}
                </div>
              </div>
            </>
          )}
        </div>
        <div
          className={classNames('stake-panel-footer', { nomargin: isStake })}
        >
          <div className="farm-btn cancel" onClick={onClose}>
            {toLocale('cancel')}
          </div>
          <Confirm
            onClick={this.confirm}
            loadingTxt={toLocale('pending transactions')}
            successTxt={toLocale('transaction confirmed')}
          >
            <div className="farm-btn">{toLocale(locale)}</div>
          </Confirm>
        </div>
      </div>
    );
  }
}

Stake.getStake = async (data, isStake = true) => {
  if (!util.isLogined()) return <ConnectInfoTip />;
  const stakeInfo = await api.stakedInfo({ poolName: data.pool_name });
  if (!Number(stakeInfo.balance)) return <LiquidityInfoTip data={data} />;
  return <Stake data={{ ...data, ...stakeInfo }} isStake={isStake} />;
};
