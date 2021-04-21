import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import InputNum from '_component/InputNum';
import classNames from 'classnames';
import util from '_src/utils/util';
import calc from '_src/utils/calc';
import SelectCoin from '../SelectCoin';
import { getCoinIcon, getDisplaySymbol } from '../../../utils/coinIcon';
import { channelsV3 } from '../../../utils/websocket';
import SwapContext from '../SwapContext';
import env from '../../../constants/env';

function mapStateToProps(state) {
  const { account4Swap } = state.SwapStore;
  return { account4Swap };
}

@connect(mapStateToProps)
export default class CoinItem extends React.Component {
  static contextType = SwapContext;

  static _cache = null;

  constructor() {
    super();
    this.state = {
      show: false,
    };
    this.currentSubscribe = null;
    this.hideCoinSelectList = this.hideCoinSelectList.bind(this);
    CoinItem._cache = null;
  }

  onInputChange = (value) => {
    const { token } = this.props;
    let error = false;
    if (this.props.max) {
      const max = this.getAvailable(true).replace(/,/g, '');
      if (util.compareNumber(max, value)) error = true;
    }
    this.props.onChange({ ...token, value: `${value}`, error }, true);
  };

  setMaxValue = () => {
    const { token } = this.props;
    const max = this.getAvailable(true).replace(/,/g, '');
    if (token.symbol.toLowerCase() === env.envConfig.token.base) {
      let value = calc.sub(max, env.envConfig.fee * 10, false);
      if (+value < 0) value = util.precisionInput(0, 8, false);
      this.onInputChange(value);
    } else this.onInputChange(max);
  };

  showCoinSelectList = async (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.show) return;
    if (CoinItem._cache) CoinItem._cache.hideCoinSelectList();
    CoinItem._cache = this;
    this.setState({ show: true });
  };

  hideCoinSelectList() {
    CoinItem._cache = null;
    this.setState({ show: false });
  }

  subscribe() {
    if (!this.context) return;
    const { symbol } = this.props.token;
    if (symbol && this.currentSubscribe !== symbol) {
      this.context.send(channelsV3.getBalance(symbol));
      if (this.currentSubscribe)
        this.context.stop(channelsV3.getBalance(this.currentSubscribe));
      this.currentSubscribe = symbol;
    }
  }

  componentDidMount() {
    this._bindEvent();
    this.subscribe();
  }

  componentWillUnmount() {
    this._bindEvent(false);
    if (!this.context) return;
    if (this.currentSubscribe) {
      this.context.stop(channelsV3.getBalance(this.currentSubscribe));
      this.currentSubscribe = null;
    }
  }

  componentDidUpdate() {
    this.subscribe();
  }

  _bindEvent(bind = true) {
    if (bind) {
      document.addEventListener('click', this.hideCoinSelectList, false);
    } else {
      document.removeEventListener('click', this.hideCoinSelectList, false);
    }
  }

  select = (coin) => {
    const { token } = this.props;
    this.hideCoinSelectList();
    this.props.onChange({ ...token, ...coin }, false);
  };

  getAvailable(original) {
    let {
      token: { available, symbol },
      account4Swap,
    } = this.props;
    const temp = account4Swap[symbol.toLowerCase()];
    if (temp) available = temp.available;
    if (original) return available;
    return util.precisionInput(available, 8);
  }

  render() {
    const {
      label,
      token: { symbol, value },
      loadCoinList,
      disabled,
      disabledChangeCoin,
      max,
    } = this.props;
    const available = this.getAvailable();
    this.props.token.error = false;
    if (
      max &&
      util.compareNumber(this.getAvailable(true).replace(/,/g, ''), value)
    ) {
      this.props.token.error = true;
    }
    const { show } = this.state;
    return (
      <div className="coin-item">
        <div className="coin-item-title">
          <div>{label}</div>
          <div className="txt">
            {toLocale('Balance')}:{available || '0.00000000'}
            {available && !disabled && (
              <span className="max" onClick={this.setMaxValue}>
                MAX
              </span>
            )}
          </div>
        </div>
        <div className="coin-item-content">
          <div className="input">
            <InputNum
              type="text"
              value={value}
              onChange={this.onInputChange}
              placeholder="0.00000000"
              disabled={disabled}
              precision={8}
            />
          </div>
          <div
            className={classNames('coin-select', {
              disabled: disabledChangeCoin,
            })}
            onClick={this.showCoinSelectList}
          >
            <img className="coin-icon" src={getCoinIcon(symbol)} />
            {symbol ? (
              <span className="text active">{getDisplaySymbol(symbol)}</span>
            ) : (
              <span className="text">{toLocale('Select a token')}</span>
            )}
            {!disabledChangeCoin && <i className="iconfont" />}
            {show && !disabledChangeCoin && (
              <SelectCoin onSelect={this.select} loadCoinList={loadCoinList} />
            )}
          </div>
        </div>
      </div>
    );
  }
}
