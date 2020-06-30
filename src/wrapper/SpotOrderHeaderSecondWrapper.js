import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import Checkbox from 'rc-checkbox';
import Enum from '../utils/Enum';
import util from '../utils/util';
// import { wsV3, channelsV3 } from '../utils/websocket';
import * as OrderAction from '../redux/actions/OrderAction';
import PageURL from '../constants/PageURL';

function mapStateToProps(state) {
  const {
    type, periodIntervalType, entrustType, isHideOthers, isHideOrders
  } = state.OrderStore;
  const {
    wsIsOnlineV3, wsErrCounter
  } = state.Spot;
  return {
    type,
    periodIntervalType,
    entrustType,
    isHideOthers,
    isHideOrders,
    wsIsOnlineV3,
    wsErrCounter
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
    // 改变二级 tab 1天，1周，1月，3月
    onTabChange = (checkTab) => {
      const { orderAction } = this.props;
      return () => {
        orderAction.updatePeriodInterval(checkTab);
      };
    };
    // 当前币对全撤
    onCancelAllOrder = () => {
      this.props.orderAction.cancelAll();
    };
    // 获取二级表头 tab 数据
    getHeaderSecondList = () => {
      return [
        { type: Enum.order.periodInterval.oneDay, name: toLocale('spot.orders.oneDay') },
        { type: Enum.order.periodInterval.oneWeek, name: toLocale('spot.orders.oneWeek') },
        { type: Enum.order.periodInterval.oneMonth, name: toLocale('spot.orders.oneMonth') },
        { type: Enum.order.periodInterval.threeMonth, name: toLocale('spot.orders.threeMonth') },
      ];
    };
    // 切换"隐藏其他币对"
    updateHideOthers = (e) => {
      this.props.orderAction.updateHideOthers(e.target.checked);
    };
    // 渲染"隐藏其他币对"操作
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
