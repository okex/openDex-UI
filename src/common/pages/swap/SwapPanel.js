import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { Link } from 'react-router-dom';
import CoinItem from './CoinItem';
import { getCoinIcon, getDisplaySymbol } from '../../utils/coinIcon';
import * as api from './util/api';
import Confirm from '../../component/Confirm';
import { getDeadLine4sdk } from './util';
import getRef from '../../component/getRef';
import Tooltip from '../../component/Tooltip';
import { validateTxs } from '_src/utils/client';
import Message from '_src/component/Message';

function mapStateToProps(state) {
  const { setting } = state.SwapStore;
  const { okexchainClient } = state.Common;
  return { okexchainClient, setting };
}

@connect(mapStateToProps)
@getRef
export default class SwapPanel extends React.Component {
  static exchangeInfo = {
    price: '',
    price_impact: '',
    fee: '',
    route: '',
    isReverse: false,
  };

  static defaultProps = {
    baseToken: {
      available: '',
      value: '',
      symbol: '',
      error: false,
    },
    targetToken: {
      available: '',
      value: '',
      symbol: '',
      error: false,
    },
  };

  constructor(props) {
    super(props);
    this.state = {
      baseToken: props.baseToken,
      targetToken: props.targetToken,
      exchangeInfo: { ...SwapPanel.exchangeInfo },
      isPoolEmpty: false,
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
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  async updateSwapInfo(data, key, errTip = false) {
    const { value, symbol } = data[key];
    const target = key === 'baseToken' ? data.targetToken : data.baseToken;
    if (value && symbol && target.symbol) {
      try {
        const {
          buy_amount = '',
          price = '',
          price_impact = '',
          fee = '',
          route = '',
        } = await api.buyInfo({
          value,
          sell_token_amount: `${value}${symbol}`,
          token: target.symbol,
        });
        data.exchangeInfo = { price, price_impact, fee, route };
        target.value = buy_amount;
      } catch (e) {
        if (errTip) {
          let content = e.message || toLocale(`error.code.${e.code}`);
          if (e.code === 65014) {
            content = toLocale('pool empty');
            data.isPoolEmpty = true;
          }
          Message.error({
            content,
            duration: 3,
          });
        }
        data.exchange = { ...SwapPanel.exchangeInfo };
        target.value = '';
      }
    } else {
      target.value = '';
    }
  }

  changeBase = (token) => {
    let baseToken = { ...this.state.baseToken, ...token };
    let targetToken = { ...this.state.targetToken, value: '' };
    const data = { ...this.state, baseToken, targetToken, isPoolEmpty: false };
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  _clearTimer() {
    if (this.updateSwapInfo4RealTime.interval) {
      clearInterval(this.updateSwapInfo4RealTime.interval);
      this.updateSwapInfo4RealTime.interval = null;
    }
  }

  async updateSwapInfo4RealTime(data, key, time = 3000) {
    this._clearTimer();
    await this.updateSwapInfo(data, key, true);
    this.setState(data, () => {
      this._clearTimer();
      this.setState({});
      data[key].value &&
        (this.updateSwapInfo4RealTime.interval = setInterval(async () => {
          const temp = {
            baseToken: { ...this.state.baseToken },
            targetToken: { ...this.state.targetToken },
            exchangeInfo: { ...this.state.exchangeInfo },
          };
          await this.updateSwapInfo(temp, key);
          this.setState(temp);
        }, time));
    });
  }

  changeTarget = (token) => {
    let baseToken = { ...this.state.baseToken };
    let targetToken = { ...this.state.targetToken, ...token };
    const data = { ...this.state, targetToken, baseToken, isPoolEmpty: false };
    this.updateSwapInfo4RealTime(data, 'baseToken');
  };

  async searchToken(data, symbol) {
    if (!data) data = await api.swapTokens();
    if (!data) return null;
    let { native_token = '', tokens = [] } = data;
    tokens = tokens || [];
    symbol = symbol || native_token;
    const base = tokens.filter((d) => d.symbol === symbol)[0];
    return base || null;
  }

  initBaseToken = async () => {
    const base = await this.searchToken();
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

  componentWillUnmount() {
    this._clearTimer();
  }

  componentDidMount() {
    this.init();
  }

  async init(data) {
    if (!data) {
      this.initBaseToken();
      return;
    }
    const tokens = await api.swapTokens();
    const temp = {
      ...this.state,
      baseToken: data.baseToken,
      targetToken: data.targetToken,
    };
    const baseToken = await this.searchToken(tokens, temp.baseToken.symbol);
    const targetToken = await this.searchToken(tokens, temp.targetToken.symbol);
    baseToken.value = '';
    targetToken.value = '';
    this.updateSwapInfo4RealTime(
      { ...temp, baseToken, targetToken },
      'baseToken'
    );
  }

  getExchangeInfo() {
    const { baseToken, targetToken, exchangeInfo } = this.state;
    const fee = Number(exchangeInfo.fee.replace(baseToken.symbol, ''));
    if (baseToken.symbol && targetToken.symbol) {
      if (!baseToken.value || !targetToken.value) {
        return (
          <div className="coin-exchange-detail">
            <div className="info">
              <div className="info-name">{toLocale('Price')}</div>
              <div className="info-value">
                <i className="exchange" />1{getDisplaySymbol(baseToken.symbol)}{' '}
                ≈ -{getDisplaySymbol(targetToken.symbol)}
              </div>
            </div>
          </div>
        );
      } else {
        let priceInfo = `1${getDisplaySymbol(
          baseToken.symbol
        )} ≈ ${util.precisionInput(exchangeInfo.price, 8)}${getDisplaySymbol(
          targetToken.symbol
        )}`;
        if (exchangeInfo.isReverse)
          priceInfo = `1${getDisplaySymbol(
            targetToken.symbol
          )} ≈ ${util.precisionInput(
            calc.div(1, exchangeInfo.price),
            8
          )}${getDisplaySymbol(baseToken.symbol)}`;
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
                <Tooltip
                  placement="right"
                  overlay={toLocale('Minimum received help')}
                >
                  <i className="help" />
                </Tooltip>
              </div>
              <div className="info-value">
                {this.getMinimumReceived(8)}{' '}
                {getDisplaySymbol(targetToken.symbol)}
              </div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Price Impact')}
                <Tooltip
                  placement="right"
                  overlay={toLocale('Price Impact help')}
                >
                  <i className="help" />
                </Tooltip>
              </div>
              <div className="info-value">
                {calc.mul(exchangeInfo.price_impact, 100).toFixed(2)}%
              </div>
            </div>
            <div className="info">
              <div className="info-name">
                {toLocale('Liquidity Provider Fee')}
                <Tooltip
                  placement="right"
                  overlay={toLocale('Liquidity Provider Fee help')}
                >
                  <i className="help" />
                </Tooltip>
              </div>
              <div className="info-value">
                {!fee && '≈'}
                {util.precisionInput(fee, 8)}{' '}
                {getDisplaySymbol(baseToken.symbol)}
              </div>
            </div>
            {exchangeInfo.route && (
              <div className="info">
                <div className="info-name">
                  {toLocale('Route')}
                  <Tooltip
                    placement="right"
                    overlay={toLocale(
                      "Current pair can only swap through OKT, there's no direct pair for the 2 tokens."
                    )}
                  >
                    <i className="help" />
                  </Tooltip>
                </div>
                <div className="info-value">
                  <img className="coin" src={getCoinIcon(baseToken.symbol)} />
                  {getDisplaySymbol(baseToken.symbol)} &gt;{' '}
                  <img className="coin" src={getCoinIcon(exchangeInfo.route)} />
                  {getDisplaySymbol(exchangeInfo.route)} &gt;
                  <img className="coin" src={getCoinIcon(targetToken.symbol)} />
                  {getDisplaySymbol(targetToken.symbol)}
                </div>
              </div>
            )}
          </div>
        );
      }
    }
    return null;
  }

  getMinimumReceived(precision = 16) {
    const { targetToken } = this.state;
    const {
      setting: { slippageTolerance },
    } = this.props;
    return util.precisionInput(
      calc.mul(targetToken.value, 1 - slippageTolerance * 0.01),
      precision
    );
  }

  getBtn() {
    const { baseToken, targetToken, isPoolEmpty } = this.state;
    let btn;
    if (!util.isLogined()) {
      btn = (
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="btn">{toLocale('Connect Wallet')}</div>
        </Link>
      );
    } else if (!baseToken.symbol || !targetToken.symbol) {
      btn = <div className="btn disabled">{toLocale('Invalid Pair')}</div>;
    } else if (isPoolEmpty) {
      btn = <div className="btn disabled">{toLocale('pool empty')}</div>;
    } else if (!Number(baseToken.value) || !Number(targetToken.value)) {
      btn = <div className="btn disabled">{toLocale('Input an amount')}</div>;
    } else if (baseToken.error) {
      btn = (
        <div className="btn disabled">
          {toLocale('insufficient', {
            coin: getDisplaySymbol(baseToken.symbol),
          })}
        </div>
      );
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
      getDeadLine4sdk(),
      util.getMyAddr(),
      '',
      null,
    ];
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendSwapTokenTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.changeBase({ ...baseToken, value: '' });
          }
        })
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
          max={true}
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
