import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { withRouter, Link } from 'react-router-dom';
import CoinItem from '../CoinItem';
import calc from '_src/utils/calc';
import * as api from '../util/api';
import InfoItem from '../InfoItem';
import ReduceLiquidity from '../ReduceLiquidity';
import Confirm from '../../../component/Confirm';
import util from '_src/utils/util';
import {getLiquidityCheck, liquidityCheck} from '../util';
import Config from '../../../constants/Config';
import { getDeadLine4sdk } from '../util';
import Message from '_src/component/Message';
import Tooltip from '../../../component/Tooltip';
import { validateTxs } from '_src/utils/client';
import { getDisplaySymbol } from '../../../utils/coinIcon';
import { Dialog } from '../../../component/Dialog';
import classNames from 'classnames';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}
@withRouter
@connect(mapStateToProps)
export default class AddLiquidity extends React.Component {
  constructor(props) {
    super(props);
    this.confirmRef = React.createRef();
    this.state = this._getDefaultState(props);
  }

  _getDefaultState(props) {
    const { baseSymbol, targetSymbol, isEmptyPool } = this._process(
      props.liquidity
    );
    return {
      baseToken: {
        available: '',
        value: '',
        symbol: baseSymbol,
        error: false,
      },
      targetToken: {
        available: '',
        value: '',
        symbol: targetSymbol,
        error: false,
      },
      exchangeInfo: {
        price: '',
        pool_share: '',
        isReverse: false,
      },
      liquidity: props.liquidity,
      userLiquidity: props.userLiquidity,
      isEmptyPool,
      showConfirmDialog: false,
      check: getLiquidityCheck(),
    };
  }

  _process(liquidity) {
    let baseSymbol = '',
      targetSymbol = '',
      isEmptyPool = false;
    if (liquidity) {
      baseSymbol = liquidity.base_pooled_coin.denom;
      targetSymbol = liquidity.quote_pooled_coin.denom;
      if (
        liquidity.base_pooled_coin.amount ===
        liquidity.quote_pooled_coin.amount &&
        calc.div(liquidity.base_pooled_coin.amount, 1) === 0
      ) {
        isEmptyPool = true;
      }
    }
    return { baseSymbol, targetSymbol, isEmptyPool };
  }

  checkProtocol = () => {
    const check = getLiquidityCheck();
    this.setState({check});
    liquidityCheck(check?'':'true');
  }

  changeBase = (token, inputChanged) => {
    const { baseToken, targetToken, isEmptyPool } = this.state;
    const data = {
      ...this.state,
      baseToken: { ...baseToken, ...token },
      targetToken: { ...targetToken },
    };
    if (!isEmptyPool && !data.baseToken.value) data.targetToken.value = '';
    this.updateLiquidInfo4RealTime({ data, inputChanged });
  };

  changeTarget = (token, inputChanged) => {
    const { baseToken, targetToken } = this.state;
    const data = {
      ...this.state,
      targetToken: { ...targetToken, ...token },
      baseToken: { ...baseToken },
    };
    this.updateLiquidInfo4RealTime({ data, key: 'targetToken', inputChanged });
  };

  _clearTimer() {
    if (this.updateLiquidInfo4RealTime.interval) {
      clearInterval(this.updateLiquidInfo4RealTime.interval);
      this.updateLiquidInfo4RealTime.interval = null;
    }
  }

  async updateLiquidInfo4RealTime({
    data,
    key = 'baseToken',
    time = 3000,
    inputChanged = true,
  }) {
    this._clearTimer();
    await this.updateInfo(data, key, true, inputChanged);
    this.setState(data, () => {
      this._clearTimer();
      this.setState({});
      data[key].value &&
        (this.updateLiquidInfo4RealTime.interval = setInterval(async () => {
          const temp = {
            baseToken: { ...this.state.baseToken },
            targetToken: { ...this.state.targetToken },
            exchangeInfo: { ...this.state.exchangeInfo },
          };
          await this.updateInfo(temp, key, false, inputChanged);
          this.setState(temp);
        }, time));
    });
  }

  init = async (state) => {
    const { baseToken, targetToken } = state;
    const dataTokens = await api.addLiquidityTokens();
    if (!dataTokens) return;
    let { native_token = '', tokens = [] } = dataTokens;
    tokens = tokens || [];
    const token = baseToken.symbol || native_token;
    const base = tokens.filter((d) => d.symbol === token)[0];
    const data = { ...state };
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
    this.updateLiquidInfo4RealTime({ data });
  };

