import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as SwapAction from '_src/redux/actions/SwapAction';
import util from '_src/utils/util';
import { getWsV3 } from '_src/utils/websocket';

function mapStateToProps(state) {
  const { currentNode } = state.NodeStore;
  return {
    currentNode,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    swapAction: bindActionCreators(SwapAction, dispatch),
  };
}

const SwapPushWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class SwapPush extends React.Component {
    constructor(props) {
      super(props);
      const {
        currentNode: { wsUrl },
      } = props;
      if (wsUrl) this.startInitWebSocket(wsUrl);
    }

    componentWillUnmount() {
      if (this.wsV3) {
        this.wsV3.disconnect();
        this.wsV3 = null;
        this.wsV3Instance = null;
      }
    }

    wsHandler = (table) => {
      const { swapAction } = this.props;
      const fns = {
        'dex_spot/account': (data) => {
          swapAction.updateAccount(data);
        },
      };
      return fns[table.split(':')[0]];
    };

    startInitWebSocket = (wsUrl) => {
      if (!window.WebSocketCore) return;
      const wsV3 = new window.WebSocketCore({ connectUrl: wsUrl });
      this.wsV3 = wsV3;
      this.wsV3Instance = getWsV3(wsV3);
      wsV3.onSocketConnected(() => {
        if (util.isLogined()) {
          this.wsV3Instance.login(util.getMyAddr());
        }
        this.wsV3Instance.process();
      });
      wsV3.onSocketError(() => {});
      wsV3.onPushDiscontinue(() => {
        wsV3.sendChannel('ping');
      });
      wsV3.setPushDataResolver((pushData) => {
        console.log(pushData);
        const { table, data, event, errorCode } = pushData;
        if (table && data) {
          const handler = this.wsHandler(table);
          handler && handler(data, pushData);
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
      wsV3.connect();
    };
    render() {
      return <Component {...this.props} wsV3={this.wsV3Instance} />;
    }
  }
  return SwapPush;
};
export default SwapPushWrapper;
