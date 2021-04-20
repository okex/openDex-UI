import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { calc } from '_component/okit';

function mapStateToProps(state) {
  const { tickers } = state.Spot;
  const { legalObj } = state.Common;
  return { tickers, legalObj };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
class LegalPrice extends React.Component {
  static propTypes = {
    currency: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  static defaultProps = {
    currency: '',
    value: 0,
  };

  render() {
    const { tickers, currency, value, legalObj } = this.props;
    let legalPrice = '';
    if (tickers) {
      const { rate, symbol, precision } = legalObj;
      if (value && rate) {
        const digit = precision || 0;
        const finalPrice = (
          calc.mul(calc.mul(value || 0, rate), 1) || 0
        ).toFixed(digit);
        legalPrice = `≈${symbol || ''}${calc.showFloorTruncation(
          finalPrice,
          digit
        )}`;
      }
    }
    return <span className="legal-price c-disabled fz12">{legalPrice}</span>;
  }
}
export default LegalPrice;
