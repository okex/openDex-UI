import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { toLocale } from '_src/locale/react-locale';
import * as api from '../util/api';
import CoinDropdown from './CoinDropdown';
import AddLiquidity from '../AddLiquidity';
import Confirm from '../Confirm';

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
    if (!this.tokens) this.tokens = await api.createLiquidityTokens();
    if(!token) return this.tokens;
    return this.tokens.filter(d => d.symbol !== token.symbol);
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
    const {baseToken,targetToken} = this.state;
    const params = [baseToken.symbol,targetToken.symbol];
    console.log(params);
  };

  addLiquidity = () => {
    const { error: liquidity } = this.state;
    this.props.push({
      component: AddLiquidity,
      props: {
        liquidity,
        showLiquidity: false,
        disabledChangeCoin: !!liquidity,
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
              onClick={this.addLiquidity}
            >
              {toLocale('Error')}：{toLocale('Existed Pool')}
            </div>
          )}
          <div className="btn-wrap">
            {disabled ? (
              <div className="btn disabled">{toLocale('Create Liquidity')}</div>
            ) : (
              <Confirm onClick={this.confirm} loadingTxt={toLocale('pending transactions')} successTxt={toLocale('transaction confirmed')}>
                <div className="btn">
                  {toLocale('Create Liquidity')}
                </div>
              </Confirm>
            )}
          </div>
        </div>
      </div>
    );
  }
}
