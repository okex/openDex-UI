import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';

import * as FormAction from '../redux/actions/FormAction';
import * as OrderAction from '../redux/actions/OrderAction';
import Enum from '../utils/Enum';
import util from '../utils/util';

function mapStateToProps(state) {
  const { product } = state.SpotTrade;
  const { strategyType } = state.FormStore;
  const { entrustType } = state.OrderStore;
  return {
    product,
    strategyType,
    entrustType,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    formAction: bindActionCreators(FormAction, dispatch),
    orderAction: bindActionCreators(OrderAction, dispatch),
  };
}

const StrategyTypeWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class StrategyType extends React.Component {
    onChangeStrategyType = (e) => {
      const { formAction, orderAction, strategyType, entrustType } = this.props;
      if (e.value !== strategyType) {
        if (strategyType === 1 || strategyType === 7) {
          formAction.updateDepthInput({
            type: Enum.placeOrder.type.buy,
            price: '',
            amount: '',
            total: '',
            couponId: '',
          });
        }
        formAction.updateWarning('');
        formAction.updateStrategyType(e.value);
        const newEntrustType = e.value < 3 || e.value === 7 ? 0 : e.value - 2;
        if (entrustType !== newEntrustType) {
          orderAction.updateEntrustType(newEntrustType);
        }
      }
    };

    render() {
      const { tradeType } = window.OK_GLOBAL;
      const { strategyType, theme } = this.props;
      let limitId = 'spot.limitOrder';
      let marketId = 'spot.marketOrder';
      const planId = 'spot.planOrder';
      const trackId = 'spot.trackOrder';
      const icebergId = 'spot.icebergOrder';
      const timeWeightId = 'spot.timeWeightOrder';
      const advancedLimitId = 'spot.advancedLimitOrder';
      const strategyTypes = Enum.placeOrder.strategyType;
      let options = [
        { value: strategyTypes.limit, label: toLocale(limitId) },
        { value: strategyTypes.market, label: toLocale(marketId) },
        { value: strategyTypes.plan, label: toLocale(planId) },
        { value: strategyTypes.track, label: toLocale(trackId) },
        { value: strategyTypes.iceberg, label: toLocale(icebergId) },
        { value: strategyTypes.timeWeight, label: toLocale(timeWeightId) },
        {
          value: strategyTypes.advancedLimit,
          label: toLocale(advancedLimitId),
        },
      ];
      if (tradeType === Enum.tradeType.fullTrade) {
        limitId = 'spot.FullLimitOrder';
        marketId = 'spot.shortMarketOrder';
        options = [{ value: 1, label: toLocale(limitId) }];
      }
      return (
        <Component
          strategyType={strategyType}
          options={options}
          onChangeStrategyType={this.onChangeStrategyType}
          theme={util.getTheme(theme)}
        />
      );
    }
  }
  return StrategyType;
};
export default StrategyTypeWrapper;
