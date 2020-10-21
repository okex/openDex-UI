import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { withRouter, Link } from 'react-router-dom';
import CoinItem from './CoinItem';
import { getCoinIcon } from './util/coinIcon';
import * as api from './util/api';
import Confirm from './Confirm';

function mapStateToProps(state) {
  const { setting } = state.SwapStore;
  const { okexchainClient } = state.Common;
  return { okexchainClient, setting };
}

@withRouter
@connect(mapStateToProps)
export default class SwapPanel extends React.Component {
  constructor() {
    super();
    this.state = {
      baseToken: {
        available: '',
        value: '',
        symbol: '',
      },
      targetToken: {
        available: '',
        value: '',
        symbol: '',
      },
      exchangeInfo: {
        price: '',
        price_impact: '',
        fee: '',
        route: '',
        isReverse: false,
      },
    };
  }

  exchange = async () => {
    const { baseToken, targetToken } = this.state;
    const data = {
      ...this.state,
      baseToken: targetToken,
      targetToken: baseToken,
    };
    data.targetToken.value = '';
    await this.updateSwapInfo(data, 'baseToken');
    this.setState(data);
  };

  async updateSwapInfo(data, key) {
    const { value, symbol } = data[key];
    const target = key === 'baseToken' ? data.targetToken : data.baseToken;
    if (value && symbol && target.symbol) {
      const { buy_amount, price, price_impact, fee, route } = await api.buyInfo(
        {
          sell_token_amount: `${value}${symbol}`,
          token: target.symbol,
        }
      );
      data.exchangeInfo = { price, price_impact, fee, route };
      target.value = buy_amount;
    } else {
      target.value = '';
    }
  }

  changeBase = (token) => {
    let baseToken = { ...this.state.baseToken, ...token };
    const data = { ...this.state, baseToken };
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  async updateSwapInfo4RealTime(data, key, time = 3000) {
    if (this.updateSwapInfo4RealTime.interval) {
      clearInterval(this.updateSwapInfo4RealTime.interval);
      this.updateSwapInfo4RealTime.interval = null;
    }
    await this.updateSwapInfo(data, key);
    this.setState(data);
    data[key].value &&
      (this.updateSwapInfo4RealTime.interval = setInterval(async () => {
        await this.updateSwapInfo(data, key);
        this.setState(data);
      }, time));
  }

  changeTarget = (token) => {
    let targetToken = { ...this.state.targetToken, ...token };
    const data = { ...this.state, targetToken };
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  initBaseToken = async () => {
    const data = await api.swapTokens();
    if (!data) return;
    let { native_token = '', tokens = [] } = data;
    tokens = tokens || [];
    const base = tokens.filter((d) => d.symbol === native_token)[0];
    if (!base) return;
    this.changeBase(base);
  };

  loadBaseCoinList = async () => {
    const data = await api.swapTokens();
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
    const data = await api.swapTokens({ symbol });
    if (!data) return [];
    let { tokens = [] } = data;
    tokens = tokens || [];
    return tokens.filter((d) => d.symbol !== symbol);
  };

  revert = () => {
    let exchangeInfo = { ...this.state.exchangeInfo };
    exchangeInfo.isReverse = !exchangeInfo.isReverse;
    this.setState({ exchangeInfo });
  };

  componentDidMount() {
    this.initBaseToken();
  }

  getExchangeInfo() {
    const { baseToken, targetToken, exchangeInfo } = this.state;
    if (baseToken.symbol && targetToken.symbol) {
      if (!baseToken.value || !targetToken.value) {
        return (
          <div className="coin-exchange-detail">
            <div className="info">
              <div className="info-name">{toLocale('Price')}</div>
              <div className="info-value">
                <i className="exchange" />1{baseToken.symbol} ≈ -
                {targetToken.symbol}
              </div>
            </div>
          </div>
        );
      } else {
        let priceInfo = `1${baseToken.symbol} ≈ ${exchangeInfo.price}${targetToken.symbol}`;
        if (exchangeInfo.isReverse)
          priceInfo = `1${targetToken.symbol} ≈ ${calc.div(
            1,
            exchangeInfo.price
          )}${baseToken.symbol}`;
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
                {toLocale('Minimum received')}
                <i className="help" data-title={toLocale('Minimum received help')} />
              </div>
              <div className="info-value">
                {this.getMinimumReceived()} {targetToken.symbol}
              </div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Price Impact')}
                <i className="help" title={toLocale('Price Impact help')} />
              </div>
              <div className="info-value">{exchangeInfo.price_impact}%</div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Liquidity Provider Fee')}
                <i
                  className="help"
                  title={toLocale('Liquidity Provider Fee help')}
                />
              </div>
              <div className="info-value">
                {exchangeInfo.fee} {baseToken.symbol}
              </div>
            </div>
            {exchangeInfo.route && (
              <div className="info">
                <div className="info-name">
                  {toLocale('Route')}
                  <i className="help" />
                </div>
                <div className="info-value">
                  <img className="coin" src={getCoinIcon(baseToken.symbol)} />
                  {baseToken.symbol} &gt;{' '}
                  <img className="coin" src={getCoinIcon(exchangeInfo.route)} />
                  {exchangeInfo.route} &gt;
                  <img className="coin" src={getCoinIcon(targetToken.symbol)} />
                  {targetToken.symbol}
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  }

  getMinimumReceived() {
    const { targetToken } = this.state;
    const {
      setting: { slippageTolerance },
    } = this.props;
    return util.precisionInput(
      calc.mul(targetToken.value, 1 - slippageTolerance * 0.01)
    );
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
    } else if (!baseToken.value || !targetToken.value) {
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
    const { okexchainClient } = this.props;
    const { baseToken, targetToken } = this.state;
    const params = [
      util.precisionInput(baseToken.value),
      baseToken.symbol,
      this.getMinimumReceived(),
      targetToken.symbol,
      parseInt(Date.now()/1000) + 1000000 + '',
      util.getMyAddr(),
      '',
      null,
    ];
    console.log(params);
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendSwapTokenTransaction(...params)
        .then((res) => resolve(res))
        .catch((err) => reject(err));
    });
  };

  render() {
    const { baseToken, targetToken } = this.state;
    const exchangeInfo = this.getExchangeInfo();
    const btn = this.getBtn();
    return (
      <div className="panel panel-swap">
        <CoinItem
          label={toLocale('From')}
          token={baseToken}
          onChange={this.changeBase}
          loadCoinList={this.loadBaseCoinList}
        />
        <div className="sep transformation-sep">
          <i onClick={this.exchange} />
        </div>
        <CoinItem
          label={toLocale('To(estimated)')}
          disabled={true}
          token={targetToken}
          onChange={this.changeTarget}
          loadCoinList={this.loadTargetCoinList}
        />
        {exchangeInfo}
        {btn}
      </div>
    );
  }
}
