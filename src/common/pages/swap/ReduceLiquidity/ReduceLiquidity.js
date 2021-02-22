import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon, getDisplaySymbol } from '../../../utils/coinIcon';
import * as api from '../util/api';
import InputNum from '_component/InputNum';
import calc from '_src/utils/calc';
import Confirm from '../../../component/Confirm';
import util from '_src/utils/util';
import { channelsV3 } from '../../../utils/websocket';
import { getDeadLine4sdk } from '../util';
import SwapContext from '../SwapContext';
import { validateTxs } from '_src/utils/client';
import classNames from 'classnames';
import { Dialog } from '../../../component/Dialog';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  const { account4Swap, setting } = state.SwapStore;
  return { okexchainClient, account4Swap, setting };
}
@withRouter
@connect(mapStateToProps)
export default class ReduceLiquidity extends React.Component {
  static contextType = SwapContext;

  constructor(props) {
    super(props);
    const coins = this._process(props.liquidity);
    const ratios = [
      { name: '25%', value: 0.25 },
      { name: '50%', value: 0.5 },
      { name: '75%', value: 0.75 },
      { name: toLocale('All'), value: 1 },
    ];
    this.state = {
      coins,
      ratios,
      ratio: null,
      value: '',
      error: false,
      showConfirmDialog: false,
      active: true,
    };
    this.trading = false;
    this.debounceUpdateCoins4RealTime = util.debounce(this.updateCoins4RealTime);
  }

  _process(liquidity) {
    const coins = [];
    coins.push({
      denom: liquidity.base_pooled_coin.denom,
      amount: 0.0,
    });
    coins.push({
      denom: liquidity.quote_pooled_coin.denom,
      amount: 0.0,
    });
    return coins;
  }

  getMinimumReceived(value, precision = 16) {
    const {
      setting: { slippageTolerance },
    } = this.props;
    return util.precisionInput(
      calc.mul(value, 1 - slippageTolerance * 0.01),
      precision
    );
  }

  _getValueByRatio(ratio) {
    if (!ratio) ratio = this.state.ratio;
    if (!ratio) return this.state.value;
    const max = this.getAvailable(true).replace(/,/g,'');
    const value = calc.mul(max, ratio.value, false);
    return util.precisionInput(value);
  }

  updateCoins4RealTime = async (data, time = 3000) => {
    this._clearTimer();
    await this.updateCoins(data);
    this.setState(data, () => {
      this._clearTimer();
      this.setState({});
      data.value &&
        !data.error &&
        (this.updateCoins4RealTime.interval = setInterval(async () => {
          const temp = { ...this.state };
          await this.updateCoins(temp);
          this.setState(temp);
        }, time));
    });
  }

  change = async (ratio) => {
    const value = this._getValueByRatio(ratio);
    this.setState({ ratio, value, error: false }, () => {
      this.updateCoins4RealTime({ ...this.state });
    });
  };

  onInputChange = async (value) => {
    const max = this.getAvailable().replace(/,/g,'');
    const error = util.compareNumber(max, value);
    this.setState({ value, ratio: null, error }, () => {
      this.debounceUpdateCoins4RealTime({ ...this.state });
    });
  };

  updateCoins = async (data) => {
    if (!Number(data.value) || data.error) {
      data.coins = this._process(this.props.liquidity);
      return;
    }
    const { liquidity } = this.props;
    data.coins = await api.redeemableAssets({
      liquidity: util.precisionInput(data.value).replace(/,/g,''),
      base_token: liquidity.base_pooled_coin.denom,
      quote_token: liquidity.quote_pooled_coin.denom,
    });
    const { showConfirmDialog, coins } = this.state;
    if (
      showConfirmDialog &&
      (coins[0].amount !== data.coins[0].amount ||
        coins[1].amount !== data.coins[1].amount)
    )
      data.active = true;
    return;
  };

  _exchangeTokenData() {
    let baseToken = this.state.coins[0],
      targetToken = this.state.coins[1];
    if (baseToken.denom && targetToken.denom) {
      const temp = baseToken;
      if (baseToken.denom > targetToken.denom) {
        baseToken = targetToken;
        targetToken = temp;
      }
    }
    return { baseToken, targetToken };
  }

