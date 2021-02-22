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
import Confirm from '../../../component/Confirm';
import util from '_src/utils/util';
import { getLiquidityCheck, liquidityCheck } from '../util';
import Config from '../../../constants/Config';
import { getDeadLine4sdk } from '../util';
import Message from '_src/component/Notification';
import Tooltip from '../../../component/Tooltip';
import { validateTxs } from '_src/utils/client';
import { getDisplaySymbol } from '../../../utils/coinIcon';
import { Dialog } from '../../../component/Dialog';
import classNames from 'classnames';
import env from '../../../constants/env';

function mapStateToProps(state) {
  const { setting } = state.SwapStore;
  const { okexchainClient } = state.Common;
  return { okexchainClient, setting };
}

@withRouter
@connect(mapStateToProps)
export default class AddLiquidity extends React.Component {
  constructor(props) {
    super(props);
    this.confirmRef = React.createRef();
    this.state = this._getDefaultState(props);
    this.trading = false;
    this.debounceUpdateLiquidInfo4RealTime = util.debounce(this.updateLiquidInfo4RealTime);
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
        liquidity: '1',
      },
      liquidity: props.liquidity,
      userLiquidity: props.userLiquidity,
      isEmptyPool,
      showConfirmDialog: false,
      active: false,
      check: getLiquidityCheck()
    };
  }

  _process(liquidity) {
    let baseSymbol = env.envConfig.token.base,
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
    this.setState((state) => {
      liquidityCheck(state.check ? '' : 'true');
      return {
        check: !state.check,
      };
    });
  };

  changeBase = (token, inputChanged) => {
    const { baseToken, targetToken, isEmptyPool } = this.state;
    const data = {
      ...this.state,
      baseToken: { ...baseToken, ...token },
      targetToken: { ...targetToken },
    };
    if (!isEmptyPool && !data.baseToken.value) data.targetToken.value = '';
    this.setState(data, () => {
      const temp = {
        baseToken: { ...this.state.baseToken },
        targetToken: { ...this.state.targetToken },
        exchangeInfo: { ...this.state.exchangeInfo },
      };
      if(inputChanged) this.debounceUpdateLiquidInfo4RealTime({ data:temp, inputChanged });
      else this.updateLiquidInfo4RealTime({ data:temp, inputChanged });
    });
  };

  changeTarget = (token, inputChanged) => {
    const { baseToken, targetToken } = this.state;
    const data = {
      ...this.state,
      targetToken: { ...targetToken, ...token },
      baseToken: { ...baseToken },
    };
    this.setState(data, () => {
      const temp = {
        baseToken: { ...this.state.baseToken },
        targetToken: { ...this.state.targetToken },
        exchangeInfo: { ...this.state.exchangeInfo },
      };
      if(inputChanged) this.debounceUpdateLiquidInfo4RealTime({ data:temp, key: 'targetToken', inputChanged });
      else this.updateLiquidInfo4RealTime({ data:temp, key: 'targetToken', inputChanged });
    });
    
  };

  _clearTimer() {
    if (this.updateLiquidInfo4RealTime.interval) {
      clearInterval(this.updateLiquidInfo4RealTime.interval);
      this.updateLiquidInfo4RealTime.interval = null;
    }
  }

  updateLiquidInfo4RealTime = async ({
    data,
    key = 'baseToken',
    time = 3000,
    inputChanged = true,
    check = true
  }) => {
    this._clearTimer();
    await this.updateInfo(data, key, true, inputChanged, check);
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
      const target = tokens.filter(
        (d) => d.symbol === targetToken.symbol
      )[0];
      if (target) data.targetToken = { ...targetToken, ...target };
    }
    this.updateLiquidInfo4RealTime({ data, check: false });
  };

  async updateInfo(data, key, errTip = false, inputChanged = true, check = true) {
    try {
      await this._check(data, check);
      await this._updateExchangePrice(data);
      await this._updateExchange(data, key, inputChanged);
      const { showConfirmDialog, baseToken, targetToken } = this.state;
      if (
        showConfirmDialog &&
        (baseToken.value !== data.baseToken.value ||
          targetToken.value !== data.targetToken.value)
      )
        data.active = true;
    } catch (e) {
      if (errTip) {
        Message.error({
          content: e.message || toLocale(`error.code.${e.code}`),
          duration: 3,
        });
      }
    }
  }

  async _check(data, check) {
    if(!check) return;
    const { baseToken, targetToken } = data;
    let {liquidity, userLiquidity} = await api.getLiquidity(baseToken.symbol,targetToken.symbol);
    const { isEmptyPool } = this._process(liquidity);
    data.liquidity = liquidity;
    data.userLiquidity = userLiquidity;
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
        calc.div(quote_pooled_coin.amount, base_pooled_coin.amount, false),
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
        const {
          base_token_amount = '',
          pool_share = '',
          liquidity = '',
        } = await api.addInfo({
          base_token: _targetToken.symbol,
          quote_token_amount: _baseToken.value + _baseToken.symbol,
          value: _baseToken.value,
        });
        _targetToken.value = _baseToken.value ? base_token_amount : '';
        exchangeInfo.pool_share = pool_share;
        exchangeInfo.liquidity = liquidity;
      } else {
        _targetToken.value = '';
        exchangeInfo.pool_share = 0;
        exchangeInfo.liquidity = '';
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

  getExchangeInfo(isConfirm) {
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
          </div>
        </div>
        <div className="info">
          <div className="info-name">
            {toLocale('Pool share')}
            {!isConfirm && (
              <Tooltip
                placement="right"
                overlay={toLocale(
                  'The share of the pool liquidity after you add.'
                )}
              >
                <i className="help" />
              </Tooltip>
            )}
          </div>
          <div className="info-value">
            {util.precisionInput(calc.mul(poolShare, 100, false), 2)}%
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
        )} ≈ ${tempPrice} ${getDisplaySymbol(targetToken.symbol)}`;
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
    if (showConfirmDialog && this.trading) return;
    this.setState({ showConfirmDialog, active: false });
  };

  getBtn() {
    const { baseToken, targetToken, check } = this.state;
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
    } else if (!check) {
      btn = <div className="btn disabled">{toLocale('check protocol')}</div>;
    } else {
      btn = (
        <div className="btn" onClick={() => this.confirmDialog()}>
          {toLocale('Confirm Supply btn')}
        </div>
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

  getMinimumReceived(value, precision = 16) {
    const {
      setting: { slippageTolerance },
    } = this.props;
    const { isEmptyPool } = this.state;
    const tolerance = isEmptyPool ? 1 : 1 - slippageTolerance * 0.01;
    return util.precisionInput(calc.mul(value, tolerance), precision);
  }

  confirm = () => {
    const {
      baseToken: _baseToken,
      targetToken: _targetToken,
      exchangeInfo,
    } = this.state;
    let { baseToken, targetToken } = this._exchangeTokenData();
    const { okexchainClient } = this.props;
    const params = [
      this.getMinimumReceived(exchangeInfo.liquidity).replace(/,/g,''),
      util.precisionInput(baseToken.value).replace(/,/g,''),
      baseToken.symbol,
      util.precisionInput(targetToken.value).replace(/,/g,''),
      targetToken.symbol,
      getDeadLine4sdk(),
      '',
      null,
    ];
    return new Promise((resolve, reject) => {
      this.trading = true;
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
        .catch((err) => reject(err))
        .finally(() => {
          this.trading = false;
        });
    });
  };

  cancel = () => {
    this.trading = false;
  }

  triggerConfirm = () => {
    this.confirmDialog(false);
    this.confirmInstance._onClick();
  };

  componentWillUnmount() {
    this._clearTimer();
  }

  componentDidMount() {
    this.init(this.state);
  }

  reduce = (liquidity) => {
    this.props.history.push(`${PageURL.reduceLiquidityPage}/${liquidity.base_pooled_coin.denom}/${liquidity.quote_pooled_coin.denom}`);
  };

  render() {
    const { disabledChangeCoin = false } = this.props;
    const {
      baseToken,
      targetToken,
      isEmptyPool,
      userLiquidity,
      showConfirmDialog,
      check,
      active,
    } = this.state;
    const liquidity = this.state.exchangeInfo.liquidity;
    const exchangeInfo = this.getExchangeInfo();
    const exchangeInfoConfirm = this.getExchangeInfo(true);
    const btn = this.getBtn();
    const isEmpty = baseToken.symbol && targetToken.symbol && isEmptyPool;
    const {
      setting: { slippageTolerance },
    } = this.props;
    let lpBaseSymbol = baseToken.symbol, lpTargetSymbol = targetToken.symbol;
    if(baseToken.symbol > targetToken.symbol) {
      lpBaseSymbol = lpTargetSymbol;
      lpTargetSymbol = baseToken.symbol;
    }
    return (
      <>
        <div className="panel">
          <div className="panel-header">
            <i className="iconfont before" onClick={() => this.props.history.goBack()}></i>
            {toLocale('Add Liquidity')}
          </div>
          <div className="add-liquidity-content">
            {baseToken.symbol && targetToken.symbol && (
              <div className="tip-info-warn size14">
                {toLocale('pool warn tip', {
                  base: getDisplaySymbol(baseToken.symbol),
                  quote: getDisplaySymbol(targetToken.symbol),
                })}
              </div>
            )}
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
              <span
                className={classNames('check', { active: check })}
                onClick={this.checkProtocol}
              ></span>
              <div className="protocol">
                {toLocale('info desc')}
                {Config.okexchain.liquidity && 
                  <a
                    href={Config.okexchain.liquidity}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {toLocale('go detail')}
                  </a>
                }
              </div>
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
              <div className="panel-confirm">
                <div className="coin-exchange-detail">
                  <div className="info">
                    <div className="info-name">
                      {toLocale(
                        isEmptyPool ? 'empty add list' : 'You will receive'
                      )}
                    </div>
                  </div>
                  <div className="info">
                    <div className="info-name lg">
                      {this.getMinimumReceived(liquidity, 8)}
                    </div>
                  </div>
                  <div className="info">
                    <div className="info-name">
                      {toLocale('pool tokens', {
                        base: getDisplaySymbol(lpBaseSymbol),
                        quote: getDisplaySymbol(lpTargetSymbol),
                      })}
                    </div>
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
                  {toLocale('liquidity warn tip', { num: slippageTolerance })}
                </div>
                {exchangeInfoConfirm}
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
                {toLocale('Confirm Supply btn')}
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
      </>
    );
  }
}
