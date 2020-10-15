import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import * as api from '../util/api';
import CoinDropdown from './CoinDropdown';
import Message from '_src/component/Message';
import AddLiquidity from '../AddLiquidity';
export default class CreatLiquidity extends React.Component {
  constructor() {
    super();
    this.state = {
      baseToken: {
        symbol: '',
        available: '',
      },
      targetToken: {
        symbol: '',
        available: '',
      },
      error: null,
      disabled: true,
    };
  }

  async init() {
    const tokens = await this.getTokens();
    const baseToken = tokens.filter((d) => {
      const temp = d.symbol.toLowerCase();
      return temp === 'okt' || temp === 'tokt';
    })[0];
    if (baseToken) this.setState({ baseToken });
  }

  getTokens = async () => {
    if (!this.tokens) this.tokens = await api.createLiquidityTokens();
    return this.tokens;
  };

  componentDidMount() {
    this.init();
  }

  changeBase = (baseToken) => {
    const data = { ...this.state, baseToken };
    this.check(data);
  };

  changeTarget = (targetToken) => {
    const data = { ...this.state, targetToken };
    this.check(data);
  };

  async check(data) {
    const { baseToken, targetToken } = data;
    try {
      const temp = await api.tokenPair({
        base_token: baseToken.symbol,
        quote_token: targetToken.symbol,
      });
      data.disabled = !!temp;
      data.error = temp;
    } catch (e) {
      data.disabled = true;
    }
    this.setState(data);
  }

  confirm = async () => {
    if (this.confirm.loading) return;
    this.confirm.loading = true;
    const toast = Message.loading({
      content: toLocale('pending transactions'),
      duration: 0,
    });
    setTimeout(() => {
      toast.destroy();
      Message.success({
        content: toLocale('transaction confirmed'),
        duration: 3,
      });
      this.confirm.loading = false;
    }, 3000);
  };

  addLiquidity = () => {
    const { error: liquidity } = this.state;
    this.props.push({
      component: AddLiquidity,
      props: {
        liquidity,
        showLiquidity: false,
      },
    });
  };

  render() {
    const { back } = this.props;
    const { baseToken, targetToken, disabled, error } = this.state;
    return (
      <div className="panel">
        <div className="panel-header">
          <i className="iconfont before" onClick={back}></i>
          {toLocale('Input Pool')}
        </div>
        <div className="add-liquidity-content">
          <CoinDropdown
            token={baseToken}
            onChange={this.changeBase}
            loadCoinList={this.getTokens}
          />
          <div className="sep add-sep"></div>
          <CoinDropdown
            token={targetToken}
            onChange={this.changeTarget}
            loadCoinList={this.getTokens}
          />
          {error && (
            <div
              className="error-tip error-tip-link"
              onClick={this.addLiquidity}
            >
              {toLocale('Error')}：{toLocale('Existed Pool')}
            </div>
          )}
          <div className="btn-wrap">
            {disabled ? (
              <div className="btn disabled">{toLocale('Create Liquidity')}</div>
            ) : (
              <div className="btn" onClick={this.confirm}>
                {toLocale('Create Liquidity')}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}
