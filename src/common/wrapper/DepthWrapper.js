import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { calc } from '_component/okit';

import util from '../utils/util';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import * as FormActions from '../redux/actions/FormAction';
import * as OrderActions from '../redux/actions/OrderAction';
import Enum from '../utils/Enum';

function mapStateToProps(state) {
  const {
    product,
    account,
    depth,
    currencyTicker,
    productList,
    productObj,
  } = state.SpotTrade;
  const { FormStore, OrderStore } = state;
  return {
    product,
    account,
    depth,
    currencyTicker,
    productList,
    productObj,
    FormStore,
    OrderStore,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    orderActions: bindActionCreators(OrderActions, dispatch),
  };
}

const DepthWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotDepth extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.enum = {
        buy: Enum.placeOrder.type.buy,
        sell: Enum.placeOrder.type.sell,
      };
    }

    onChooseMergeType = (value) => {
      const { spotTradeActions, product } = this.props;
      window.OK_GLOBAL.productConfig.mergeType = value;
      spotTradeActions.fetchDepth(product);
    };

    onChooseOneDepthChange = (price, size, type) => {
      const {
        formActions,
        orderActions,
        productList,
        product,
        FormStore,
        OrderStore,
        account,
      } = this.props;
      if (product.indexOf('_') === -1) {
        return;
      }
      const FormStoreObj = FormStore ? util.cloneDeep(FormStore) : {};
      const input = FormStoreObj.inputObjFromDepth;
      let currConfig =
        productList && productList.filter((x) => x.product === product);
      currConfig = Object.keys(currConfig).length > 0 ? currConfig[0] : {};

      const priceTruncate = currConfig.max_price_digit || 4;
      const sizeTruncate = currConfig.max_size_digit || 4;

      const baseCurr = product.split('_')[1];
      const tradeCurr = product.split('_')[0];

      const tempAccount = {};
      tempAccount[baseCurr] = account[baseCurr];
      tempAccount[tradeCurr] = account[tradeCurr];
      formActions.updateWarning('');
      const { limit, advancedLimit } = Enum.placeOrder.strategyType;
      if (![limit, advancedLimit].includes(FormStore.strategyType)) {
        formActions.updateStrategyType(Enum.placeOrder.strategyType.limit);
      }
      if (OrderStore.entrustType !== Enum.order.entrustType.normal) {
        orderActions.updateEntrustType(Enum.order.entrustType.normal);
      }
      input.price = calc.floorTruncate(price, priceTruncate);
      let available = 0;
      if (type !== FormStoreObj.type) {
        if (type === this.enum.sell) {
          if (tempAccount[baseCurr]) {
            available = tempAccount[baseCurr].available;
            const total = calc.floorMul(price, size, priceTruncate);
            if (Number(available) > Number(total)) {
              input.amount = calc.floorTruncate(size, sizeTruncate);
              input.total = calc.floorTruncate(total, priceTruncate);
            } else {
              input.amount = calc.floorDiv(available, price, sizeTruncate);
              input.total = calc.floorTruncate(available, priceTruncate);
            }
          }
        } else if (tempAccount[tradeCurr]) {
          available = tempAccount[tradeCurr].available;
          if (Number(available) > Number(size)) {
            input.amount = calc.floorTruncate(size, sizeTruncate);
            input.total = calc.floorMul(price, input.amount, priceTruncate);
          } else {
            input.amount = calc.floorTruncate(available, sizeTruncate);
            input.total = calc.floorMul(price, input.amount, priceTruncate);
          }
        }
      } else {
        input.amount = '';
        input.total = '';
      }
      input.total = input.total > 0 ? input.total : '';
      input.amount = input.amount > 0 ? input.amount : '';
      formActions.updateInput(input);
      formActions.updateDepthInput({ ...input, type });
    };

    getAvg = (value, type) => {
      const { mergeType: ladder } = this.props;
      const ladderDigits = calc.digitLength(ladder);
      let ladderValue;
      const isBuy = type === 'buy';
      if (ladder >= 10) {
        ladderValue = isBuy
          ? Math.floor(calc.div(value, ladder)) * ladder
          : Math.ceil(calc.div(value, ladder)) * ladder;
      } else {
        ladderValue = Number(
          isBuy
            ? calc.floorTruncate(value, ladderDigits)
            : calc.ceilTruncate(value, ladderDigits)
        );
      }
      return ladderValue;
    };

    getListSource = () => {
      const { depth } = this.props;
      const { productConfig } = window.OK_GLOBAL;
      const priceTruncate = productConfig.max_price_digit || 4;
      const sizeTruncate = productConfig.max_size_digit || 4;
      let sum = '0';
      let sumValue = 0;
      let totalPriceValue = 0;
      const getDepthItem = (priceValue, amountValue, totalValue, type) => {
        const price = calc.showFloorTruncation(priceValue, priceTruncate);
        const amount = calc.showFloorTruncation(amountValue, sizeTruncate);
        sumValue = calc.add(amountValue, sumValue);
        sum = calc.showFloorTruncation(sumValue, sizeTruncate);
        totalPriceValue = calc.add(totalValue, totalPriceValue);
        const tooltipSum =
          sumValue < 0.001
            ? '0.001'
            : calc.showFloorTruncation(sumValue, sizeTruncate);
        const tooltipTotal =
          type === 'buy'
            ? calc.showFloorTruncation(totalPriceValue, priceTruncate)
            : calc.showCeilTruncation(totalPriceValue, priceTruncate);
        const avgValue = this.getAvg(calc.div(totalPriceValue, sumValue), type);
        const tooltipAvg =
          type === 'buy'
            ? calc.showFloorTruncation(avgValue, priceTruncate)
            : calc.showCeilTruncation(avgValue, priceTruncate);
        return {
          price,
          amount,
          sum,
          priceValue,
          amountValue,
          sumValue,
          tooltipSum,
          tooltipTotal,
          tooltipAvg,
        };
      };
      const buyList = depth.bids.map(([priceValue, amountValue, totalValue]) =>
        getDepthItem(priceValue, amountValue, totalValue, 'buy')
      );
      sum = '0';
      sumValue = 0;
      totalPriceValue = 0;
      const sellList = [];
      for (let i = depth.asks.length - 1; i >= 0; i--) {
        const [priceValue, amountValue, totalValue] = depth.asks[i];
        const depthItem = getDepthItem(
          priceValue,
          amountValue,
          totalValue,
          'sell'
        );
        sellList.push(depthItem);
      }
      sellList.reverse();
      return {
        sellList,
        buyList,
      };
    };

    getTickerSource = () => {
      const { currencyTicker } = this.props;
      const { productConfig } = window.OK_GLOBAL;
      const newTicker = { ...currencyTicker };
      let price = '--';
      if (currencyTicker) {
        if (+currencyTicker.price !== -1) {
          price = currencyTicker.price;
        }
      }
      price =
        price !== '--'
          ? calc.showFloorTruncation(price, productConfig.max_price_digit || 8)
          : '--';
      newTicker.price = price;
      return newTicker;
    };

    render() {
      const { product } = this.props;

      const listSource = this.getListSource();
      const tickerSource = this.getTickerSource();
      return (
        <Component
          product={product}
          listSource={listSource}
          isShowMerge={false}
          tickerSource={tickerSource}
          onChooseMergeType={this.onChooseMergeType}
          onChooseOneDepth={this.onChooseOneDepthChange}
        />
      );
    }
  }

  return SpotDepth;
};
export default DepthWrapper;
