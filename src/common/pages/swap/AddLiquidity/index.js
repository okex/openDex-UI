import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import CoinItem from '../CoinItem';
import calc from '_src/utils/calc';
import * as api from '../util/api';
import InfoItem from '../InfoItem';
import ReduceLiquidity from '../ReduceLiquidity';
import Confirm from '../Confirm';
import util from '_src/utils/util';
import {getDeadLine4sdk} from '../util';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}

@connect(mapStateToProps)
export default class AddLiquidity extends React.Component {
  constructor(props) {
    super(props);
    const { baseSymbol, targetSymbol, targetTokenDisabled } = this._process(
      props.liquidity
    );
    this.state = {
      baseToken: {
        available: '',
        value: '',
        symbol: baseSymbol,
      },
      targetToken: {
        available: '',
        value: '',
        symbol: targetSymbol,
      },
      exchangeInfo: {
        price: '',
        pool_share: '',
        isReverse: false,
      },
      liquidity: props.liquidity,
      userLiquidity: props.userLiquidity,
      targetTokenDisabled,
    };
  }

  _process(liquidity) {
    let baseSymbol = '',
      targetSymbol = '',
      targetTokenDisabled = true;
    if (liquidity) {
      baseSymbol = liquidity.base_pooled_coin.denom;
      targetSymbol = liquidity.quote_pooled_coin.denom;
      if (
        liquidity.base_pooled_coin.amount ===
          liquidity.quote_pooled_coin.amount &&
        calc.div(liquidity.base_pooled_coin.amount, 1) === 0
      ) {
        targetTokenDisabled = false;
      }
    }
    return { baseSymbol, targetSymbol, targetTokenDisabled };
  }

  changeBase = (token) => {
    const { baseToken, targetToken } = this.state;
    const data = { ...this.state, baseToken: { ...baseToken, ...token } };
    this.updateInfo(
      data,
      token.symbol !== baseToken.symbol && targetToken.symbol
    );
  };

  changeTarget = (token) => {
    const { baseToken, targetToken } = this.state;
    const data = { ...this.state, targetToken: { ...targetToken, ...token } };
    this.updateInfo(
      data,
      token.symbol !== targetToken.symbol && baseToken.symbol
    );
  };

  init = async () => {
    const { baseToken, targetToken } = this.state;
    const dataTokens = await api.addLiquidityTokens();
    if (!dataTokens) return;
    let { native_token = '', tokens = [] } = dataTokens;
    tokens = tokens || [];
    const token = baseToken.symbol || native_token;
    const base = tokens.filter((d) => d.symbol === token)[0];
    const data = { ...this.state };
    if (base) data.baseToken = { ...baseToken, ...base };
    if (targetToken.symbol) {
      const temp = await api.addLiquidityTokens({
        symbol: token,
      });
      if (!temp) return;
      let { tokens: targetTokens } = temp;
      targetTokens = targetTokens || [];
      const target = targetTokens.filter(
        (d) => d.symbol === targetToken.symbol
      )[0];
      if (target) data.targetToken = { ...targetToken, ...target };
    }
    this.updateInfo(data);
  };

  async updateInfo(data, check = false) {
    if (check) await this._check(data);
    await this._updateExchangePrice(data);
    await this._updateExchange(data);
    this.setState(data);
  }

  async _check(data) {
    const { baseToken, targetToken } = data;
    const params = {
      base_token: baseToken.symbol,
      quote_token: targetToken.symbol,
    };
    const liquidity = await api.tokenPair(params);
    const liquidityInfo = await api.liquidityInfo(params);
    const { targetTokenDisabled } = this._process(liquidity);
    data.liquidity = liquidity;
    data.userLiquidity = liquidityInfo && liquidityInfo[0];
    data.targetTokenDisabled = targetTokenDisabled;
  }

  async _updateExchangePrice(data) {
    const { baseToken, targetToken, exchangeInfo } = data;
    if (baseToken.symbol && targetToken.symbol) {
      const temp =
        data.liquidity ||
        (await api.tokenPair({
          base_token: baseToken.symbol,
          quote_token: targetToken.symbol,
        }));
      if (!temp) return;
      const { base_pooled_coin, quote_pooled_coin } = temp;
      exchangeInfo.price = calc.div(
        base_pooled_coin.amount,
        quote_pooled_coin.amount
      );
    }
  }

  async _updateExchange(data) {
    const { baseToken, targetToken, exchangeInfo } = data;
    if (baseToken.symbol && targetToken.symbol && data.targetTokenDisabled) {
      if (baseToken.value) {
        const { base_token_amount, pool_share } = await api.addInfo({
          base_token: baseToken.symbol,
          quote_token_amount: baseToken.value + targetToken.symbol,
        });
        targetToken.value = baseToken.value ? base_token_amount : '';
        exchangeInfo.pool_share = pool_share;
      } else {
        exchangeInfo.pool_share = 0;
      }
    }
  }

