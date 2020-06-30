import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NormalOrderList from './NormalOrderList';
import Enum from '../../utils/Enum';
import * as OrderAction from '../../redux/actions/OrderAction';
import Config from "../../constants/Config";

function mapStateToProps(state) { // 绑定redux中相关state
  const { product } = state.SpotTrade;
  const { entrustType, type } = state.OrderStore; // type是当前委托，历史委托，成交明细三种之一
  return { product, entrustType, type };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    orderAction: bindActionCreators(OrderAction, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
export default class OrderList extends React.Component {
  // 页面已载入并不加载订单，只有在product, entrustType, type三个变化时才进入Receive逻辑
  componentWillReceiveProps(nextProps) {
    if (this.props.product !== nextProps.product) {
      if (nextProps.type === Enum.order.type.noDeal) {
        this.props.orderAction.getNoDealList({ page: 1 });
      } else {
        this.props.orderAction.getOrderList({ page: 1 });
      }
    }
  }
  render() {
    switch (this.props.entrustType) {
      case Enum.order.entrustType.normal:
        return <NormalOrderList />;
      default:
        return <NormalOrderList />;
    }
  }
}
