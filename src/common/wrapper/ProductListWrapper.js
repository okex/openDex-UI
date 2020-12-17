import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { calc } from '_component/okit';
import Message from '_src/component/Message';
import { wsV3, channelsV3 } from '../utils/websocket';
import navigation from '../utils/navigation';
import PageURL from '../constants/PageURL';
import ont from '../utils/dataProxy';
import util from '../utils/util';
import * as SpotActions from '../redux/actions/SpotAction';
import URL from '../constants/URL';
import Enum from '../utils/Enum';
import { toLocale } from '../locale/react-locale';

function mapStateToProps(state) {
  const {
    wsIsOnlineV3,
    wsErrCounterV3,
    tickers,
    activeMarket,
    searchText,
    billMenuActive,
  } = state.Spot;
  const { productList, product, productObj } = state.SpotTrade;
  return {
    wsIsOnlineV3,
    wsErrCounterV3,
    searchText,
    productList,
    productObj,
    tickers,
    activeMarket,
    product,
    billMenuActive,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
  };
}

const ProductListWrapper = (Component) => {
  @withRouter
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotLeftMenu extends React.Component {
    constructor(props, context) {
      super(props, context);
      this.canStar = true;
    }

    componentDidMount() {
      const { wsIsOnlineV3 } = this.props;
      if (wsIsOnlineV3) {
        this.startWs();
      }
    }

    componentWillReceiveProps(nextProps) {
      const { spotActions } = this.props;
      const newWsIsOnline = nextProps.wsIsOnlineV3;
      const oldWsIsOnline = this.props.wsIsOnlineV3;
      if (!oldWsIsOnline && newWsIsOnline) {
        this.startWs();
      }
      const oldWsErrCounter = this.props.wsErrCounterV3;
      const newWsErrCounter = nextProps.wsErrCounterV3;
      if (newWsErrCounter > oldWsErrCounter) {
        spotActions.fetchTickers();
      }
    }

    componentWillUnmount() {
      const { wsIsOnlineV3 } = this.props;
      if (wsIsOnlineV3) {
        this.stopWs();
      }
    }

    getCurrListByArea = (productList, activeMarket) => {
      let currList = [];
      const { groupId } = activeMarket;
      if (+groupId === 1) {
        currList = productList
          .filter((product) => {
            return `${product}` == product;
          })
          .sort((a, b) => {
            return b.order - a.order;
          });
      } else {
        currList = productList.filter((product) => {
          return product.product.split('_')[1] === groupId;
        });
      }
      return currList;
    };
    startWs = () => {
      wsV3.send(channelsV3.getAllMarketTickers());
    };
    stopWs = () => {
      wsV3.stop(channelsV3.getAllMarketTickers());
    };
    handleSearch = (text) => {
      const { spotActions } = this.props;
      spotActions.updateSearch(text);
    };
    handleSelectMenu = (item) => {
      const { tradeType } = window.OK_GLOBAL;
      const { spotActions } = this.props;
      const product = item.product;
      let urlLink = `${PageURL.spotFullPage}#product=${product.toLowerCase()}`;
      if (tradeType === Enum.tradeType.normalTrade) {
        urlLink = `${PageURL.spotTradePage}#product=${product.toLowerCase()}`;
      }
      if (util.getQueryHashString('favorites')) {
        this.props.history.replace(`${urlLink}&favorites=1`);
      } else {
        this.props.history.replace(urlLink);
      }
      spotActions.updateProduct(product);
    };

    handleClickStar = (isStared, item) => {
      const { isLogin } = window.OK_GLOBAL;
      const { spotActions } = this.props;
      if (!isLogin) {
        navigation.login();
        return;
      }
      if (this.canStar) {
        this.canStar = false;
        const parmas = {
          productIds: item.productId,
          collect: isStared ? 1 : 0,
          symbol: item.symbol,
        };
        ont
          .post(URL.POST_COLLECT_PRODUCT, parmas)
          .then((res) => {
            const data = res.data[0];
            spotActions.collectProduct({
              symbol: data.symbol,
              productId: data.value,
              collect: data.collect,
            });
            this.canStar = true;
          })
          .catch((res) => {
            this.canStar = true;
            if (res && res.msg) {
              Message.error({
                content: toLocale(`error.code.${res.code}`) || res.msg,
              });
            }
          });
      }
    };

    render() {
      const {
        tickers,
        product,
        searchText,
        productList,
        activeMarket,
        productObj,
      } = this.props;
      const currList = this.getCurrListByArea(productList, activeMarket);
      let activeId = product ? product.toUpperCase().replace('_', '/') : '';
      const menuList = currList
        .map((item) => {
          const productIterative = item.product;
          const pair = productIterative.toUpperCase().replace('_', '/');
          if (!activeId) {
            activeId = pair;
          }
          let change = 0;
          let changePercentage = '--';
          let volume = '--';
          const currTicker = tickers[productIterative];
          const initPrice =
            productObj && productObj[productIterative]
              ? productObj[productIterative].price
              : 0;
          let price = '--';
          if (currTicker) {
            if (+currTicker.price === -1) {
              price = initPrice;
            } else {
              price = currTicker.price;
            }
            change = currTicker.change;
            changePercentage = currTicker.changePercentage;
            volume = currTicker.volume;
          }
          const { productId, collect } = item;
          const { productConfig } = window.OK_GLOBAL;
          const max_price_digit = item.max_price_digit || 4;
          const [symbol] = productIterative.split('_');
          const [shortToken] = symbol.split('-');
          return {
            id: pair,
            price:
              price !== '--'
                ? calc.showFloorTruncation(price, max_price_digit)
                : '--',
            volume:
              volume !== '--' ? calc.showFloorTruncation(volume, 0) : '--',
            productId,
            product: item.product,
            text: pair,
            change,
            changePercentage,
            shortToken,
            stared: Number(collect) === 1,
            lever: false,
          };
        })
        .filter((item) => {
          let filterTag = true;
          if (Number(activeMarket) === 1) {
            filterTag = true;
          }
          if (searchText.trim() !== '') {
            filterTag =
              item.shortToken.indexOf(searchText.toLowerCase().toString()) > -1;
          }
          return filterTag;
        });

      return (
        <Component
          {...this.props}
          dataSource={menuList}
          activeId={activeId}
          onSearch={this.handleSearch}
          onSelect={this.handleSelectMenu}
          onClickStar={this.handleClickStar}
        />
      );
    }
  }

  return SpotLeftMenu;
};
export default ProductListWrapper;
