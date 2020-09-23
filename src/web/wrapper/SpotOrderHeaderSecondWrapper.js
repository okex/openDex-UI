import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import Checkbox from 'rc-checkbox';
import Enum from '../utils/Enum';
import * as OrderAction from '../redux/actions/OrderAction';

function mapStateToProps(state) {
  const {
    type,
    periodIntervalType,
    entrustType,
    isHideOthers,
    isHideOrders,
  } = state.OrderStore;
  const { wsIsOnlineV3, wsErrCounter } = state.Spot;
  return {
    type,
    periodIntervalType,
    entrustType,
    isHideOthers,
    isHideOrders,
    wsIsOnlineV3,
    wsErrCounter,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    orderAction: bindActionCreators(OrderAction, dispatch),
  };
}

const SpotOrderHeaderSecondWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotOrderHeaderSecond extends React.Component {
    onTabChange = (checkTab) => {
      const { orderAction } = this.props;
      return () => {
        orderAction.updatePeriodInterval(checkTab);
      };
    };
    onCancelAllOrder = () => {
      this.props.orderAction.cancelAll();
    };
    getHeaderSecondList = () => {
      return [
        {
          type: Enum.order.periodInterval.oneDay,
          name: toLocale('spot.orders.oneDay'),
        },
        {
          type: Enum.order.periodInterval.oneWeek,
          name: toLocale('spot.orders.oneWeek'),
        },
        {
          type: Enum.order.periodInterval.oneMonth,
          name: toLocale('spot.orders.oneMonth'),
        },
        {
          type: Enum.order.periodInterval.threeMonth,
          name: toLocale('spot.orders.threeMonth'),
        },
      ];
    };
    updateHideOthers = (e) => {
      this.props.orderAction.updateHideOthers(e.target.checked);
    };
    hideOtherProductOp = () => {
      const { isHideOthers } = this.props;
      return (
        <div className="hide-others flex-row">
          <label className="cursor-pointer">
            <Checkbox
              onChange={this.updateHideOthers}
              className="content-box"
              checked={isHideOthers}
            />
            &nbsp;{toLocale('spot.orders.historyRecord')}
          </label>
        </div>
      );
    };
    render() {
      const { periodIntervalType } = this.props;
      return (
        <Component
          periodIntervalType={periodIntervalType}
          dataSource={this.getHeaderSecondList()}
          onTabChange={this.onTabChange}
          extraOperations={this.hideOtherProductOp()}
        />
      );
    }
  }
  return SpotOrderHeaderSecond;
};

export default SpotOrderHeaderSecondWrapper;
