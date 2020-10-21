import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import InputNum from '_component/InputNum';
import SelectCoin from '../SelectCoin';
import { getCoinIcon } from '../util/coinIcon';
import classNames from 'classnames';
import { wsV3,channelsV3 } from '../../../utils/websocket';

export default class CoinItem extends React.Component {

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
    this.props.onChange({ ...token, value });
  };

  setMaxValue = () => {
    const { token } = this.props;
    this.onInputChange(token.available);
  };

  showCoinSelectList = async (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.show) return;
    if(CoinItem._cache) CoinItem._cache.hideCoinSelectList();
    CoinItem._cache = this;
    this.setState({ show: true });
  };

  hideCoinSelectList() {
    CoinItem._cache = null;
    this.setState({ show: false });
  }
  
  subscribe() {
    const {symbol} = this.props.token;
    if(symbol && this.currentSubscribe !== symbol) {
      wsV3.send(channelsV3.getBalance(symbol));
      if(this.currentSubscribe) wsV3.stop(this.currentSubscribe);
      console.log('subscribe',symbol,'unsubscribe',this.currentSubscribe);
      this.currentSubscribe = symbol;
    }
  }

  componentDidMount() {
    this._bindEvent();
    this.subscribe();
  }

  componentWillUnmount() {
    this._bindEvent(false);
    if(this.currentSubscribe) {
      wsV3.stop(channelsV3.getBalance(this.currentSubscribe));
      console.log('unsubscribe',this.currentSubscribe);
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
    this.props.onChange({ ...token, ...coin });
  };

  render() {
    const {
      label,
      token: { available, symbol, value },
      loadCoinList,
      disabled,
      disabledChangeCoin,
    } = this.props;
    const { show } = this.state;
    return (
      <div className="coin-item">
        <div className="coin-item-title">
          <div>{label}</div>
          <div className="txt">
            {toLocale('Balance')}: {available || '0.000000'}
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
              placeholder="0.000000"
              disabled={disabled}
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
              <span className="text active">{symbol}</span>
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
