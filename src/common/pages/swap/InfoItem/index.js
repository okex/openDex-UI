import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../util/coinIcon';
import { channelsV3 } from '../../../utils/websocket';
import SwapContext from '../SwapContext';
import calc from '_src/utils/calc';
import util from '_src/utils/util';

function mapStateToProps(state) {
  const { account4Swap } = state.SwapStore;
  return { account4Swap };
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
    const { data, add, reduce, account4Swap } = this.props;
    let available = data.pool_token_coin.amount;
    const temp = account4Swap[data.pool_token_coin.denom.toLowerCase()];
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
            {util.precisionInput(data.base_pooled_coin.amount, 8)}/
            {util.precisionInput(data.quote_pooled_coin.amount, 8)}
          </div>
          <div className="right">
            {util.precisionInput(available, 8)}/
            {calc.mul(util.precisionInput(data.pool_token_ratio, 8), 100)}%
          </div>
        </div>
      </div>
    );
  }
}
