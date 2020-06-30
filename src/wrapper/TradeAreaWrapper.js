import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import PageURL from '../constants/PageURL';
import * as SpotActions from '../redux/actions/SpotAction';

function mapStateToProps(state) { // 绑定redux中相关state
  return {
    productList: state.SpotTrade.productList,
    activeMarket: state.Spot.activeMarket
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    spotActions: bindActionCreators(SpotActions, dispatch)
  };
}

const TradeAreaWrapper = (Component) => {
  @withRouter
  @connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
  class TradeArea extends React.Component {
    // 改变交易区
    onTabChange = (key) => {
      return () => {
        const { productList } = this.props;
        // const { pathname } = window.location;
        const pathname = window.OK_GLOBAL.isMarginType ? PageURL.spotMarginTradePage : PageURL.spotTradePage;
        let product = '';
        let newHash = '';
        if (Number(key) === 1) { // 自选
          const collectList = productList.filter((product) => {
            return +product.collect === 1;
          });
          product = collectList.length > 0 ? collectList[0].product : productList[0].product;
          newHash = `#product=${product.toLowerCase()}&favorites=1`;
        } else { // 其他交易区
          // forEach方法不能break，故用some方法
          productList.some((item) => {
            const thisMarket = item.product.split('_')[1];
            if (key === thisMarket) {
              // 选中交易区的第一个(非隐藏)币对
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
