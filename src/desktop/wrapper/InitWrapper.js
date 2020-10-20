import React from 'react';
import { bindActionCreators } from 'redux';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import * as NodeActions from '_app/redux/actions/NodeAction';
import FormatWS from '_src/utils/FormatWS';
import { wsV3 } from '_src/utils/websocket';
import * as SpotActions from '_src/redux/actions/SpotAction';
import * as SpotTradeActions from '_src/redux/actions/SpotTradeAction';
import * as OrderAction from '_src/redux/actions/OrderAction';

import util from '_src/utils/util';

function mapStateToProps(state) {
  const { tickers } = state.Spot;
  const { currencyList, productList } = state.SpotTrade;
  const { currentNode } = state.NodeStore;
  return {
    currencyList,
    productList,
    tickers,
    currentNode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
    orderAction: bindActionCreators(OrderAction, dispatch),
    nodeActions: bindActionCreators(NodeActions, dispatch),
  };
}

const InitWrapper = (Component) => {
  @withRouter
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotInit extends React.Component {
    componentDidMount() {
      const { match, currentNode } = this.props;
      const { wsUrl, httpUrl } = currentNode;
      if (
        match.path.includes('/spot/fullMargin') ||
        match.path.includes('/spot/marginTrade')
      ) {
        window.OK_GLOBAL.isMarginType = true;
      }
      if (httpUrl) {
        this.sendBasicAjax();
      }
      if (wsUrl) {
        this.startInitWebSocket(wsUrl);
      }
      const header = document.querySelector('.spot-head-box');
      const left = document.querySelector('.left-menu-container');
      if (header) {
        header.style = 'block';
      }
      if (left) {
        left.style = 'block';
      }
    }

    componentDidUpdate(prevProps) {
      if (prevProps.currentNode !== this.props.currentNode) {
        window.location.reload();
      }
    }

    sendBasicAjax = () => {
      const { spotActions } = this.props;
      spotActions.fetchCollectAndProducts();
      spotActions.fetchTickers();
      spotActions.fetchCurrency();
    };
    wsHandler = (table) => {
      const { orderAction, spotTradeActions, spotActions } = this.props;
      const fns = {
        'dex_spot/account': (data) => {
          spotTradeActions.wsUpdateAsset(data);
        },
        'dex_spot/order': (data) => {
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
    startInitWebSocket = (wsUrl) => {
      if (!window.WebSocketCore) return;
      const OK_GLOBAL = window.OK_GLOBAL;
      if (!OK_GLOBAL.ws_v3) {
        const { spotActions, nodeActions } = this.props;
        OK_GLOBAL.ws_v3 = new window.WebSocketCore({ connectUrl: wsUrl });
        const v3 = OK_GLOBAL.ws_v3;
        v3.onSocketConnected(() => {
          function getJwtToken() {
            if (!util.isLogined()) {
              setTimeout(getJwtToken, 1000);
            } else {
              wsV3.login(util.getMyAddr());
            }
          }
          if (!util.isLogined()) {
            getJwtToken();
          } else {
            wsV3.login(util.getMyAddr());
          }
          spotActions.updateWsStatus(true);
        });
        v3.onSocketError(() => {
          nodeActions.startCheckBreakTime();
          spotActions.addWsErrCounter();
          spotActions.updateWsStatus(false);
          spotActions.updateWsIsDelay(false);
        });
        v3.onPushDiscontinue(() => {
          v3.sendChannel('ping');
        });
        v3.setPushDataResolver((pushData) => {
          console.log(pushData);
          const { table, data, event, success, errorCode } = pushData;
          if (table && data) {
            const handler = this.wsHandler(table);
            handler && handler(data, pushData);
          }
          if (event === 'dex_login' && success === true) {
            spotActions.updateWsIsDelay(true);
          }
          if (
            event === 'error' &&
            (Number(errorCode) === 30043 ||
              Number(errorCode) === 30008 ||
              Number(errorCode) === 30006)
          ) {
            util.doLogout();
          }
        });
        v3.connect();
      }

      if (wsV3.canSend() && util.isLogined()) {
        wsV3.login(util.getMyAddr());
      }
    };
    render() {
      const { currencyList, productList } = this.props;
      if (
        currencyList &&
        currencyList.length &&
        productList &&
        productList.length
      ) {
        return <Component />;
      }
      return null;
    }
  }
  return SpotInit;
};
export default InitWrapper;