  confirm = () => {
    const { okexchainClient } = this.props;
    const { baseToken, targetToken } = this._exchangeTokenData();
    const { value } = this.state;
    const params = [
      util.precisionInput(value).replace(/,/g,''),
      this.getMinimumReceived(baseToken.amount).replace(/,/g,''),
      baseToken.denom,
      this.getMinimumReceived(targetToken.amount).replace(/,/g,''),
      targetToken.denom,
      getDeadLine4sdk(),
      '',
      null,
    ];
    return new Promise((resolve, reject) => {
      this.trading = true;
      okexchainClient
        .sendRemoveLiquidityTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.onInputChange('');
          }
        })
        .catch((err) => reject(err))
        .finally(() => {
          this.trading = false;
        });
    });
  };

  cancel = () => {
    this.trading = false;
  }

  getAvailable(original) {
    const { liquidity, account4Swap } = this.props;
    let available = liquidity.pool_token_coin.amount;
    const temp = account4Swap[liquidity.pool_token_coin.denom.toLowerCase()];
    if (temp) available = temp.available;
    if (original) return available;
    return util.precisionInput(available, 8);
  }

  _clearTimer() {
    if (this.updateCoins4RealTime.interval) {
      clearInterval(this.updateCoins4RealTime.interval);
      this.updateCoins4RealTime.interval = null;
    }
  }

  componentWillUnmount() {
    this._clearTimer();
  }

  componentDidMount() {
    const {
      pool_token_coin: { denom },
    } = this.props.liquidity;
    this.context && this.context.send(channelsV3.getBalance(denom));
  }

  getBtn = (value, available) => {
    if (!Number(value))
      return <div className="btn disabled">{toLocale('Confirm Reduce btn')}</div>;
    if (util.compareNumber(available, value)) {
      return (
        <div className="btn disabled">{toLocale('insufficient lp token')}</div>
      );
    }
    return (
      <div className="btn" onClick={() => this.confirmDialog()}>
        {toLocale('Confirm Reduce btn')}
      </div>
    );
  };

  confirmDialog = (showConfirmDialog = true) => {
    if (showConfirmDialog && this.trading) return;
    this.setState({ showConfirmDialog, active: false });
  };

  triggerConfirm = () => {
    this.confirmDialog(false);
    this.confirmInstance._onClick();
  };

  render() {
    const {
      ratios,
      ratio,
      coins,
      value,
      showConfirmDialog,
      active,
    } = this.state;
    let available = this.getAvailable();
    const btn = this.getBtn(value, this._getValueByRatio({ value: 1 }));
    const {
      setting: { slippageTolerance },
    } = this.props;
    return (
      <div className="panel">
        <div className="panel-header">
          <i className="iconfont before" onClick={() => this.props.history.goBack()}></i>
          {toLocale('Reduce Liquidity')}
        </div>
        <div className="add-liquidity-content">
          <div className="coin-item">
            <div className="coin-item-title">
              <div>{toLocale('Input')}</div>
              <div className="txt">
                {toLocale('Balance')}: {available}
              </div>
            </div>
            <div className="coin-item-content">
              <div className="input">
                <InputNum
                  type="text"
                  value={value}
                  onChange={this.onInputChange}
                  placeholder="0.00000000"
                  precision={8}
                />
              </div>
              <div className="coin-rate-select">
                {ratios.map((d, index) => (
                  <div
                    className={'check-btn' + (ratio === d ? ' active' : '')}
                    key={index}
                    onClick={() => this.change(d)}
                  >
                    {d.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="withdraw">{toLocale('Withdraw assets')}</div>
          {coins.map((d, index) => (
            <div className="space-between coin-withdraw" key={index}>
              <div className="left">
                <img src={getCoinIcon(d.denom)} />
                {getDisplaySymbol(d.denom)}
              </div>
              <div className="right">
                {util.precisionInput(d.amount, 8)}{' '}
                {getDisplaySymbol(d.denom)}
              </div>
            </div>
          ))}
          <div className="btn-wrap">{btn}</div>
          <Dialog visible={showConfirmDialog} hideCloseBtn>
            <div className="panel-dialog-info">
              <div className="panel-dialog-info-title">
                {toLocale('Confirm Reduce')}
                <span
                  className="close"
                  onClick={() => this.confirmDialog(false)}
                >
                  ×
                </span>
              </div>
              <div className="panel-dialog-info-content">
                <div className="panel-confirm">
                  <div className="space-between coin">
                    <div className="left">
                      <img src={getCoinIcon(coins[0].denom)} />
                      {getDisplaySymbol(coins[0].denom)}
                    </div>
                    <div className="right">
                      {util.precisionInput(coins[0].amount, 8)}
                    </div>
                  </div>
                  <div className="down add" />
                  <div className="space-between coin">
                    <div className="left">
                      <img src={getCoinIcon(coins[1].denom)} />
                      {getDisplaySymbol(coins[1].denom)}
                    </div>
                    <div className="right">
                      {util.precisionInput(coins[1].amount, 8)}
                    </div>
                  </div>
                  {active && (
                    <div className="space-between tip-info-warn tip-info-accept">
                      <div className="left">{toLocale('Price Updated')}</div>
                      <div className="right">
                        <div
                          className="btn"
                          onClick={() => this.setState({ active: false })}
                        >
                          {toLocale('Accept')}
                        </div>
                      </div>
                    </div>
                  )}
                  <div className="tip-info-warn">
                    {toLocale('reduce liquidity warn tip', {
                      num: slippageTolerance,
                    })}
                  </div>
                  <div className="coin-exchange-detail">
                    <div className="info">
                      <div className="info-name">
                        {toLocale('UNI Burned', {
                          base: getDisplaySymbol(coins[0].denom),
                          quote: getDisplaySymbol(coins[1].denom),
                        })}
                      </div>
                      <div className="info-value">
                        <img
                          src={getCoinIcon(coins[0].denom)}
                          className="min-coin"
                        />
                        <img
                          src={getCoinIcon(coins[1].denom)}
                          className="min-coin"
                        />
                        &nbsp;{util.precisionInput(value, 8)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-dialog-info-footer">
                <div
                  className="btn1 cancel"
                  onClick={() => this.confirmDialog(false)}
                >
                  {toLocale('cancel')}
                </div>
                <div
                  className={classNames('btn1', { loading: active })}
                  onClick={this.triggerConfirm}
                >
                  {toLocale('Confirm Reduce btn')}
                </div>
              </div>
            </div>
          </Dialog>
          <Confirm
            onClick={this.confirm}
            onCancel={this.cancel}
            loadingTxt={toLocale('pending transactions')}
            successTxt={toLocale('transaction confirmed')}
            getRef={(instance) => (this.confirmInstance = instance)}
          ></Confirm>
        </div>
      </div>
    );
  }
}
