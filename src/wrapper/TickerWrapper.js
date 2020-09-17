import React from 'react';
import { connect } from 'react-redux';
import util from '../utils/util';
import { calc } from '_component/okit';
import Cookies from 'js-cookie';

function mapStateToProps(state) {
  const { tickers } = state.Spot;
  const { legalObj } = state.Common;
  const { currencyTicker, product } = state.SpotTrade;
  return {
    legalObj,
    tickers,
    currencyTicker,
    product,
  };
}

function mapDispatchToProps() {
  return {};
}

const TickerWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class Ticker extends React.Component {
    calcLegal = (baseCurr) => {
      const { currencyTicker, legalObj } = this.props;
      const baseTicker = 1;

      let legalPrice = '--';
      const currencySymbol = legalObj.symbol || '';
      const digit = legalObj.precision || 0;
      const min = 1 / 10 ** digit;
      if (
        baseTicker &&
        legalObj.rate &&
        currencyTicker &&
        Number(currencyTicker.price) !== -1
      ) {
        legalPrice = calc.mul(baseTicker, currencyTicker.price);
        legalPrice = calc.mul(legalPrice, legalObj.rate);
        if (legalPrice >= min) {
          return (
            currencySymbol +
            calc.showFloorTruncation(legalPrice.toFixed(digit), digit)
          );
        }
        return `< ${currencySymbol}${min}`;
      }
      return currencySymbol + legalPrice;
    };

    render() {
      const { currencyTicker, product, legalObj } = this.props;
      const config = window.OK_GLOBAL.productConfig;
      const priceTruncate =
        'max_price_digit' in config ? config.max_price_digit : 8;
      const sizeTruncate =
        'max_size_digit' in config ? config.max_size_digit : 8;
      let price = '--';
      let open = 0;
      let low = 0;
      let high = 0;
      let volume = 0;
      let change = 0;
      let changePercentage = '--';
      if (currencyTicker) {
        if (+currencyTicker.price !== -1) {
          price = currencyTicker.price;
        }
        open = calc.showFloorTruncation(currencyTicker.open, priceTruncate);
        high = calc.showFloorTruncation(currencyTicker.high, priceTruncate);
        low = calc.showFloorTruncation(currencyTicker.low, priceTruncate);
        volume = calc.showFloorTruncation(currencyTicker.volume, sizeTruncate);
        change = currencyTicker.change;
        changePercentage = currencyTicker.changePercentage;
      }
      price =
        price !== '--' ? calc.showFloorTruncation(price, priceTruncate) : '--';
      const baseCurr =
        product && product.indexOf('_') > -1 ? product.split('_')[1] : '';
      const desc = 'OKEX.com';
      const newTitle = `${price.toString()} ${baseCurr.toUpperCase()}-${util.getShortName(
        product
      )} | ${desc}`;
      if (document.title !== newTitle) {
        document.title = newTitle;
      }
      const defaultLang = util.getSupportLocale(
        Cookies.get('locale') || 'en_US'
      );
      const isZhLang = defaultLang && defaultLang.indexOf('zh') > -1;

      const dataSource = {
        product,
        price,
        change,
        changePercentage,
        legalPrice: this.calcLegal(baseCurr),
        open,
        dayHigh: high,
        dayLow: low,
        volume,
        legalCurrency:
          (legalObj && isZhLang ? legalObj.displayName : legalObj.isoCode) ||
          '--',
      };
      return <Component dataSource={dataSource} />;
    }
  }

  return Ticker;
};
export default TickerWrapper;
