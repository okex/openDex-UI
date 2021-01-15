import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_component/IconLite';
import Message from '_component/Message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { calc } from '_component/okit';
import { wsV3, channelsV3 } from '_src/utils/websocket';
import util from '_src/utils/util';
import './FullTradeProductList.less';
import LeftMenu from '_src/component/leftMenu';
import Introduce from '_src/component/kline/Introduce';
import * as SpotActions from '_src/redux/actions/SpotAction';
import PageURL from '_src/constants/PageURL';
import env from '../../../common/constants/env';

function mapStateToProps(state) {
  const { wsIsOnlineV3, wsErrCounterV3, tickers, activeMarket } = state.Spot;
  const {
    groupList,
    productList,
    product,
    productObj,
    isMarginOpen,
    spotOrMargin,
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
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class FullTradeProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarket: props.activeMarket,
      searchText: '',
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
    if (this.state.isShowList) {
      return false;
    }
    if (
      nextProps.activeMarket &&
      this.state.activeMarket !== nextProps.activeMarket
    ) {
      this.setState({
        activeMarket: nextProps.activeMarket,
      });
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
    const { groupName } = activeMarket;
    const quoteSymbol = groupName || env.envConfig.token.quoteName;
    let currList = productList.filter((item) => {
      return item.quote_asset_symbol.toUpperCase() === quoteSymbol;
    });
    return currList;
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

  handleMarketChange = (market) => {
    return () => {
      this.setState({
        searchText: '',
        activeMarket: market,
      });
    };
  };

  handleSearch = (e) => {
    this.setState({
      searchText: e.target.value,
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

  startWs = () => {
    wsV3.send(channelsV3.getAllMarketTickers());
  };

  stopWs = () => {
    wsV3.stop(channelsV3.getAllMarketTickers());
  };
  filterGroupList = () => {
    const { groupList } = this.props;
    return groupList;
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
    const { tickers, productList, product, productObj } = this.props;
    const {
      isShowList,
      isShowProduction,
      searchText,
      activeMarket,
    } = this.state;
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
        const { productId, collect, isMarginOpen, maxMarginLeverage } = item;
        const max_price_digit = item.max_price_digit || 4;
        const [symbol] = productIterative.split('_');
        const [shortToken] = symbol.split('-');
        return {
          id: productIterative.toUpperCase().replace('_', '/'),
          price:
            price !== '--'
              ? calc.showFloorTruncation(price, max_price_digit)
              : '--',
          volume: volume !== '--' ? calc.showFloorTruncation(volume, 0) : '--',
          productId,
          product: item.product,
          text: pair,
          change,
          changePercentage,
          shortToken,
          stared: Number(collect) == 1,
          lever: isMarginOpen ? maxMarginLeverage : false,
          listDisplay: item.listDisplay,
        };
      })
      .filter((item) => {
        let filterTag = true;
        if (item.listDisplay == 1) {
          filterTag = false;
        }
        if (activeMarket.groupId === -1) {
          filterTag = true;
        }
        if (searchText.trim() !== '') {
          filterTag = false;
          if (
            item.shortToken.indexOf(searchText.toLowerCase().toString()) > -1
          ) {
            filterTag = true;
          }
        }
        return filterTag;
      });
    if (activeMarket.groupId === 2) {
      menuList.sort(function (a, b) {
        return parseFloat(a.changePercentage) - parseFloat(b.changePercentage);
      });
    } else if (activeMarket.groupId === 3) {
      menuList.sort(function (a, b) {
        return parseFloat(b.changePercentage) - parseFloat(a.changePercentage);
      });
    }
    const listEmpty = toLocale('spot.noData');
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
            className="product-list-container"
            style={{ display: isShowList ? 'block' : 'none' }}
          >
            <div className="search-bar">
              <input
                placeholder={toLocale('search')}
                onChange={this.handleSearch}
                value={searchText}
              />
              <Icon className="icon-search" />
            </div>
            <div className="product-list">
              <div className="trad-area">
                <ul className="spot-head-tab">
                  <li
                    className="market-label"
                    style={{
                      cursor: 'default',
                      height: '26px',
                      lineHeight: '26px',
                    }}
                  >
                    {toLocale('spot.marketDict')}
                  </li>
                  {this.filterGroupList().map((market) => {
                    const { groupId, groupName, groupKey } = market;
                    return (
                      <li
                        key={groupId}
                        className={
                          groupId === activeMarket.groupId ? 'active' : ''
                        }
                        onClick={this.handleMarketChange(market)}
                      >
                        {groupKey ? toLocale(groupKey) : groupName}
                      </li>
                    );
                  })}
                </ul>
              </div>
              <LeftMenu
                subTitle={[toLocale('pair'), toLocale('change')]}
                searchPlaceholder={toLocale('search')}
                menuList={menuList}
                listHeight={360}
                listEmpty={listEmpty}
                activeId={activeId}
                canStar={false}
                theme="dark"
                onSelect={this.handleSelectMenu}
                onClickStar={this.handleClickStar}
              />
            </div>
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
