import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import NormalOrderList from './NormalOrderList';
import Enum from '../../utils/Enum';
import * as OrderAction from '../../redux/actions/OrderAction';

function mapStateToProps(state) {
  const { product } = state.SpotTrade;
  const { entrustType, type } = state.OrderStore;
  return { product, entrustType, type };
}

function mapDispatchToProps(dispatch) {
  return {
    orderAction: bindActionCreators(OrderAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class OrderList extends React.Component {
  UNSAFE_componentWillReceiveProps(nextProps) {
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
