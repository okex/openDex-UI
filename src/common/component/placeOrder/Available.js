import { connect } from 'react-redux';
import React from 'react';
import PropTypes from 'prop-types';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import { getDisplaySymbol } from '_src/utils/coinIcon';
import Fee from './Fee';
import Enum from '../../utils/Enum';
import util from '../../utils/util';

function mapStateToProps(state) {
  const { FormStore, SpotTrade } = state;
  const { currencyTicker } = SpotTrade;
  return { FormStore, currencyTicker };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
class Available extends React.Component {
  static propTypes = {
    asset: PropTypes.object,
    currencyTicker: PropTypes.object,
  };

  static defaultProps = {
    asset: {},
    currencyTicker: {
      price: 0,
    },
  };

  renderFees = () => {
    if (window.isBroker) {
      return <Fee />;
    }
    let feeUrl = '/pages/products/fees.html';
    return (
      <div className="spot-fee-link">
        <a rel="noopener noreferrer" href={feeUrl} target="_blank">
          <Icon
            className="icon-ratestandard"
            style={{ fontSize: '12px', marginRight: '5px' }}
          />
          {toLocale('spot.fee')}
        </a>
      </div>
    );
  };

  render() {
    const { asset, currencyTicker, type } = this.props;
    const { baseCurr, baseAvailable, tradeCurr, tradeAvailable } = asset;
    const tradeSymbol = util.getSymbolShortName(tradeCurr);
    const { tradeType, productConfig } = window.OK_GLOBAL;
    const currencyPrice =
      currencyTicker.price && currencyTicker.price >= 0
        ? Number(currencyTicker.price)
        : 0;
    const priceTruncate =
      'max_price_digit' in productConfig ? productConfig.max_price_digit : 8;
    const sizeTruncate =
      'max_size_digit' in productConfig ? productConfig.max_size_digit : 8;
    const initPrice = productConfig.price > 0 ? Number(productConfig.price) : 1;
    const displayAvailBuy =
      currencyPrice > 0
        ? calc.showFloorTruncation(baseAvailable / currencyPrice, sizeTruncate)
        : calc.showFloorTruncation(baseAvailable / initPrice, sizeTruncate);
    const displayAvailSell =
      currencyPrice > 0
        ? calc.showFloorTruncation(
            tradeAvailable * currencyPrice,
            priceTruncate
          )
        : calc.showFloorTruncation(tradeAvailable * initPrice, priceTruncate);

    const displayBaseAvail = calc.showFloorTruncation(
      baseAvailable,
      priceTruncate
    );
    const displayTradeAvail = calc.showFloorTruncation(
      tradeAvailable,
      sizeTruncate
    );

    if (tradeType === Enum.tradeType.normalTrade) {
      if (type === Enum.placeOrder.type.buy) {
        return (
          <div className="spot-availadle">
            <span className="float-left">
              <span className="spot-availadle-desc">
                {`${toLocale('spot.ava.buy')}
                   ${tradeSymbol}:
                  `}
              </span>
              <span className="spot-asset-buy">{displayAvailBuy}</span>
            </span>
          </div>
        );
      }
      return (
        <div className="spot-availadle">
          <span className="float-left">
            <span className="spot-availadle-desc">
              {`${toLocale('spot.ava.sell')}
                 ${baseCurr}:
                `}
            </span>
            <span className="spot-asset-buy">{displayAvailSell}</span>
          </span>
        </div>
      );
    }
    if (tradeType === Enum.tradeType.fullTrade) {
      if (type === Enum.placeOrder.type.buy) {
        return (
          <div className="spot-availadle">
            <span className="float-left">
              <span className="spot-availadle-desc">
                {toLocale('spot.ava.buy')} {getDisplaySymbol(tradeSymbol)}:
              </span>
              <span className="spot-asset-buy"> {displayAvailBuy}</span>
            </span>
            <span className="float-right">
              <span className="spot-availadle-desc">
                {getDisplaySymbol(baseCurr)}
                {toLocale('spot.bills.balance')}
                {': '}
              </span>
              <span className="spot-asset-buy">{displayBaseAvail}</span>
            </span>
          </div>
        );
      }
      return (
        <div className="spot-availadle">
          <span className="float-left">
            <span className="spot-availadle-desc">
              {`${toLocale('spot.ava.sell')} ${getDisplaySymbol(baseCurr)}: `}
            </span>
            <span className="spot-asset-sell"> {displayAvailSell}</span>
          </span>
          <span className="float-right">
            <span className="spot-availadle-desc">
              {getDisplaySymbol(tradeCurr)}
              {toLocale('spot.bills.balance')}
              {': '}
            </span>
            <span className="spot-asset-sell">{displayTradeAvail}</span>
          </span>
        </div>
      );
    }
    return null;
  }
}
export default Available;
