import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { storage } from '_component/okit';
import Cookies from 'js-cookie';
import { wsV3, channelsV3 } from '../utils/websocket';
// import RouterCredential from '../RouterCredential';
import * as CommonActions from '../redux/actions/CommonAction';
import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import * as SpotActions from '../redux/actions/SpotAction';
import * as OrderActions from '../redux/actions/OrderAction';
import * as FormAction from '../redux/actions/FormAction';
import Enum from '../utils/Enum';
import util from '../utils/util';


function mapStateToProps(state) {
  const {
    product, productList, productObj
  } = state.SpotTrade;
  const { wsIsOnlineV3, wsErrCounterV3, wsIsDelayLogin } = state.Spot;
  return {
    wsIsOnlineV3,
    wsErrCounterV3,
    wsIsDelayLogin,
    product,
    productList,
    productObj
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonActions: bindActionCreators(CommonActions, dispatch),
    spotActions: bindActionCreators(SpotActions, dispatch),
    spotTradeActions: bindActionCreators(SpotTradeActions, dispatch),
    orderActions: bindActionCreators(OrderActions, dispatch),
    formAction: bindActionCreators(FormAction, dispatch),
  };
}

// 全屏交易/简约交易调用
const SpotTradeWrapper = (Component) => {
  @connect(mapStateToProps, mapDispatchToProps) // 与redux相关的组件再用connect修饰，容器组件
  class SpotTrade extends React.Component {
    constructor(props) {
      super(props);
      util.isLogined(); // 为确保正确
      const { tradeType } = window.OK_GLOBAL;
      this.isFullTrade = tradeType === Enum.tradeType.fullTrade;
    }

    componentDidMount() {
      const {
        spotActions, commonActions, wsIsOnlineV3, product, productObj, productList
      } = this.props;
      if (product) { // 从其他页面（账单等）切回来，开始redux中就有product
        this.getInitData(product); // 获取初始全量数据（api方式）
        // 订阅ws
        if (wsIsOnlineV3) {
          this.startWs(product);
        }
      } else {
        // 初始化product
        spotActions.initProduct(productObj, productList, () => {
          // 订阅ws
          if (wsIsOnlineV3) {
            const product1 = storage.get('product');
            this.startWs(product1);
          }
        });
      }
      // 全屏交易隐藏我的客服
      if (this.isFullTrade) {
        const eles = document.querySelector('.entrance');
        if (eles) {
          eles.style.display = 'none';
        }
      }

      // 初始化 主题
      const theme = localStorage.getItem('theme');
      if (theme === null) {
        localStorage.setItem('theme', 'theme-1');
        // document.body.setAttribute('class', 'theme-1');
        document.body.classList.add('theme-1');
      } else {
        document.body.setAttribute('class', theme);
      }
      document.body.classList.remove('full-body');

      // 初始化okchain客户端 TODO已经加载过了还要加载？？？
      // commonActions.initOKChainClient();
    }

    componentWillReceiveProps(nextProps) {
      const {
        spotTradeActions, orderActions
      } = this.props;

      /* product变化相关 */
      const oldProduct = this.props.product;
      const newProduct = nextProps.product;
      if (newProduct !== oldProduct) {
        if (oldProduct === '') { // 首次获取product
          this.getInitData(newProduct);
        } else if (newProduct !== '') { // product发生改变，比如左侧菜单切换
          this.changeProduct(oldProduct, newProduct);
        }
      }

      /* ws状态变化相关 */
      const newWsIsOnline = nextProps.wsIsOnlineV3;
      const oldWsIsOnline = this.props.wsIsOnlineV3;

      // 检测延迟变化
      if (newWsIsOnline && nextProps.wsIsDelayLogin) { // && (this.props.wsIsDelayLogin !== nextProps.wsIsDelayLogin)
        this.delaySubWs(nextProps.product);
      }

      // ws首次连接或者重连成功
      if (!oldWsIsOnline && newWsIsOnline && newProduct !== '') {
        // 【断网补偿】获取我的资产和订单
        util.isLogined() && spotTradeActions.fetchAccountAssets();
        orderActions.getNoDealList({ page: 1 });
        // 连接推送
        this.startWs(newProduct);
      }

      // ws断线，执行轮询
      const oldWsErrCounter = this.props.wsErrCounterV3;
      const newWsErrCounter = nextProps.wsErrCounterV3;
      // ws断线，执行轮询
      if (newWsErrCounter > oldWsErrCounter) {
        // 获取所有币对行情的逻辑在 ProductListMenu 组件中
        // 获取资产
        if (util.isLogined()) {
          spotTradeActions.fetchAccountAssets();
          // orderActions.getNoDealList({ page: 1 });
        }
        // 更新深度
        spotTradeActions.fetchDepth(newProduct);
      }
    }

    componentWillUnmount() {
      const { wsIsOnlineV3, spotActions } = this.props;
      if (wsIsOnlineV3) {
        this.stopWs();
      }
      spotActions.updateProduct('');
    }

    // 获取初始全量数据（api方式）
    getInitData = (product) => {
      const { spotTradeActions, wsIsOnlineV3 } = this.props;
      // 1，资产
      if (util.isLogined()) { // const { isLogin } = window.OK_GLOBAL;
        spotTradeActions.fetchAccountAssets();
      }
      // 2，深度
      // ws断线时，使用ajax数据；若ws链接，则使用ws数据
      if (!wsIsOnlineV3) {
        spotTradeActions.fetchDepth(product);
      }
    };

    delaySubWs = (product) => {
      const unsubChannels = [];
      const subChannels = [];
      // 更新币币资产
      if (util.isLogined()) {
        unsubChannels.push(channelsV3.getBaseBalance(product)); // 订阅base资产
        unsubChannels.push(channelsV3.getQuoteBalance(product)); // 订阅quote资产
        unsubChannels.push(channelsV3.getOpenOrder()); // 订阅quote资产
        subChannels.push(channelsV3.getBaseBalance(product)); // 订阅base资产
        subChannels.push(channelsV3.getQuoteBalance(product)); // 订阅quote资产
        subChannels.push(channelsV3.getOpenOrder()); // 订阅quote资产
      }
      // 统一取消老订阅、发布新订阅
      wsV3.stop(unsubChannels);
      wsV3.send(subChannels);
    };
    // 开启ws订阅
    startWs = (product) => {
      const { spotTradeActions } = this.props;
      const v3ChannelArr = [];
      // if (util.isWsLogin()) {
      //   v3ChannelArr.push(channelsV3.getBaseBalance(product)); // 订阅base资产
      //   v3ChannelArr.push(channelsV3.getQuoteBalance(product)); // 订阅quote资产
      //   v3ChannelArr.push(channelsV3.getOpenOrder()); // 订阅全部未成交订单
      // }
      // 订阅当前币对ticker
      v3ChannelArr.push(channelsV3.getTicker(product));
      // 订阅全部币对all_tickers_3s getAllMarketTickers 在 FullTradeProduct.js中
      // 清空深度缓存数据
      spotTradeActions.clearSortPushDepthData();
      // 订阅深度
      v3ChannelArr.push(channelsV3.getDepth(product));
      wsV3.send(v3ChannelArr);
    };
    // 停止ws订阅
    stopWs = () => {
      const { product } = this.props;
      if (!product) {
        return;
      }
      const v3ChannelArr = [];
      if (util.isLogined()) {
        // 停止订阅全部币对资产
        v3ChannelArr.push(channelsV3.getBaseBalance(product));
        v3ChannelArr.push(channelsV3.getQuoteBalance(product));
        v3ChannelArr.push(channelsV3.getOpenOrder());
      }
      // 停止订阅当前币对ticker
      v3ChannelArr.push(channelsV3.getTicker(product));
      // 停止订阅深度
      v3ChannelArr.push(channelsV3.getDepth(product));
      wsV3.stop(v3ChannelArr);
    };

    // 切币
    changeProduct = (oldProduct, newProduct) => {
      const {
        wsIsOnlineV3, spotTradeActions
      } = this.props;
      if (wsIsOnlineV3) {
        const unsubChannels = [];
        const subChannels = [];
        // 更新币币资产
        if (util.isLogined()) {
          spotTradeActions.refreshAsset();
          unsubChannels.push(channelsV3.getBaseBalance(oldProduct)); // 订阅base资产
          unsubChannels.push(channelsV3.getQuoteBalance(oldProduct)); // 订阅quote资产
          subChannels.push(channelsV3.getBaseBalance(newProduct)); // 订阅base资产
          subChannels.push(channelsV3.getQuoteBalance(newProduct)); // 订阅quote资产
        }
        // 当前币对ticker
        unsubChannels.push(channelsV3.getTicker(oldProduct));
        subChannels.push(channelsV3.getTicker(newProduct));
        // 深度
        unsubChannels.push(channelsV3.getDepth(oldProduct));
        spotTradeActions.clearSortPushDepthData(); // 清空深度缓存
        subChannels.push(channelsV3.getDepth(newProduct));

        // 统一取消老订阅、发布新订阅
        wsV3.stop(unsubChannels);
        wsV3.send(subChannels);
      } else { // ws未连接，则通过ajax方式保证数据正确显示
        // tickers的数据刷新逻辑在 productListMenu 组件中
        // 更新深度
        spotTradeActions.fetchDepth(newProduct);
      }
    };

    render() {
      const { product } = this.props;
      const currProduct = window.OK_GLOBAL.productConfig;
      if (!product || !currProduct) {
        return null;
      }
      return (<Component />);
    }
  }

  return SpotTrade;
};

export default SpotTradeWrapper;