  async updateInfo(data, key, errTip = false, inputChanged = true) {
    try {
      await this._check(data);
      await this._updateExchangePrice(data);
      await this._updateExchange(data, key, inputChanged);
    } catch (e) {
      if (errTip) {
        Message.error({
          content: e.message || toLocale(`error.code.${e.code}`),
          duration: 3,
        });
      }
    }
  }

  async _check(data) {
    const { baseToken, targetToken } = data;
    const params = {
      base_token: baseToken.symbol,
      quote_token: targetToken.symbol,
    };
    const liquidity = await api.tokenPair(params);
    const liquidityInfo = await api.liquidityInfo(params);
    const { isEmptyPool } = this._process(liquidity);
    data.liquidity = liquidity;
    data.userLiquidity = liquidityInfo && liquidityInfo[0];
    data.isEmptyPool = isEmptyPool;
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
      let { base_pooled_coin, quote_pooled_coin } = temp;
      let tempSymbol = base_pooled_coin;
      if (baseToken.symbol !== base_pooled_coin.denom) {
        base_pooled_coin = quote_pooled_coin;
        quote_pooled_coin = tempSymbol;
      }
      exchangeInfo.price = util.precisionInput(
        calc.div(quote_pooled_coin.amount, base_pooled_coin.amount,false),
        8
      );
    }
  }

  async _updateExchange(data, key, inputChanged) {
    const { baseToken, targetToken, exchangeInfo } = data;
    let _baseToken = baseToken,
      _targetToken = targetToken;
    if (
      (key === 'targetToken' && (targetToken.value || inputChanged)) ||
      (targetToken.value && !baseToken.value)
    ) {
      _baseToken = targetToken;
      _targetToken = baseToken;
    }
    if (baseToken.symbol && targetToken.symbol && !data.isEmptyPool) {
      if (_baseToken.value) {
        const { base_token_amount = '', pool_share = '' } = await api.addInfo({
          base_token: _targetToken.symbol,
          quote_token_amount: _baseToken.value + _baseToken.symbol,
          value: _baseToken.value,
        });
        _targetToken.value = _baseToken.value ? base_token_amount : '';
        exchangeInfo.pool_share = pool_share;
      } else {
        _targetToken.value = '';
        exchangeInfo.pool_share = 0;
      }
    }
  }

  loadBaseCoinList = async () => {
    const {
      targetToken: { symbol },
    } = this.state;
    const data = await api.addLiquidityTokens({ symbol });
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
    const { priceInfo, poolShare } = this._getExchangeData();
    if (!baseToken.symbol || !targetToken.symbol || poolShare === '')
      return null;
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
            <Tooltip
              placement="right"
              overlay={toLocale(
                'The share of the pool liquidity after you add.'
              )}
            >
              <i className="help" />
            </Tooltip>
          </div>
          <div className="info-value">
            {util.precisionInput(calc.mul(poolShare, 100,false),2)}%
          </div>
        </div>
      </div>
    );
  }

  _getExchangeData() {
    let { baseToken, targetToken, exchangeInfo, isEmptyPool } = this.state;
    let priceInfo,
      price = exchangeInfo.price;
    if (exchangeInfo.isReverse) {
      const temp = baseToken;
      baseToken = targetToken;
      targetToken = temp;
      price = calc.div(1, price);
      if (Number.isNaN(price)) price = '-';
      else price = util.precisionInput(price, 8);
    }
    if (isEmptyPool) {
      if (!baseToken.value || !targetToken.value) {
        priceInfo = `1${getDisplaySymbol(
          baseToken.symbol
        )} ≈ -${getDisplaySymbol(targetToken.symbol)}`;
      } else {
        let tempPrice = calc.div(targetToken.value, baseToken.value);
        if (Number.isNaN(tempPrice)) tempPrice = '-';
        else tempPrice = util.precisionInput(tempPrice, 8);
        priceInfo = `1${getDisplaySymbol(
          baseToken.symbol
        )} ≈ ${tempPrice}${getDisplaySymbol(targetToken.symbol)}`;
      }
      return { priceInfo, poolShare: 1 };
    }
    priceInfo = `1${getDisplaySymbol(
      baseToken.symbol
    )} ≈ ${price}${getDisplaySymbol(targetToken.symbol)}`;
    return { priceInfo, poolShare: exchangeInfo.pool_share };
  }

  revert = () => {
    let exchangeInfo = { ...this.state.exchangeInfo };
    exchangeInfo.isReverse = !exchangeInfo.isReverse;
    this.setState({ exchangeInfo });
  };

  confirmDialog = (showConfirmDialog = true) => {
    this.setState({ showConfirmDialog })
  }

  getBtn() {
    const { baseToken, targetToken,check } = this.state;
    let btn;
    if (!util.isLogined()) {
      btn = (
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="btn">{toLocale('Connect Wallet')}</div>
        </Link>
      );
    } else if (!baseToken.symbol || !targetToken.symbol)
      btn = <div className="btn disabled">{toLocale('Invalid Pair')}</div>;
    else if (!Number(baseToken.value) || !Number(targetToken.value)) {
      btn = <div className="btn disabled">{toLocale('Input an amount')}</div>;
    } else if (baseToken.error) {
      btn = (
        <div className="btn disabled">
          {toLocale('insufficient', {
            coin: getDisplaySymbol(baseToken.symbol),
          })}
        </div>
      );
    } else if (targetToken.error) {
      btn = (
        <div className="btn disabled">
          {toLocale('insufficient', {
            coin: getDisplaySymbol(targetToken.symbol),
          })}
        </div>
      );
    } else if(!check) {
      btn = (
        <div className="btn disabled">
          {toLocale('check protocol')}
        </div>
      );
    } else {
      btn = (
        <div className="btn" onClick={() => this.confirmDialog()}>{toLocale('Confirm')}</div>
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
    const { baseToken: _baseToken, targetToken: _targetToken } = this.state;
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
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendAddLiquidityTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.updateLiquidInfo4RealTime({
              data: {
                ...this.state,
                baseToken: { ..._baseToken, value: '' },
                targetToken: { ..._targetToken, value: '' },
              },
            });
          }
        })
        .catch((err) => reject(err));
    });
  };

  triggerConfirm = () => {
    this.confirmDialog(false);
    this.confirmInstance._onClick();
  }

  componentDidMount() {
    this.init(this.state);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps !== this.props) {
      const state = this._getDefaultState(nextProps);
      this.init(state);
    }
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
    const { baseToken, targetToken, isEmptyPool, userLiquidity, showConfirmDialog, check } = this.state;
    const exchangeInfo = this.getExchangeInfo();
    const btn = this.getBtn();
    const isEmpty = baseToken.symbol && targetToken.symbol && isEmptyPool;
    return (
      <>
        <div className="panel">
          <div className="panel-header">
            <i className="iconfont before" onClick={back}></i>
            {toLocale('Add Liquidity')}
          </div>
          <div className="add-liquidity-content">
            {baseToken.symbol && targetToken.symbol && 
            <div className="tip-info-warn">
              {toLocale('pool warn tip',{base:getDisplaySymbol(baseToken.symbol),quote: getDisplaySymbol(targetToken.symbol)})}
            </div>
            }
            {isEmpty && (
              <div className="tip-liquidity-empty">
                {toLocale('pool empty tip')}
              </div>
            )}
            <CoinItem
              label={toLocale('Input')}
              token={baseToken}
              onChange={this.changeBase}
              loadCoinList={this.loadBaseCoinList}
              disabledChangeCoin={disabledChangeCoin}
              max={true}
            />
            <div className="sep add-sep"></div>
            <CoinItem
              label={toLocale('Input')}
              token={targetToken}
              onChange={this.changeTarget}
              loadCoinList={this.loadTargetCoinList}
              disabledChangeCoin={disabledChangeCoin}
              max={true}
            />
            {exchangeInfo}
            <div className="tip-liquidity-check">
              <span className={classNames('check',{active: check})} onClick={this.checkProtocol}></span>
              <div className="protocol">{toLocale('info desc')}<a href={Config.okexchain.liquidity} target="_blank" rel="noopener noreferrer">{toLocale('go detail')}</a></div>
            </div>
            <div className="btn-wrap">{btn}</div>
          </div>
        </div>
        {userLiquidity && (
          <div className="panel">
            <InfoItem data={userLiquidity} reduce={this.reduce} />
          </div>
        )}
        <Dialog visible={showConfirmDialog} hideCloseBtn>
          <div className="panel-dialog-info">
            <div className="panel-dialog-info-title">
              {toLocale('Confirm Supply')}
              <span className="close" onClick={() => this.confirmDialog(false)}>
                ×
              </span>
            </div>
            <div className="panel-dialog-info-content">
              {toLocale('info desc')}
            </div>
            <div
              className='panel-dialog-info-footer'
            >
              <div className="btn1 cancel" onClick={() => this.confirmDialog(false)}>
                {toLocale('cancel')}
              </div>
                <div className="btn1" onClick={this.triggerConfirm}>
                  {toLocale('Confirm')}
                </div>
            </div>
          </div>
        </Dialog>
        <Confirm
          onClick={this.confirm}
          loadingTxt={toLocale('pending transactions')}
          successTxt={toLocale('transaction confirmed')}
          getRef={(instance) => (this.confirmInstance = instance)}
        ></Confirm>
      </>
    );
  }
}
