import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import FormatWS from '../utils/FormatWS';
import { getConnectCfg, wsV3 } from '../utils/websocket';
import * as SpotActions from '../redux/actions/SpotAction';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import * as OrderAction from '../redux/actions/OrderAction';

import util from '../utils/util';
import history from '../utils/history';
import PageURL from '../constants/PageURL';

function mapStateToProps(state) {
  const { tickers } = state.Spot;
  const { currencyList, productList } = state.SpotTrade;
  return {
    currencyList, productList, tickers
  };
}

function mapDispatchToProps(dispatch) { // 绑定action，以便向redux发送action
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
    orderAction: bindActionCreators(OrderAction, dispatch),
  };
}

// 全屏交易/简约交易相关页面
const InitWrapper = (Component) => {
  @withRouter
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotInit extends React.Component {
    componentDidMount() {
      const { match } = this.props;
      if (match.path.includes('/spot/fullMargin') || match.path.includes('/spot/marginTrade')) {
        window.OK_GLOBAL.isMarginType = true;
      }
      this.sendBasicAjax();
      this.startInitWebSocket();
      const header = document.querySelector('.spot-head-box');
      const left = document.querySelector('.left-menu-container');
      if (header) {
        header.style = 'block';
      }
      if (left) {
        left.style = 'block';
      }
    }
    componentWillReceiveProps() {
      // 如果登录状态从未登录变成已登录时,页面刷新
      // 考虑到在另一个tab页进行登录的情况
      // const currentIsLogin = !!localStorage.getItem('dex_token');
      // if (!window.OK_GLOBAL.isLogin && currentIsLogin) {
      //   window.location.reload();
      // }
    }
    componentWillUnmount() {
    }

    // 基础ajax，其他业务数据对此有依赖
    sendBasicAjax = () => {
      const { spotActions } = this.props;
      // 获取所有收藏的币对 和 所有在线币对基础配置
      spotActions.fetchCollectAndProducts();
      // 获取所有币对行情
      spotActions.fetchTickers();
      // 获取所有币种的配置
      spotActions.fetchCurrency();
    };
    wsHandler = (table) => {
      const { orderAction, spotTradeActions, spotActions } = this.props;
      const fns = {
        'dex_spot/account': (data) => {
          spotTradeActions.wsUpdateAsset(data);
        },
        'dex_spot/order': (data) => {
          // orderAction.wsUpdateList(FormatWS.order(data));
          orderAction.wsUpdateList(data);
        },
        'dex_spot/ticker': (data) => {
          spotTradeActions.wsUpdateTicker(FormatWS.ticker(data));
        },
        'dex_spot/all_ticker_3s': (data) => {
          spotActions.wsUpdateTickers(FormatWS.allTickers(data));
        },
        'dex_spot/optimized_depth': (data, res) => {
          spotTradeActions.wsUpdateDepth(FormatWS.depth(res));
        },
        'dex_spot/matches': (data) => {
          spotTradeActions.wsUpdateDeals(data);
        },
      };
      return fns[table.split(':')[0]];
    };
    // 建立ws连接
    startInitWebSocket = () => {
      const OK_GLOBAL = window.OK_GLOBAL;
      if (!OK_GLOBAL.ws_v3) {
        const { spotActions } = this.props;
        OK_GLOBAL.ws_v3 = new window.WebSocketCore(getConnectCfg());
        const v3 = OK_GLOBAL.ws_v3;
        v3.onSocketConnected(() => {
          function getJwtToken() {
            if (!util.isLogined()) {
              setTimeout(getJwtToken, 1000);
            } else {
              wsV3.login(util.getMyAddr());
            }
          }
          // 针对未登陆，用户使用三种方式登录
          if (!util.isLogined()) {
            getJwtToken();
          } else { // 针对已登录，用户刷新
            wsV3.login(util.getMyAddr());
          }
          spotActions.updateWsStatus(true);
        });
        v3.onSocketError(() => {
          spotActions.addWsErrCounter(); // 累计加1
          spotActions.updateWsStatus(false);
          spotActions.updateWsIsDelay(false);
        });
        v3.onPushDiscontinue(() => {
          v3.sendChannel('ping');
        });
        v3.setPushDataResolver((pushData) => {
          const {
            table, data, event, success, errorCode
          } = pushData;
          if (table && data) {
            const handler = this.wsHandler(table);
            handler && handler(data, pushData);
          }
          if (event === 'dex_login' && success === true) {
            spotActions.updateWsIsDelay(true);
          }
          // 如果token过期，相当于退出，强制用户重新登录
          if (event === 'error' && (Number(errorCode) === 30043 || Number(errorCode) === 30008 || Number(errorCode) === 30006)) {
            util.doLogout();
            history.push(PageURL.homePage);
          }
        });
        v3.connect();
      }

      if (OK_GLOBAL.ws_v3 && OK_GLOBAL.ws_v3.isConnected() && util.isLogined()) {
        wsV3.login(util.getMyAddr());
      }
    };
    render() {
      const { currencyList, productList, tickers } = this.props;
      if (currencyList && currencyList.length // 所有单币种信息
        && productList && productList.length // 所有币对信息
      ) { // 行情信息 && Object.keys(tickers).length
        return <Component />;
      }
      return null;
    }
  }
  return SpotInit;
};
export default InitWrapper;
