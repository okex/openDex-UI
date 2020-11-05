import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import { withRouter, Link } from 'react-router-dom';
import * as api from '../util/api';
import CoinDropdown from './CoinDropdown';
import AddLiquidity from '../AddLiquidity';
import Confirm from '../Confirm';
import { validateTxs } from '_src/utils/client';
import util from '_src/utils/util';

function mapStateToProps(state) {
  const { okexchainClient } = state.Common;
  return { okexchainClient };
}
@withRouter
@connect(mapStateToProps)
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

  getTokens = async (token) => {
    if (!this.tokens) {
      const data = await api.createLiquidityTokens();
      this.tokens = data ? data.tokens : [];
    }
    if (!token) return this.tokens;
    return this.tokens.filter((d) => d.symbol !== token.symbol);
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

  confirm = () => {
    const { baseToken, targetToken } = this.state;
    const { okexchainClient } = this.props;
    const params = [baseToken.symbol, targetToken.symbol, '', null];
    return new Promise((resolve, reject) => {
      okexchainClient
        .sendCreateExchangeTransaction(...params)
        .then((res) => {
          resolve(res);
          if (validateTxs(res)) {
            this.addLiquidity({
              base_pooled_coin: {
                amount: '0.00000000',
                denom: baseToken.symbol,
              },
              quote_pooled_coin: {
                amount: '0.00000000',
                denom: targetToken.symbol,
              },
            });
          }
        })
        .catch((err) => reject(err));
    });
  };

  addLiquidity = (liquidity) => {
    if (!liquidity) liquidity = this.state.error;
    this.props.push({
      component: AddLiquidity,
      props: {
        liquidity,
        showLiquidity: false,
        disabledChangeCoin: !!liquidity,
      },
    });
  };

  getBtn() {
    const {disabled} = this.state;
    let btn;
    if (!util.isLogined()) {
      btn = (
        <Link to={getLangURL(PageURL.walletCreate)}>
          <div className="btn">{toLocale('Connect Wallet')}</div>
        </Link>
      );
    } else if(disabled) {
      btn = <div className="btn disabled">{toLocale('Create Liquidity')}</div>
    } else {
      btn = <Confirm
        onClick={this.confirm}
        loadingTxt={toLocale('pending transactions')}
        successTxt={toLocale('transaction confirmed')}
      >
        <div className="btn">{toLocale('Create Liquidity')}</div>
      </Confirm>
    }
    return btn;
  }

  render() {
    const { back } = this.props;
    const { baseToken, targetToken, error } = this.state;
    const btn = this.getBtn();
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
            loadCoinList={() => this.getTokens(targetToken)}
          />
          <div className="sep add-sep"></div>
          <CoinDropdown
            token={targetToken}
            onChange={this.changeTarget}
            loadCoinList={() => this.getTokens(baseToken)}
          />
          {error && (
            <div
              className="error-tip error-tip-link"
              onClick={() => this.addLiquidity()}
            >
              {toLocale('Error')}：{toLocale('Existed Pool')}
            </div>
          )}
          <div className="btn-wrap">{btn}</div>
        </div>
      </div>
    );
  }
}
