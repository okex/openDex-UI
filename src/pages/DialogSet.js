import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    product
  } = state.SpotTrade;
  return {
    product
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SpotTradeActions, dispatch)
  };
}

@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
class DialogSet extends React.Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      // transOpen: false
    };
  }


  render() {
    return (
      <div className="dialog-set">
        {/* */}
      </div>
    );
  }
}

export default DialogSet;
