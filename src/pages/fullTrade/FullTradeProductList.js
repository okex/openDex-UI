import React from 'react';
import Tabs, { TabPane } from 'rc-tabs';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import Message from '_src/component/Message';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { calc } from '_component/okit';
import { wsV3, channelsV3 } from '../../utils/websocket';
import Enum from '../../utils/Enum';
import util from '../../utils/util';
import './FullTradeProductList.less';
import LeftMenu from '../../component/leftMenu';
import Introduce from '../../component/kline/Introduce';
import FullTradeProductListTab from './FullTradeProductListTab';
import * as SpotActions from '../../redux/actions/SpotAction';
import PageURL from '../../constants/PageURL';


function mapStateToProps(state) { // 绑定redux中相关state
  const {
    wsIsOnlineV3, wsErrCounterV3, tickers, activeMarket // , searchText
  } = state.Spot;
  const {
    groupList, productList, product, productObj, isMarginOpen, spotOrMargin, favoriteList
  } = state.SpotTrade;
  // let myProductList = productList;
  // yao 未登录时使用本地数据
  // if (!window.OK_GLOBAL.isLogin) {
  //   myProductList = productList.map((item) => {
  //     const isLocalCollect = localCollects.includes(item.productId);
  //     return {
  //       ...item,
  //       collect: isLocalCollect ? 1 : item.collect,
  //     };
  //   });
  // }
  return {
    wsIsOnlineV3,
    wsErrCounterV3,
    groupList,
    productList,
    tickers,
    activeMarket,
    // searchText,
    product,
    productObj,
    isMarginOpen,
    spotOrMargin,
    favoriteList,
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    spotActions: bindActionCreators(SpotActions, dispatch)
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
class FullTradeProductList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeMarket: props.activeMarket,
      // searchText: '',
      isShowList: false, // false,
      isShowProduction: false
    };
    this.canStar = true; // 收藏可用标志
  }

  componentDidMount() {
    const { wsIsOnlineV3 } = this.props;
    if (wsIsOnlineV3) {
      this.startWs();
    }
  }

  componentWillReceiveProps(nextProps) {
    const { spotActions } = this.props;
    /* ws状态变化相关 */
    const newWsIsOnline = nextProps.wsIsOnlineV3;
    const oldWsIsOnline = this.props.wsIsOnlineV3;
    // ws首次连接或者重连成功
    if (!oldWsIsOnline && newWsIsOnline) {
      this.startWs();
    }
    const oldWsErrCounter = this.props.wsErrCounterV3;
    const newWsErrCounter = nextProps.wsErrCounterV3;
    // ws断线
    if (newWsErrCounter > oldWsErrCounter) {
      // 获取所有币对行情
      spotActions.fetchTickers();
    }
    /* 自身显隐 */
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

  // 获取当前交易区币对列表
  getCurrListByArea = (productList, activeMarket) => {
    const { groupId } = activeMarket;
    return productList.filter((item) => {
      return item.groupIds.includes(groupId);
    });
  };

  // 显示菜单
  showList = () => {
    this.setState({
      isShowList: true // false
    });
  };
  // 隐藏菜单
  hideList = () => {
    this.setState({
      isShowList: false // false
    });
  };
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
  // 改变交易区
  // handleMarketChange = (market) => {
  //   return () => {
  //     this.setState({
  //       searchText: '',
  //       activeMarket: market
  //     });
  //   };
  // };
  // 模糊搜索
  // handleSearch = (e) => {
  //   this.setState({
  //     searchText: e.target.value
  //   });
  // };
  // 切换币对
  handleSelectMenu = (item) => {
    // const newSymbol = item.text.replace('/', '_').toLowerCase();
    const { spotActions } = this.props;

    const product = item.product;
    let urlLink = `${PageURL.spotFullPage}#product=${product.toLowerCase()}`;
    if (window.OK_GLOBAL.isMarginType) {
      urlLink = `${PageURL.spotFullMarginPage}#product=${product.toLowerCase()}`;
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

  // 收藏
  handleClickStar = (isStared, item) => {
    const { spotActions } = this.props;
    if (this.canStar) {
      this.canStar = false;
      const product = {
        productId: item.productId,
        collect: isStared ? 1 : 0,
        symbol: item.symbol
      };
      spotActions.collectProduct(product)
        .catch((res) => {
          if (res && res.msg) {
            Message.error({ content: res.msg });
          }
        })
        .then(() => {
          this.canStar = true;
        });
    }
  };

  // 本地收藏
  handleClickFavorite = (item) => {
    const { isFavorite } = item;
    const { spotActions, favoriteList } = this.props;
    if (!isFavorite) {
      spotActions.updateFavoriteList([...favoriteList, { ...item, isFavorite: true }]);
    } else {
      const dList = util.cloneDeep(favoriteList);
      const list = dList.filter((l) => {
        return l.product !== item.product;
      });
      spotActions.updateFavoriteList(list);
    }
  }

  // 开启ws订阅
  startWs = () => {
    wsV3.send(channelsV3.getAllMarketTickers());
  };
  // 停止ws订阅
  stopWs = () => {
    // 停止订阅所有币行情，即ticker
    wsV3.stop(channelsV3.getAllMarketTickers());
  };
  filterGroupList = () => {
    const { groupList, spotOrMargin } = this.props;
    const { webTypes, webType } = window.OK_GLOBAL;
    if (webType !== webTypes.OKCoin || spotOrMargin === Enum.spotOrMargin.spot) {
      return groupList;
    }
    return groupList.filter((g) => {
      return g.marginCount > 0;
    });
  };
  // 杠杆标识
  renderMarginTip = () => {
    const { productConfig } = window.OK_GLOBAL;
    const { isMarginOpen } = this.props;
    if (isMarginOpen) {
      return <span className="margin-x">{productConfig.maxMarginLeverage}X</span>;
    }
    return null;
  };

  render() {
    const {
      tickers, productList, product, favoriteList, // productObj,
    } = this.props;
    const {
      isShowList, isShowProduction, // searchText, activeMarket
    } = this.state;
    // const currList = this.getCurrListByArea(productList, activeMarket);
    let activeId = product ? product.toUpperCase().replace('_', '/') : '';
    // const menuList = currList.map((item) => {
    //   const productIterative = item.product; // item.symbol;
    //   const pair = productIterative.toUpperCase().replace('_', '/');
    //   if (!activeId) {
    //     activeId = pair;
    //   }
    //   let change = 0;
    //   let changePercentage = '--';
    //   let volume = '--';
    //   const currTicker = tickers[productIterative];
    //   const initPrice = (productObj && productObj[productIterative]) ? productObj[productIterative].price : 0;
    //   let price = '--';
    //   if (currTicker) {
    //     if (+currTicker.price === -1) { // -1表示从未成交
    //       price = initPrice;
    //     } else {
    //       price = currTicker.price;
    //     }
    //     change = currTicker.change;
    //     changePercentage = currTicker.changePercentage;
    //     volume = currTicker.volume;
    //   }
    //   const {
    //     productId, collect, isMarginOpen, maxMarginLeverage
    //   } = item;
    //   const max_price_digit = item.max_price_digit || 4;
    //   const [symbol] = productIterative.split('_');
    //   const [shortToken] = symbol.split('-');
    //   return {
    //     ...item,
    //     id: productIterative.toUpperCase().replace('_', '/'),
    //     price: (price !== '--') ? calc.showFloorTruncation(price, max_price_digit) : '--',
    //     volume: (volume !== '--') ? calc.showFloorTruncation(volume, 0) : '--',
    //     productId,
    //     product: item.product,
    //     text: pair,
    //     change,
    //     changePercentage,
    //     shortToken,
    //     stared: Number(collect) == 1,
    //     lever: isMarginOpen ? maxMarginLeverage : false,
    //     listDisplay: item.listDisplay // list_display存在且为1则隐藏
    //   };
    // }).filter((item) => {
    //   let filterTag = true;
    //   // 搜索到了显示
    //   if (searchText.trim() !== '') {
    //     filterTag = item.shortToken.indexOf(searchText.trim().toLowerCase().toString()) > -1;
    //   }
    //   return filterTag;
    // }).sort((itemA, itemB) => {
    //   const sortKey = `productSort${activeMarket.groupId}`;
    //   return itemA[sortKey] - itemB[sortKey];
    // });
    const tabList = productList.map((item) => {
      const productIterative = item.product; // item.symbol;
      const pair = productIterative.toUpperCase().replace('_', '/');
      const isFavorite = favoriteList.some((fav) => {
        return fav.product === item.product;
      });
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
      return {
        ...item,
        changePercentage,
        text: pair,
        change,
        id: productIterative.toUpperCase().replace('_', '/'),
        shortToken,
        isFavorite,
      };
    });
    const listEmpty = toLocale('spot.noData');
    // langForRaw
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
          <div className="product-list-container-new" style={{ display: isShowList ? 'block' : 'none' }}>
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
          {/* ZCHTODO：删掉原来的product-list-container */}
          {/* style={{ display: isShowList ? 'block' : 'none' }} */}
          {/* <div className="product-list-container" style={{ display: 'none' }}>
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
                  <li className="market-label" style={{ cursor: 'default', height: '26px', lineHeight: '26px' }}>
                    { toLocale('spot.marketDict') }
                  </li>
                  {
                    this.filterGroupList().map((market) => {
                      const { groupId, groupName, groupKey } = market;
                      return (
                        <li
                          key={groupId}
                          className={groupId === activeMarket.groupId ? 'active' : ''}
                          onClick={this.handleMarketChange(market)}
                        >
                          {groupKey ? toLocale(groupKey) : groupName}
                        </li>
                      );
                    })
                  }
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
          </div> */}
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
          <div style={{ display: isShowProduction ? 'block' : 'none' }} className="production-container-outer">
            <div
              className="production-container"
            >
              <Introduce />
            </div>
          </div>
        </span>
      </div>);
  }
}
export default FullTradeProductList;
