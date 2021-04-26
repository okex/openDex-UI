import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_component/IconLite';
import Message from '_component/Message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import * as NodeActions from '_app/redux/actions/NodeAction';
import { wsV3, channelsV3 } from '_src/utils/websocket';
import Enum from '_src/utils/Enum';
import util from '_src/utils/util';
import './FullTradeProductList.less';
import Introduce from '_component/kline/Introduce';
import FullTradeProductListTab from '_src/pages/fullTrade/FullTradeProductListTab';
import * as SpotActions from '_src/redux/actions/SpotAction';
import PageURL from '_src/constants/PageURL';

function mapStateToProps(state) {
  const { wsIsOnlineV3, wsErrCounterV3, tickers, activeMarket } = state.Spot;
  const {
    groupList,
    productList,
    product,
    productObj,
    isMarginOpen,
    spotOrMargin,
    favorites,
  } = state.SpotTrade;
  return {
    wsIsOnlineV3,
    wsErrCounterV3,
    groupList,
    productList,
    tickers,
    activeMarket,
    product,
    productObj,
    isMarginOpen,
    spotOrMargin,
    favorites,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
    nodeActions: bindActionCreators(NodeActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class FullTradeProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarket: props.activeMarket,
      isShowList: false,
      isShowProduction: false,
    };
    this.canStar = true;
  }

  componentDidMount() {
    const { wsIsOnlineV3 } = this.props;
    if (wsIsOnlineV3) {
      this.startWs();
    }
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const { spotActions, nodeActions } = this.props;
    const newWsIsOnline = nextProps.wsIsOnlineV3;
    const oldWsIsOnline = this.props.wsIsOnlineV3;
    if (!oldWsIsOnline && newWsIsOnline) {
      nodeActions.stopCheckBreakTime();
      this.startWs();
    }
    const oldWsErrCounter = this.props.wsErrCounterV3;
    const newWsErrCounter = nextProps.wsErrCounterV3;
    if (newWsErrCounter > oldWsErrCounter) {
      spotActions.fetchTickers();
    }
    if (this.state.isShowList) {
      return false;
    }
    return false;
  }

  componentWillUnmount() {
    const { wsIsOnlineV3 } = this.props;
    if (wsIsOnlineV3) {
      this.stopWs();
    }
  }

  getCurrListByArea = (productList, activeMarket) => {
    const { groupId } = activeMarket;
    return productList.filter((item) => item.groupIds.includes(groupId));
  };

  showList = () => {
    this.setState({
      isShowList: true,
    });
  };

  hideList = () => {
    this.setState({
      isShowList: false,
    });
  };

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

  handleSelectMenu = (item) => {
    const { spotActions } = this.props;

    const product = item.product;
    let urlLink = `${PageURL.spotFullPage}#product=${product.toLowerCase()}`;
    if (window.OK_GLOBAL.isMarginType) {
      urlLink = `${
        PageURL.spotFullMarginPage
      }#product=${product.toLowerCase()}`;
    }
    if (this.state.activeMarket.groupId === -1) {
      this.props.history.replace(`${urlLink}&favorites=1`);
    } else {
      this.props.history.replace(urlLink);
    }
    spotActions.updateActiveMarket(this.state.activeMarket);
    spotActions.updateProduct(product);
    this.hideList();
  };

  handleClickStar = (isStared, item) => {
    const { spotActions } = this.props;
    if (this.canStar) {
      this.canStar = false;
      const product = {
        productId: item.productId,
        collect: isStared ? 1 : 0,
        symbol: item.symbol,
      };
      spotActions
        .collectProduct(product)
        .catch((res) => {
          if (res && res.msg) {
            Message.error({
              content: toLocale(`error.code.${res.code}`) || res.msg,
            });
          }
        })
        .then(() => {
          this.canStar = true;
        });
    }
  };

  handleClickFavorite = (item) => {
    const { isFavorite, product } = item;
    const { spotActions, favorites } = this.props;
    if (!isFavorite) {
      spotActions.updateFavoriteList([...favorites, product]);
    } else {
      const dList = util.cloneDeep(favorites);
      const list = dList.filter((l) => l !== product);
      spotActions.updateFavoriteList(list);
    }
  };

  startWs = () => {
    wsV3.send(channelsV3.getAllMarketTickers());
  };

  stopWs = () => {
    wsV3.stop(channelsV3.getAllMarketTickers());
  };

  filterGroupList = () => {
    const { groupList, spotOrMargin } = this.props;
    const { webType } = window.OK_GLOBAL;
    if (webType !== (spotOrMargin === Enum.spotOrMargin.spot)) {
      return groupList;
    }
    return groupList.filter((g) => g.marginCount > 0);
  };

  renderMarginTip = () => {
    const { productConfig } = window.OK_GLOBAL;
    const { isMarginOpen } = this.props;
    if (isMarginOpen) {
      return (
        <span className="margin-x">{productConfig.maxMarginLeverage}X</span>
      );
    }
    return null;
  };

  render() {
    const { tickers, productList, product, favorites } = this.props;

    const { isShowList, isShowProduction } = this.state;
    let activeId = product ? product.toUpperCase().replace('_', '/') : '';
    let favoriteList = [];
    const tabList = productList.map((item) => {
      const productIterative = item.product;
      const pair = productIterative.toUpperCase().replace('_', '/');
      const isFavorite = favorites.some((fav) => fav === item.product);
      if (!activeId) {
        activeId = pair;
      }
      let change = 0;
      let changePercentage = '--';
      const currTicker = tickers[productIterative];
      if (currTicker) {
        change = currTicker.change;
        changePercentage = currTicker.changePercentage;
      }
      const [symbol] = productIterative.split('_');
      const [shortToken] = symbol.split('-');
      const exItem = {
        ...item,
        changePercentage,
        text: pair,
        change,
        id: productIterative.toUpperCase().replace('_', '/'),
        shortToken,
        isFavorite,
      };
      if (isFavorite) {
        favoriteList.push(exItem);
      }
      return exItem;
    });
    favoriteList = favorites
      .map((fav) => favoriteList.find((item) => fav === item.product))
      .filter((item) => !!item);
    return (
      <div className="full-product-list">
        <span
          className="current-symbol"
          onMouseEnter={this.showList}
          onMouseLeave={this.hideList}
        >
          <em>{util.getShortName(product)}</em>
          {this.renderMarginTip()}
          <a className="down-arrow" />
          <div
            className="product-list-container-new"
            style={{ display: isShowList ? 'block' : 'none' }}
          >
            <Tabs defaultActiveKey="1" prefixCls="product-list-tab">
              <TabPane tab={toLocale('productList.favorite')} key="1">
                <FullTradeProductListTab
                  tabList={favoriteList}
                  type={FullTradeProductListTab.TYPE.FAVORITE}
                  searchType={FullTradeProductListTab.SEARCH_TYPE.TOKEN}
                  activeId={activeId}
                  onSelect={this.handleSelectMenu}
                  onFavorite={this.handleClickFavorite}
                />
              </TabPane>
              <TabPane tab={toLocale('productList.owner')} key="2">
                <FullTradeProductListTab
                  tabList={tabList}
                  type={FullTradeProductListTab.TYPE.NORMAL}
                  searchType={FullTradeProductListTab.SEARCH_TYPE.OWNER}
                  activeId={activeId}
                  onSelect={this.handleSelectMenu}
                  onFavorite={this.handleClickFavorite}
                />
              </TabPane>
              <TabPane tab={toLocale('productList.token')} key="3">
                <FullTradeProductListTab
                  tabList={tabList}
                  type={FullTradeProductListTab.TYPE.NORMAL}
                  searchType={FullTradeProductListTab.SEARCH_TYPE.TOKEN}
                  activeId={activeId}
                  onSelect={this.handleSelectMenu}
                  onFavorite={this.handleClickFavorite}
                />
              </TabPane>
            </Tabs>
          </div>
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
            style={{ display: isShowProduction ? 'block' : 'none' }}
            className="production-container-outer"
          >
            <div className="production-container">
              <Introduce />
            </div>
          </div>
        </span>
      </div>
    );
  }
}
export default FullTradeProductList;
