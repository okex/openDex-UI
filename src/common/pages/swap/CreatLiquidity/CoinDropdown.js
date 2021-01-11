import React from 'react';
import classNames from 'classnames';
import SelectCoin from '../SelectCoin';
import { getCoinIcon } from '../../../utils/coinIcon';
import { toLocale } from '_src/locale/react-locale';

export default class CoinDropdown extends React.Component {
  static _cache = null;

  constructor() {
    super();
    this.state = {
      show: false,
    };
    this.hideCoinSelectList = this.hideCoinSelectList.bind(this);
    CoinDropdown._cache = null;
  }

  showCoinSelectList = async (e) => {
    e.nativeEvent.stopImmediatePropagation();
    if (this.state.show) return;
    if (CoinDropdown._cache) CoinDropdown._cache.hideCoinSelectList();
    CoinDropdown._cache = this;
    this.setState({ show: true });
  };

  hideCoinSelectList() {
    CoinDropdown._cache = null;
    this.setState({ show: false });
  }

  componentDidMount() {
    this._bindEvent();
  }

  componentWillUnmount() {
    this._bindEvent(false);
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
      token: { symbol },
      loadCoinList,
    } = this.props;
    const { show } = this.state;
    return (
      <div className="coin-dropdown" onClick={this.showCoinSelectList}>
        <div className="coin-select">
          <img className="coin-icon" src={getCoinIcon(symbol)} />
          <span className={classNames('text', { active: symbol })}>
            {symbol.toUpperCase() || toLocale('Select a token')}
          </span>
          <i className="iconfont" />
        </div>
        {show && (
          <SelectCoin onSelect={this.select} loadCoinList={loadCoinList} />
        )}
      </div>
    );
  }
}
