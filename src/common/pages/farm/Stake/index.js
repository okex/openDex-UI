import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../../../utils/coinIcon';
import classNames from 'classnames';
import InputNum from '_component/InputNum';
import LiquidityInfoTip from '../LiquidityInfoTip';
import ConnectInfoTip from '../ConnectInfoTip';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import { connect } from 'react-redux';
import Confirm from '../../../component/Confirm';
import { channelsV3 } from '../../../utils/websocket';
import FarmContext from '../FarmContext';
import { validateTxs } from '_src/utils/client';
import * as api from '../util/api';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  const { account4Swap } = state.SwapStore;
  return { okexchainClient, account4Swap };
}

@connect(mapStateToProps)
export default class Stake extends React.Component {
  static contextType = FarmContext;

  constructor() {
    super();
    this.state = {
      value: '',
      poolRatio: '-',
      error: true,
    };
  }

  onInputChange = (value) => {
    let poolRatio = '-';
    let error = !value || !Number(value);
    const { data, isStake = true } = this.props;
    if (value) {
      const max = this.getAvailable();
      if (util.compareNumber(max, value))
        error = toLocale('balance not enough');
      else if (isStake && util.compareNumber(value, data.min_lock_amount))
        error = toLocale('stake min input', {
          num: util.precisionInput(data.min_lock_amount, 8),
        });
      else if (isStake && Number(data.pool_total_staked)) {
        poolRatio =
          util.precisionInput(
            calc.mul(
              calc.div(value, calc.add(value, data.pool_total_staked)),
              100
            ),
            2
          ) + '%';
      } else if (isStake && Number(value)) {
        poolRatio = '100.00%';
      } else {
        poolRatio = '0.00%';
      }
    }
    this.setState({ value, poolRatio, error });
  };

  setMaxValue = () => {
    this.onInputChange(this.getAvailable());
  };

  confirm = () => {
    const { value, error } = this.state;
    const { okexchainClient, data, isStake, onClose, onSuccess } = this.props;
    if (!value || error) return;
    const params = [
      data.pool_name,
      data.lock_symbol,
      util.precisionInput(value),
      '',
      null,
    ];
    return new Promise((resolve, reject) => {
      let method = isStake
        ? 'sendFarmLockTransaction'
        : 'sendFarmUnLockTransaction';
      okexchainClient[method](...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            onClose && onClose();
            onSuccess && onSuccess();
          }
        })
        .catch((err) => reject(err));
    });
  };

  getAvailable() {
    const { data, isStake = true } = this.props;
    if (!isStake) return util.precisionInput(data.account_staked, 8);
    let { balance_dis, pool_name } = data;
    let { account4Swap } = this.props;
    const temp = account4Swap[pool_name];
    if (temp) balance_dis = util.precisionInput(temp.available, 8);
    return balance_dis;
  }

  subscribe() {
    let { pool_name } = this.props.data;
    if (!this.context || !pool_name) return;
    this.context.send(channelsV3.getBalance(pool_name));
  }

  componentDidMount() {
    this.subscribe();
  }

  render() {
    const { value, poolRatio, error } = this.state;
    const { data, isStake = true, onClose } = this.props;
    const locale = isStake ? 'Stake' : 'Unstake';
    const avaliableLocale = isStake
      ? 'Avaliable to stake'
      : 'Avaliable to unstake';
    const hasErrorTip = error && error.length;
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
            <div className="right" onClick={this.setMaxValue}>
              {toLocale(avaliableLocale)}
              {this.getAvailable()}
            </div>
          </div>
          <div className="stake-panel-input-wrap">
            <div className="space-between stake-panel-input">
              <div className="left">
                <InputNum
                  type="text"
                  value={value}
                  onChange={this.onInputChange}
                  placeholder={
                    isStake
                      ? toLocale('stake min input placehold', {
                          num: util.precisionInput(data.min_lock_amount, 8),
                        })
                      : ''
                  }
                  precision={8}
                />
              </div>
              <div className="right">
                <div className="coin2coin">
                  {data.lock_symbol_info.symbols.map((symbol, symbolIndex) => (
                    <img src={getCoinIcon(symbol)} key={symbolIndex} />
                  ))}
                  <span>{data.lock_symbol_info.name}</span>
                </div>
              </div>
            </div>
            {hasErrorTip && <div className="error-tip">*{error}</div>}
          </div>
          {isStake && (
            <>
              <div className="space-between stake-panel-detail">
                <div className="left">{toLocale('Pool ratio')}</div>
                <div className="right">{poolRatio}</div>
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
          {error ? (
            <div className="farm-btn disabled">{toLocale(locale)}</div>
          ) : (
            <Confirm
              onClick={this.confirm}
              loadingTxt={toLocale('pending transactions')}
              successTxt={toLocale('transaction confirmed')}
            >
              <div className="farm-btn">{toLocale(locale)}</div>
            </Confirm>
          )}
        </div>
      </div>
    );
  }
}

Stake.getStake = async ({ data, isStake = true, onSuccess }) => {
  if (!util.isLogined()) return <ConnectInfoTip />;
  const stakeInfo = await api.stakedInfo({ poolName: data.pool_name });
  if (!Number(stakeInfo.balance) && data.isLpToken && isStake)
    return <LiquidityInfoTip data={data} />;
  return (
    <Stake
      data={{ ...data, ...stakeInfo }}
      isStake={isStake}
      onSuccess={onSuccess}
    />
  );
};
