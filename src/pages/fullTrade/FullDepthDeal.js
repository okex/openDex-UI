import React from 'react';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import './FullDepthDeal.less';

import FullDepth from './FullDepth';
import FullTradeDeals from './FullTradeDeals';

function mapStateToProps(state) { // 绑定redux中相关state
  const { product, productObj } = state.SpotTrade;
  return { product, productObj };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FullDepthDeal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: 'depth', // 订单簿/最新交易
    };
  }

  componentWillUnmount() {
  }
  // 订单簿/最新交易 切换
  onChangeType = (type) => {
    return () => {
      this.setState({
        type
      });
    };
  };

  render() {
    const { type } = this.state;
    return (
      <div className="full-depth-deal">
        <ul className="depth-deal-tab-heads">
          <li className={type === 'depth' ? 'active' : ''} onClick={this.onChangeType('depth')}>
            {toLocale('spot.group')}
          </li>
          <li className={type === 'deals' ? 'active' : ''} onClick={this.onChangeType('deals')}>
            {toLocale('spot.deals.title')}
          </li>
        </ul>
        <div className="depth-deal-tab-container">
          <div className="depth-deal-tab-content" style={{ display: type === 'depth' ? 'block' : 'none' }}>
            <FullDepth />
          </div>
          <div className="depth-deal-tab-content" style={{ display: type === 'deals' ? 'block' : 'none' }}>
            <FullTradeDeals />
          </div>
        </div>
      </div>
    );
  }
}
