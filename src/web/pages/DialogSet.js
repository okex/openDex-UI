import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';

function mapStateToProps(state) {
  const { product } = state.SpotTrade;
  return {
    product,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SpotTradeActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class DialogSet extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return <div className="dialog-set" />;
  }
}

export default DialogSet;
