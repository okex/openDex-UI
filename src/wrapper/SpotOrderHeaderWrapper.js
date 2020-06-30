import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import Checkbox from 'rc-checkbox';
import Enum from '../utils/Enum';
import * as OrderAction from '../redux/actions/OrderAction';
import Config from '../constants/Config';

function mapStateToProps(state) {
  const {
    type, entrustType, isHideOthers, isHideOrders
  } = state.OrderStore;
  return {
    type, entrustType, isHideOthers, isHideOrders
  };
}

function mapDispatchToProps(dispatch) {
  return {
    orderAction: bindActionCreators(OrderAction, dispatch),
  };
}


const OrderHeaderWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class OrderHeader extends React.Component {
    // 改变一级 tab 类型(我的挂单 or 历史委托)
    onTabChange = (checkTab) => {
      return () => {
        const { orderAction } = this.props;
        orderAction.resetData();
        // if (this.props.type === Enum.order.type.noDeal) {
        //   orderAction.getNoDealList({ page: 1 });
        // }
        orderAction.updateType(checkTab);
      };
    };
    // 全部挂单链接
    getOrderPageLink = () => {
      const { type } = this.props;
      let path = 'open';
      if (type === Enum.order.type.history) {
        path = 'history';
      } else if (type === Enum.order.type.detail) {
        path = 'deals';
      }
      return (
        <Link
          to={path}
          className="order-page-link"
        >
          {toLocale('all')}
        </Link>
      );
    };
    // 获取一级表头 tab 数据
    getHeaderList = () => {
      return [
        { type: Enum.order.type.noDeal, name: toLocale('spot.orders.openOrders') },
        { type: Enum.order.type.history, name: toLocale('spot.orders.orderHistory') },
        { type: Enum.order.type.detail, name: toLocale('spot.myOrder.detail') }
      ];
    };
    // 历史委托 切换 "隐藏已撤单"
    updateHideCanceledOrders = (e) => {
      this.props.orderAction.updateHideOrders(e.target.checked);
    };
    // 切换"隐藏其他币对"
    updateHideOthers = (e) => {
      this.props.orderAction.updateHideOthers(e.target.checked);
    };
    // 渲染"隐藏其他币对"等其他操作
    extraOperations = () => {
      const { props } = this;
      const {
        type, isHideOthers, isHideOrders
      } = props;
      // 只有 未成交 && 普通委托 包含"隐藏其他币对"功能
      const { noDeal, history } = Enum.order.type;
      if (type === noDeal) {
        return (
          <div className="hide-others flex-row flex-center fz12">
            {this.props.children}
            <div className="line-item" />
            <label className="cursor-pointer">
              <Checkbox
                onChange={this.updateHideOthers}
                className="content-box"
                checked={isHideOthers}
              />
              <span className="mar-left8">{toLocale('spot.orders.historyRecord')}&nbsp;&nbsp;</span>
            </label>
            {/* <div className="line-item" />
            <BatchCancelOrder
              entrustType={props.entrustType}
              symbol={props.symbol}
              onCancel={props.orderAction.cancelAll}
              disable={!props.hasOrder || !isHideOthers}
            /> */}
          </div>
        );
      }
      if (type === '') { // history
        return (
          <div className="hide-others flex-row flex-center fz12">
            {this.props.children}
            <div className="line-item" />
            <label className="cursor-pointer">
              <Checkbox
                onChange={this.updateHideCanceledOrders}
                className="content-box"
                checked={isHideOrders}
              />
              <span className="mar-left8">{toLocale('spot.orders.historyRescinded')}</span>
            </label>
          </div>
        );
      }
      return null;
    };
    render() {
      const { type } = this.props;
      return (
        <Component
          type={type}
          dataSource={this.getHeaderList()}
          onTabChange={this.onTabChange}
          orderPageLink={this.getOrderPageLink()}
        >
          <div className="float-right">
            {this.extraOperations()}
          </div>
        </Component>
      );
    }
  }
  return OrderHeader;
};

export default OrderHeaderWrapper;
