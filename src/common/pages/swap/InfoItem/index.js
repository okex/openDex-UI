import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon, getDisplaySymbol } from '../../../utils/coinIcon';
import Tooltip from '../../../component/Tooltip';
import calc from '_src/utils/calc';
import util from '_src/utils/util';

export default class InfoItem extends React.Component {
  render() {
    const { data, add, reduce } = this.props;
    let available = data.pool_token_coin.amount;
    return (
      <div className="poll-item">
        <div className="space-between poll-item-title">
          <div className="left title-img">
            <img src={getCoinIcon(data.base_pooled_coin.denom)} />
            <img src={getCoinIcon(data.quote_pooled_coin.denom)} />
            <span className="title-name">
              {getDisplaySymbol(data.base_pooled_coin.denom)}/
              {getDisplaySymbol(data.quote_pooled_coin.denom)}
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
            {toLocale('Amount')} {getDisplaySymbol(data.base_pooled_coin.denom)}
            /{getDisplaySymbol(data.quote_pooled_coin.denom)}
          </div>
          <div className="right">
            <Tooltip placement="right" overlay={toLocale('lp introduce')}>
              <i className="help" />
            </Tooltip>
            {toLocale('LP token/ratio')}
          </div>
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
