import React from 'react';
import Icon from '_src/component/IconLite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import util from '_src/utils/util';
import './FullTradeProduct.less';
import * as SpotActions from '../../redux/actions/SpotAction';
import Introduce from '../../component/kline/Introduce';

function mapStateToProps(state) { // 绑定redux中相关state
  const { product } = state.SpotTrade;
  return {
    product
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    spotActions: bindActionCreators(SpotActions, dispatch)
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
export default class FullTradeProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowProduction: false
    };
  }

  // 显示币种介绍
  showProduction = () => {
    this.setState({
      isShowProduction: true
    });
  };
  // 隐藏币种介绍
  hideProduction = () => {
    this.setState({
      isShowProduction: false
    });
  };

  render() {
    const { product } = this.props;
    const {
      isShowProduction
    } = this.state;
    return (
      <div className="full-product-list">
        <span>
          <em>{util.getShortName(product)}</em>
        </span>

        <span
          onMouseEnter={this.showProduction}
          onMouseLeave={this.hideProduction}
          style={{ position: 'relative' }}
        >
          <Icon
            className="icon-annotation-night"
            isColor
            style={{ width: '16px', height: '16px', marginBottom: '-3px' }}
          />
          <div
            className="production-container"
            style={{ display: isShowProduction ? 'block' : 'none' }}
          >
            <Introduce />
          </div>
        </span>
      </div>);
  }
}
