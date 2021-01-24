import React from 'react';
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

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  const { account4Swap } = state.SwapStore;
  return { okexchainClient, account4Swap };
}

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
    };
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

  _getValueByRatio(ratio) {
    if (!ratio) ratio = this.state.ratio;
    if (!ratio) return this.state.value;
    const max = this.getAvailable(true);
    const value = calc.mul(max, ratio.value);
    return value;
  }

  change = async (ratio) => {
    const value = this._getValueByRatio(ratio);
    this.setState({ ratio, value:util.precisionInput(value), error: false });
    this.updateCoins(value, false);
  };

  onInputChange = async (value) => {
    const max = this.getAvailable();
    const error = util.compareNumber(max, value);
    this.setState({ value, ratio: null, error });
    this.updateCoins(value, error);
  };

  updateCoins = async (value, error) => {
    if (!Number(value) || error) {
      this.setState({ coins: this._process(this.props.liquidity) });
      return;
    }
    const { liquidity } = this.props;
    const coins = await api.redeemableAssets({
      liquidity: util.precisionInput(value),
      base_token: liquidity.base_pooled_coin.denom,
      quote_token: liquidity.quote_pooled_coin.denom,
    });
    this.setState({ coins });
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
    const params = [
      util.precisionInput(this._getValueByRatio()),
      baseToken.amount,
      baseToken.denom,
      targetToken.amount,
      targetToken.denom,
      getDeadLine4sdk(),
      '',
      null,
    ];
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendRemoveLiquidityTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.onInputChange('');
          }
        })
        .catch((err) => reject(err));
    });
  };

  getAvailable(origin) {
    const { liquidity, account4Swap } = this.props;
    let available = liquidity.pool_token_coin.amount;
    const temp = account4Swap[liquidity.pool_token_coin.denom.toLowerCase()];
    if (temp) available = temp.available;
    if(origin) return available;
    return util.precisionInput(available, 8);
  }

  componentDidMount() {
    const {
      pool_token_coin: { denom },
    } = this.props.liquidity;
    this.context && this.context.send(channelsV3.getBalance(denom));
  }

  getBtn = (value, available) => {
    if (!Number(value))
      return <div className="btn disabled">{toLocale('Confirm')}</div>;
    if (util.compareNumber(available, value))
      return (
        <div className="btn disabled">{toLocale('insufficient lp token')}</div>
      );
    return (
      <Confirm
        onClick={this.confirm}
        loadingTxt={toLocale('pending transactions')}
        successTxt={toLocale('transaction confirmed')}
      >
        <div className="btn">{toLocale('Confirm')}</div>
      </Confirm>
    );
  };

  render() {
    const { back } = this.props;
    const { ratios, ratio, coins, value } = this.state;
    let available = this.getAvailable();
    const btn = this.getBtn(value, this._getValueByRatio(), coins);
    return (
      <div className="panel">
        <div className="panel-header">
          <i className="iconfont before" onClick={back}></i>
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
                {util.precisionInput(d.amount, 8)} {getDisplaySymbol(d.denom)}
              </div>
            </div>
          ))}
          <div className="btn-wrap">{btn}</div>
        </div>
      </div>
    );
  }
}
