import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
import { calc } from '_component/okit';

import util from '../utils/util';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import * as FormActions from '../redux/actions/FormAction';
import * as OrderActions from '../redux/actions/OrderAction';
import Enum from '../utils/Enum';

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    product, account, depth, currencyTicker, productList, productObj
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
    OrderStore
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
    formActions: bindActionCreators(FormActions, dispatch),
    orderActions: bindActionCreators(OrderActions, dispatch)
  };
}

const DepthWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
  class SpotDepth extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.enum = {
        buy: Enum.placeOrder.type.buy,
        sell: Enum.placeOrder.type.sell
      };
    }

    // 选择某一档合并深度
    onChooseMergeType = (value) => {
      const { spotTradeActions, product } = this.props;
      window.OK_GLOBAL.productConfig.mergeType = value;
      spotTradeActions.fetchDepth(product);
    };

    // 选择⑤档深度的某一档 获得价格与数量 并填入form
    onChooseOneDepthChange = (price, size, type) => {
      const {
        formActions, orderActions, productList, product, FormStore, OrderStore, account
      } = this.props;
      if (product.indexOf('_') === -1) {
        return;
      }
      const FormStoreObj = FormStore ? util.cloneDeep(FormStore) : {};
      const input = FormStoreObj.inputObjFromDepth;
      let currConfig = productList && productList.filter((x) => {
        return x.product === product;
      });
      currConfig = Object.keys(currConfig).length > 0 ? currConfig[0] : {};

      const priceTruncate = currConfig.max_price_digit || 4;
      const sizeTruncate = currConfig.max_size_digit || 4;

      const baseCurr = product.split('_')[1];
      const tradeCurr = product.split('_')[0];

      const tempAccount = {};
      // 币币
      tempAccount[baseCurr] = account[baseCurr];
      tempAccount[tradeCurr] = account[tradeCurr];
      // 强制改为限价单
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
        // 如果当前是买入：则点击卖盘进行吃单；点击买盘只带价格，同时清空数量和金额。反之同理
        if (type === this.enum.sell) {
          // 买入
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
          // 卖出
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
      // 更新输入
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
        ladderValue = isBuy ? (Math.floor(calc.div(value, ladder)) * ladder) :
          (Math.ceil(calc.div(value, ladder)) * ladder);
      } else {
        ladderValue = Number(isBuy ? calc.floorTruncate(value, ladderDigits) : calc.ceilTruncate(value, ladderDigits));
      }
      return ladderValue;
    };
    getListSource = () => {
      const { depth } = this.props;
      const { productConfig } = window.OK_GLOBAL;
      // max_price_digit 可能为 0
      const priceTruncate = productConfig.max_price_digit || 4;
      const sizeTruncate = productConfig.max_size_digit || 4;
      // const sizeTruncate = 3;
      // 在点击某一条数据，进行吃单时，也要计算sum（累计量），所以不做needSum检查
      let sum = '0';
      let sumValue = 0;
      let totalPriceValue = 0;
      const getDepthItem = (priceValue, amountValue, totalValue, type) => {
        const price = calc.showFloorTruncation(priceValue, priceTruncate);
        const amount = calc.showFloorTruncation(amountValue, sizeTruncate);
        sumValue = calc.add(amountValue, sumValue);
        sum = calc.showFloorTruncation(sumValue, sizeTruncate);
        totalPriceValue = calc.add(totalValue, totalPriceValue);
        const tooltipSum = sumValue < 0.001 ? '0.001' : calc.showFloorTruncation(sumValue, sizeTruncate);
        const tooltipTotal = type === 'buy' ? calc.showFloorTruncation(totalPriceValue, priceTruncate) : calc.showCeilTruncation(totalPriceValue, priceTruncate);
        const avgValue = this.getAvg(calc.div(totalPriceValue, sumValue), type);
        const tooltipAvg = type === 'buy' ? calc.showFloorTruncation(avgValue, priceTruncate) : calc.showCeilTruncation(avgValue, priceTruncate);
        return {
          price, amount, sum, priceValue, amountValue, sumValue, tooltipSum, tooltipTotal, tooltipAvg
        };
      };
      const buyList = depth.bids.map(([priceValue, amountValue, totalValue]) => {
        return getDepthItem(priceValue, amountValue, totalValue, 'buy');
      });
      sum = '0';
      sumValue = 0;
      totalPriceValue = 0;
      const sellList = [];
      for (let i = depth.asks.length - 1; i >= 0; i--) {
        const [priceValue, amountValue, totalValue] = depth.asks[i];
        const depthItem = getDepthItem(priceValue, amountValue, totalValue, 'sell');
        sellList.push(depthItem);
      }
      // const buyList = depth.bids.map((item) => {
      //   const price = calc.showFloorTruncation(item[0], priceTruncate);
      //   const amount = calc.showFloorTruncation(item[1], sizeTruncate);
      //   sum = calc.showFloorTruncation(calc.add(amount.replace(/,/g, ''), sum.replace(/,/g, '')), sizeTruncate);
      //   return {
      //     price, amount, sum
      //   };
      // });
      // sum = '0';
      // const sellList = [];
      // for (let i = depth.asks.length - 1; i >= 0; i--) {
      //   const item = depth.asks[i];
      //   const price = calc.showFloorTruncation(item[0], priceTruncate);
      //   const amount = calc.showFloorTruncation(item[1], sizeTruncate);
      //   sum = calc.showFloorTruncation(calc.add(amount.replace(/,/g, ''), sum.replace(/,/g, '')), sizeTruncate);
      //   sellList.push({
      //     price,
      //     amount,
      //     sum
      //   });
      // }
      sellList.reverse();
      return {
        sellList,
        buyList
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
      price = (price !== '--') ? calc.showFloorTruncation(price, productConfig.max_price_digit || 8) : '--';
      newTicker.price = price;
      return newTicker;
    };

    render() {
      const {
        product
      } = this.props; // 来自redux

      const listSource = this.getListSource();
      const tickerSource = this.getTickerSource();
      return (<Component
        product={product}
        listSource={listSource}
        isShowMerge={false} // TODO 三期做 简写isShowMerge相当于isShowMerge={true}
        tickerSource={tickerSource}
        onChooseMergeType={this.onChooseMergeType}
        onChooseOneDepth={this.onChooseOneDepthChange}
      />);
    }
  }

  return SpotDepth;
};
export default DepthWrapper;

