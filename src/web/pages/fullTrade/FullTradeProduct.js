import React from 'react';
import Icon from '_src/component/IconLite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import util from '_src/utils/util';
import './FullTradeProduct.less';
import * as SpotActions from '../../redux/actions/SpotAction';
import Introduce from '../../component/kline/Introduce';

function mapStateToProps(state) {
  const { product } = state.SpotTrade;
  return {
    product,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
export default class FullTradeProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowProduction: false,
    };
  }

  showProduction = () => {
    this.setState({
      isShowProduction: true,
    });
  };

  hideProduction = () => {
    this.setState({
      isShowProduction: false,
    });
  };

  render() {
    const { product } = this.props;
    const { isShowProduction } = this.state;
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
      </div>
    );
  }
}
