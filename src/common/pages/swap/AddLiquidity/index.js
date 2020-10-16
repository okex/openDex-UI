import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { toLocale } from '_src/locale/react-locale';
import CoinItem from '../CoinItem';
import calc from '_src/utils/calc';
import util from '_src/utils/util';
import * as api from '../util/api';
import Message from '_src/component/Message';
import InfoItem from '../InfoItem';
import ReduceLiquidity from '../ReduceLiquidity';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
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
      liquidity:props.liquidity,
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
    const { native_token = '', tokens = [] } = await api.tokens({
      support_route: false,
    });
    const token = baseToken.symbol || native_token;
    const base = tokens.filter((d) => d.symbol === token)[0];
    const data = { ...this.state };
    if (base) data.baseToken = { ...baseToken, ...base };
    if (targetToken.symbol) {
      const { tokens: targetTokens } = await api.tokens({
        symbol: token,
        support_route: false,
      });
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
      const temp = data.liquidity || await api.tokenPair({
        base_token: baseToken.symbol,
        quote_token: targetToken.symbol,
      });
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
      if(baseToken.value) {
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
    const { tokens = [] } = await api.tokens({ support_route: false });
    const { targetToken } = this.state;
    if(!targetToken.symbol) return tokens;
    return tokens.filter(d => d.symbol !== targetToken.symbol);
  };

  loadTargetCoinList = async () => {
    const {
      baseToken: { symbol },
    } = this.state;
    const { tokens = [] } = await api.tokens({ symbol, support_route: false });
    return tokens.filter(d => d.symbol !== symbol);
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
        <div className="btn" onClick={util.debounce(this.confirm, 100)}>
          {toLocale('Confirm')}
        </div>
      );
    }
    return btn;
  }

  _exchangeTokenData() {
    let {baseToken,targetToken} = this.state;
    if(baseToken.symbol && targetToken.symbol) {
      const temp = baseToken;
      if(baseToken.symbol > targetToken.symbol) {
        baseToken = targetToken;
        targetToken = temp;
      }
    }
    return {baseToken,targetToken}
  }

  confirm = async () => {
    if (this.confirm.loading) return;
    let {baseToken,targetToken} = this._exchangeTokenData();
    this.confirm.loading = true;
    const toast = Message.loading({
      content: toLocale('pending transactions'),
      duration: 0,
    });
    const params = {
      'min-liquidity':0,
      quote_amount:`${targetToken.value}${targetToken.symbol}`,
      max_base_amount:`${baseToken.value}${baseToken.symbol}`,
    }
    console.log(params);
    setTimeout(() => {
      toast.destroy();
      Message.success({
        content: toLocale('transaction confirmed'),
        duration: 3,
      });
      this.confirm.loading = false;
    }, 3000);
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
    const {
      back,
      disabledChangeCoin = false,
    } = this.props;
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