  loadBaseCoinList = async () => {
    const data = await api.addLiquidityTokens();
    if (!data) return [];
    let { tokens = [] } = data;
    tokens = tokens || [];
    const { targetToken } = this.state;
    if (!targetToken.symbol) return tokens;
    return tokens.filter((d) => d.symbol !== targetToken.symbol);
  };

  loadTargetCoinList = async () => {
    const {
      baseToken: { symbol },
    } = this.state;
    const data = await api.addLiquidityTokens({ symbol });
    if (!data) return [];
    let { tokens = [] } = data;
    tokens = tokens || [];
    return tokens.filter((d) => d.symbol !== symbol);
  };

  getExchangeInfo() {
    const { baseToken, targetToken } = this.state;
    if (!baseToken.symbol || !targetToken.symbol) return null;
    const { priceInfo, poolShare } = this._getExchangeData();
    return (
      <div className="coin-exchange-detail">
        <div className="info">
          <div className="info-name">{toLocale('Price')}</div>
          <div className="info-value">
            <i className="exchange" onClick={this.revert} />
            {priceInfo}
            <i />
          </div>
        </div>
        <div className="info">
          <div className="info-name">
            {toLocale('Pool share')}
            <i className="help" />
          </div>
          <div className="info-value">{poolShare}%</div>
        </div>
      </div>
    );
  }

  _getExchangeData() {
    let {
      baseToken,
      targetToken,
      exchangeInfo,
      targetTokenDisabled,
    } = this.state;
    let priceInfo,
      price = exchangeInfo.price;
    if (exchangeInfo.isReverse) {
      const temp = baseToken;
      baseToken = targetToken;
      targetToken = temp;
      price = calc.div(1, price);
    }
    if (!targetTokenDisabled) {
      if (!baseToken.value || !targetToken.value) {
        priceInfo = `1${baseToken.symbol} ≈ -${targetToken.symbol}`;
      } else {
        priceInfo = `1${baseToken.symbol} ≈ ${calc.div(
          targetToken.value,
          baseToken.value
        )}${targetToken.symbol}`;
      }
      return { priceInfo, poolShare: 100 };
    }
    priceInfo = `1${baseToken.symbol} ≈ ${price}${targetToken.symbol}`;
    return { priceInfo, poolShare: exchangeInfo.pool_share };
  }

  revert = () => {
    let exchangeInfo = { ...this.state.exchangeInfo };
    exchangeInfo.isReverse = !exchangeInfo.isReverse;
    this.setState({ exchangeInfo });
  };

  getBtn() {
    const { baseToken, targetToken } = this.state;
    let btn;
    if (!baseToken.symbol || !targetToken.symbol)
      btn = <div className="btn disabled">{toLocale('Invalid Pair')}</div>;
    else if (!baseToken.value || !targetToken.value) {
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
    return btn;
  }

  _exchangeTokenData() {
    let { baseToken, targetToken } = this.state;
    if (baseToken.symbol && targetToken.symbol) {
      const temp = baseToken;
      if (baseToken.symbol > targetToken.symbol) {
        baseToken = targetToken;
        targetToken = temp;
      }
    }
    return { baseToken, targetToken };
  }

  confirm = () => {
    let { baseToken, targetToken } = this._exchangeTokenData();
    const { okexchainClient } = this.props;
    const params = [
      util.precisionInput(0),
      util.precisionInput(baseToken.value),
      baseToken.symbol,
      util.precisionInput(targetToken.value),
      targetToken.symbol,
      getDeadLine4sdk(),
      '',
      null,
    ];
    console.log(params);
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendAddLiquidityTransaction(...params)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  };

  componentDidMount() {
    this.init();
  }

  reduce = (liquidity) => {
    this.props.push({
      component: ReduceLiquidity,
      props: {
        liquidity,
      },
    });
  };

  render() {
    const { back, disabledChangeCoin = false } = this.props;
    const {
      baseToken,
      targetToken,
      targetTokenDisabled,
      userLiquidity,
    } = this.state;
    const exchangeInfo = this.getExchangeInfo();
    const btn = this.getBtn();
    return (
      <>
        <div className="panel">
          <div className="panel-header">
            <i className="iconfont before" onClick={back}></i>
            {toLocale('Add Liquidity')}
          </div>
          <div className="add-liquidity-content">
            <CoinItem
              label={toLocale('Input')}
              token={baseToken}
              onChange={this.changeBase}
              loadCoinList={this.loadBaseCoinList}
              disabledChangeCoin={disabledChangeCoin}
            />
            <div className="sep add-sep"></div>
            <CoinItem
              label={toLocale('Input')}
              token={targetToken}
              disabled={targetTokenDisabled}
              onChange={this.changeTarget}
              loadCoinList={this.loadTargetCoinList}
              disabledChangeCoin={disabledChangeCoin}
            />
            {exchangeInfo}
            <div className="btn-wrap">{btn}</div>
          </div>
        </div>
        {userLiquidity && (
          <div className="panel">
            <InfoItem data={userLiquidity} reduce={this.reduce} />
          </div>
        )}
      </>
    );
  }
}
