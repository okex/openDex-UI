import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../util/coinIcon';
import * as api from '../util/api';
import InputNum from '_component/InputNum';
import calc from '_src/utils/calc';
import Confirm from '../Confirm';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}

function mapDispatchToProps(dispatch) {
  return {
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class ReduceLiquidity extends React.Component {
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
      amount: 0,
    });
    coins.push({
      denom: liquidity.quote_pooled_coin.denom,
      amount: 0,
    });
    return coins;
  }

  change = async (ratio) => {
    const { liquidity } = this.props;
    const value = calc.mul(liquidity.pool_token_coin.amount, ratio.value);
    this.setState({ ratio, value });
    this.updateCoins(value);
  };

  onInputChange = async (value) => {
    const max = this.props.liquidity.pool_token_coin.amount;
    if(calc.div(max,1)<=calc.div(value,1)) value = max;
    this.setState({ value, ratio: null });
    this.updateCoins(value);
  };

  updateCoins = async (value) => {
    const { liquidity } = this.props;
    const coins = await api.redeemableAssets({
      liquidity: value,
      base_token: liquidity.base_pooled_coin.denom,
      quote_token: liquidity.quote_pooled_coin.denom,
    });
    this.setState({ coins });
  };

  _exchangeTokenData() {
    let baseToken = this.state.coins[0],targetToken = this.state.coins[1];
    if(baseToken.denom && targetToken.denom) {
      const temp = baseToken;
      if(baseToken.denom > targetToken.denom) {
        baseToken = targetToken;
        targetToken = temp;
      }
    }
    return {baseToken,targetToken}
  }

  confirm = () => {
    const {baseToken,targetToken} = this._exchangeTokenData();
    const params = {
      liquidity:this.state.value,
      min_base_amount:`${baseToken.amount}${baseToken.denom}`,
      min_quote_amount:`${targetToken.amount}${targetToken.denom}`,
    }
    console.log(params);
    return sendRemoveLiquidityTransaction(this.state.value, baseToken.amount, baseToken.denom, targetToken.amount, targetToken.denom, Date.parse(new Date()) + 1000000, '', null);
  };

  render() {
    const { back, liquidity } = this.props;
    const { ratios, ratio, coins, value } = this.state;
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
                {toLocale('Balance')}: {liquidity.pool_token_coin.amount}
              </div>
            </div>
            <div className="coin-item-content">
              <div className="input">
                <InputNum
                  type="text"
                  value={value}
                  onChange={this.onInputChange}
                  placeholder="0.000000"
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
                {d.denom}
              </div>
              <div className="right">
                {d.amount} {d.denom}
              </div>
            </div>
          ))}
          <div className="btn-wrap">
            {value ? (
              <Confirm onClick={this.confirm} loadingTxt={toLocale('pending transactions')} successTxt={toLocale('transaction confirmed')}>
                <div className="btn">
                  {toLocale('Confirm')}
                </div>
              </Confirm>
            ) : (
              <div className="btn disabled">{toLocale('Confirm')}</div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
