import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../util/coinIcon';
import { channelsV3 } from '../../../utils/websocket';
import SwapContext from '../SwapContext';
import calc from '_src/utils/calc';

function mapStateToProps(state) {
  const { account } = state.SwapStore;
  return { account };
}

@connect(mapStateToProps)
export default class InfoItem extends React.Component {
  static contextType = SwapContext;

  componentDidMount() {
    const {
      data: {
        pool_token_coin: { denom },
      },
    } = this.props;
    this.context && this.context.send(channelsV3.getBalance(denom));
  }

  componentWillUnmount() {
    const {
      data: {
        pool_token_coin: { denom },
      },
    } = this.props;
    this.context && this.context.stop(channelsV3.getBalance(denom));
  }

  render() {
    const { data, add, reduce, account } = this.props;
    let available = data.pool_token_coin.amount;
    const temp = account[data.pool_token_coin.denom.toLowerCase()];
    if (temp) available = temp.available;
    return (
      <div className="poll-item">
        <div className="space-between poll-item-title">
          <div className="left title-img">
            <img src={getCoinIcon(data.base_pooled_coin.denom)} />
            <img src={getCoinIcon(data.quote_pooled_coin.denom)} />
            <span className="title-name">
              {data.base_pooled_coin.denom.toUpperCase()}/
              {data.quote_pooled_coin.denom.toUpperCase()}
            </span>
          </div>
          <div className="right title-opt">
            {add && (
              <div className="opt" onClick={() => add(data)}>
                + {toLocale('Add')}
              </div>
            )}
            {reduce && (
              <div className="opt" onClick={() => reduce(data)}>
                - {toLocale('Reduce')}
              </div>
            )}
          </div>
        </div>
        <div className="space-between poll-item-txt">
          <div className="left">
            {toLocale('Amount')} {data.base_pooled_coin.denom.toUpperCase()}/
            {data.quote_pooled_coin.denom.toUpperCase()}
          </div>
          <div className="right">{toLocale('LP token/ratio')}</div>
        </div>
        <div className="space-between poll-item-info">
          <div className="left">
            {data.base_pooled_coin.amount.toUpperCase()}/
            {data.quote_pooled_coin.amount.toUpperCase()}
          </div>
          <div className="right">
            {available}/{calc.mul(data.pool_token_ratio, 100)}%
          </div>
        </div>
      </div>
    );
  }
}
