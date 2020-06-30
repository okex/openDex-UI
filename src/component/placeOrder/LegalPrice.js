import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { calc } from '_component/okit';

function mapStateToProps(state) { // 绑定redux中相关state
  const { tickers } = state.Spot;
  const { legalObj } = state.Common;
  return { tickers, legalObj };
}

function mapDispatchToProps() { // 绑定action，以便向redux发送action
  return {};
}

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
class LegalPrice extends React.Component {
  static propTypes = {
    currency: PropTypes.string,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ])
  };
  static defaultProps = {
    currency: '',
    value: 0
  };

  render() {
    const {
      tickers, currency, value, legalObj
    } = this.props;
    // 计算人民币价格
    let legalPrice = '';
    if (tickers) {
      // btc_usdt、eth_usdt等，usdt_usdt不存在，取1
      // const tradeCurr = currency.toLowerCase();
      // const { price } = tickers[`${tradeCurr}_okb`] || { price: tradeCurr === 'okb' ? 1 : 0 };
      // const price = tickers[`${tradeCurr}_okb`] ? 1 : 0;
      const { rate, symbol, precision } = legalObj;
      if (value && rate) {
        const digit = precision || 0;
        const finalPrice = (calc.mul(calc.mul(value || 0, rate), 1) || 0).toFixed(digit);
        legalPrice = `≈${symbol || ''}${(calc.showFloorTruncation(finalPrice, digit))}`;
      }
    }
    return <span className="legal-price c-disabled fz12">{legalPrice}</span>;
  }
}
export default LegalPrice;
