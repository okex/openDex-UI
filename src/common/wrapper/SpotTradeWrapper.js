import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { storage } from '_component/okit';
import { wsV3, channelsV3 } from '../utils/websocket';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import * as SpotActions from '../redux/actions/SpotAction';
import * as OrderActions from '../redux/actions/OrderAction';
import * as FormAction from '../redux/actions/FormAction';
import Enum from '../utils/Enum';
import util from '../utils/util';
import env from '../constants/env';

function mapStateToProps(state) {
  const { product, productList, productObj } = state.SpotTrade;
  const { wsIsOnlineV3, wsErrCounterV3, wsIsDelayLogin } = state.Spot;
  return {
    wsIsOnlineV3,
    wsErrCounterV3,
    wsIsDelayLogin,
    product,
    productList,
    productObj,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    spotActions: bindActionCreators(SpotActions, dispatch),
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
    orderActions: bindActionCreators(OrderActions, dispatch),
    formAction: bindActionCreators(FormAction, dispatch),
  };
}

const SpotTradeWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotTrade extends React.Component {
    constructor(props) {
      super(props);
      util.isLogined();
      const { tradeType } = window.OK_GLOBAL;
      this.isFullTrade = tradeType === Enum.tradeType.fullTrade;
    }

    componentDidMount() {
      const {
        spotActions,
        wsIsOnlineV3,
        product,
        productObj,
        productList,
      } = this.props;
      if (product) {
        this.getInitData(product);
        if (wsIsOnlineV3) {
          this.startWs(product);
        }
      } else {
        spotActions.initProduct(productObj, productList, () => {
          if (wsIsOnlineV3) {
            const product1 = storage.get(env.envConfig.token.productKey);
            this.startWs(product1);
          }
        });
      }
      if (this.isFullTrade) {
        const eles = document.querySelector('.entrance');
        if (eles) {
          eles.style.display = 'none';
        }
      }

      const theme = localStorage.getItem('theme');
      if (theme === null) {
        localStorage.setItem('theme', 'theme-1');
        document.body.classList.add('theme-1');
      } else {
        document.body.setAttribute('class', theme);
      }
      document.body.classList.remove('full-body');
    }

    componentWillReceiveProps(nextProps) {
      const { spotTradeActions, orderActions } = this.props;

      const oldProduct = this.props.product;
      const newProduct = nextProps.product;
      if (newProduct !== oldProduct) {
        if (oldProduct === '') {
          this.getInitData(newProduct);
        } else if (newProduct !== '') {
          this.changeProduct(oldProduct, newProduct);
        }
      }

      const newWsIsOnline = nextProps.wsIsOnlineV3;
      const oldWsIsOnline = this.props.wsIsOnlineV3;

      if (newWsIsOnline && nextProps.wsIsDelayLogin) {
        this.delaySubWs(nextProps.product);
      }

      if (!oldWsIsOnline && newWsIsOnline && newProduct !== '') {
        util.isLogined() && spotTradeActions.fetchAccountAssets();
        orderActions.getNoDealList({ page: 1 });
        this.startWs(newProduct);
      }

      const oldWsErrCounter = this.props.wsErrCounterV3;
      const newWsErrCounter = nextProps.wsErrCounterV3;
      if (newWsErrCounter > oldWsErrCounter) {
        if (util.isLogined()) {
          spotTradeActions.fetchAccountAssets();
        }
        spotTradeActions.fetchDepth(newProduct);
      }
    }

    componentWillUnmount() {
      const { wsIsOnlineV3, spotActions } = this.props;
      if (wsIsOnlineV3) {
        this.stopWs();
      }
      spotActions.updateProduct('');
      spotActions.updateWsStatus(false);
      window.OK_GLOBAL.ws_v3 = undefined;
    }

    getInitData = (product) => {
      const { spotTradeActions, wsIsOnlineV3 } = this.props;
      if (util.isLogined()) {
        spotTradeActions.fetchAccountAssets();
      }
      if (!wsIsOnlineV3) {
        spotTradeActions.fetchDepth(product);
      }
    };

    delaySubWs = (product) => {
      const unsubChannels = [];
      const subChannels = [];
      if (util.isLogined()) {
        unsubChannels.push(channelsV3.getBaseBalance(product));
        unsubChannels.push(channelsV3.getQuoteBalance(product));
        unsubChannels.push(channelsV3.getOpenOrder());
        subChannels.push(channelsV3.getBaseBalance(product));
        subChannels.push(channelsV3.getQuoteBalance(product));
        subChannels.push(channelsV3.getOpenOrder());
      }
      wsV3.stop(unsubChannels);
      wsV3.send(subChannels);
    };

    startWs = (product) => {
      const { spotTradeActions } = this.props;
      const v3ChannelArr = [];
      v3ChannelArr.push(channelsV3.getTicker(product));
      spotTradeActions.clearSortPushDepthData();
      v3ChannelArr.push(channelsV3.getDepth(product));
      wsV3.send(v3ChannelArr);
    };

    stopWs = () => {
      const { product } = this.props;
      if (!product) {
        return;
      }
      const v3ChannelArr = [];
      if (util.isLogined()) {
        v3ChannelArr.push(channelsV3.getBaseBalance(product));
        v3ChannelArr.push(channelsV3.getQuoteBalance(product));
        v3ChannelArr.push(channelsV3.getOpenOrder());
      }
      v3ChannelArr.push(channelsV3.getTicker(product));
      v3ChannelArr.push(channelsV3.getDepth(product));
      wsV3.stop(v3ChannelArr);
    };

    changeProduct = (oldProduct, newProduct) => {
      const { wsIsOnlineV3, spotTradeActions } = this.props;
      if (wsIsOnlineV3) {
        const unsubChannels = [];
        const subChannels = [];
        if (util.isLogined()) {
          spotTradeActions.refreshAsset();
          unsubChannels.push(channelsV3.getBaseBalance(oldProduct));
          unsubChannels.push(channelsV3.getQuoteBalance(oldProduct));
          subChannels.push(channelsV3.getBaseBalance(newProduct));
          subChannels.push(channelsV3.getQuoteBalance(newProduct));
        }
        unsubChannels.push(channelsV3.getTicker(oldProduct));
        subChannels.push(channelsV3.getTicker(newProduct));
        unsubChannels.push(channelsV3.getDepth(oldProduct));
        spotTradeActions.clearSortPushDepthData();
        subChannels.push(channelsV3.getDepth(newProduct));

        wsV3.stop(unsubChannels);
        wsV3.send(subChannels);
      } else {
        spotTradeActions.fetchDepth(newProduct);
      }
    };

    render() {
      const { product } = this.props;
      const currProduct = window.OK_GLOBAL.productConfig;
      if (!product || !currProduct) {
        return null;
      }
      return <Component />;
    }
  }

  return SpotTrade;
};

export default SpotTradeWrapper;
