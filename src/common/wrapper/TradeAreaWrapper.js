import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PageURL from '../constants/PageURL';
import * as SpotActions from '../redux/actions/SpotAction';

function mapStateToProps(state) {
  return {
    productList: state.SpotTrade.productList,
    activeMarket: state.Spot.activeMarket,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
  };
}

const TradeAreaWrapper = (Component) => {
  @withRouter
  @connect(mapStateToProps, mapDispatchToProps)
  class TradeArea extends React.Component {
    onTabChange = (key) => () => {
      const { productList } = this.props;
      const pathname = window.OK_GLOBAL.isMarginType
        ? PageURL.spotMarginTradePage
        : PageURL.spotTradePage;
      let product = '';
      let newHash = '';
      if (Number(key) === 1) {
        const collectList = productList.filter(
          (product) => +product.collect === 1
        );
        product =
          collectList.length > 0
            ? collectList[0].product
            : productList[0].product;
        newHash = `#product=${product.toLowerCase()}&favorites=1`;
      } else {
        productList.some((item) => {
          const thisMarket = item.product.split('_')[1];
          if (key === thisMarket) {
            product = item.product;
            newHash = `#product=${product.toLowerCase()}`;
            return true;
          }
          return false;
        });
      }
      this.props.history.replace(pathname + newHash);
      const { spotActions } = this.props;
      spotActions.updateSearch('');
      spotActions.updateActiveMarket(key);
      spotActions.updateProduct(product);
    };

    render() {
      const { productList } = this.props;
      let marketFlag = '';
      const markets = [];
      productList.forEach((product) => {
        const thisMarket = product.product.split('_')[1];
        if (marketFlag !== thisMarket) {
          marketFlag = thisMarket;
          markets.push(marketFlag);
        }
      });
      return (
        <Component
          {...this.props}
          markets={markets}
          onAreaChange={this.onTabChange}
        />
      );
    }
  }

  return TradeArea;
};
export default TradeAreaWrapper;
