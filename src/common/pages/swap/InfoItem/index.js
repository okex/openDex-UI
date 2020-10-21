import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import { getCoinIcon } from '../util/coinIcon';
import { wsV3, channelsV3 } from '../../../utils/websocket';

export default class InfoItem extends React.Component {
  componentDidMount() {
    const {
      data: { pool_token_coin: denom },
    } = this.props;
    wsV3.send(channelsV3.getBalance(denom));
  }

  componentWillUnmount() {
    const {
      data: { pool_token_coin: denom },
    } = this.props;
    wsV3.stop(channelsV3.getBalance(denom));
  }

  render() {
    const { data, add, reduce } = this.props;
    return (
      <div className="poll-item">
        <div className="space-between poll-item-title">
          <div className="left title-img">
            <img src={getCoinIcon(data.base_pooled_coin.denom)} />
            <img src={getCoinIcon(data.quote_pooled_coin.denom)} />
            <span className="title-name">
              {data.base_pooled_coin.denom}/{data.quote_pooled_coin.denom}
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
            {toLocale('Amount')} {data.base_pooled_coin.denom}/
            {data.quote_pooled_coin.denom}
          </div>
          <div className="right">{toLocale('LP token/ratio')}</div>
        </div>
        <div className="space-between poll-item-info">
          <div className="left">
            {data.base_pooled_coin.amount}/{data.quote_pooled_coin.amount}
          </div>
          <div className="right">
            {data.pool_token_coin.amount}/{data.pool_token_ratio * 100}%
          </div>
        </div>
      </div>
    );
  }
}
