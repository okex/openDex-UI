import React from 'react';
import { connect } from 'react-redux';
import { getWsUrl } from '../../utils/websocket';
// import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
// import * as SpotActions from '../../redux/actions/SpotAction';
import './FullTradeKLine.less';
import Config from '../../constants/Config';
import util from '../../utils/util';

function mapStateToProps(state) {
  const { product, depth200, currencyTicker } = state.SpotTrade;
  const {
    currentNode,
  } = state.NodeStore;
  return {
    product,
    depth200,
    currencyTicker,
    currentNode,
  };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FullTradeKLine extends React.Component {
  constructor(props) {
    super(props);
    this.kline = null;
    window.addEventListener('resize', this.onResize);
    this.date = new Date().getTime();
  }
  componentDidMount() { }
  componentWillReceiveProps(nextProps) {
    /* symbol变化相关 */
    const oldProduct = this.props.product;
    const newProduct = nextProps.product;
    const oldTicker = this.props.currencyTicker;
    const newTicker = nextProps.currencyTicker;
    if (newProduct !== oldProduct && newProduct !== '') {
      // symbol发生改变
      // if (oldProduct === '' || !this.kline) {
      //   this.initKline(newProduct);
      // } else {
      //   // this.kline.setSymbol(util.getShortName(newProduct).replace('/', '-'));
      //   if (new Date().getTime() - this.date < 1000) {
      //     return;
      //   }
      //   this.date = new Date().getTime();
      //   this.kline.setSymbol(newProduct.toLowerCase());
      // }
      this.initKline(newProduct);
    }
    if (newTicker && (oldTicker !== newTicker)) {
      const { price } = newTicker;
      // 最新价格发生变化
      this.kline.updateLastData({
        close: Number(price)
      });
    }
    // 200档深度
    const depth = nextProps.depth200;
    depth.asks = depth.asks.map((item) => {
      return [Number(item[0]), Number(item[1])];
    });
    depth.bids = depth.bids.map((item) => {
      return [Number(item[0]), Number(item[1])];
    });

    this.kline && this.kline.setDepth(depth);

    this.onResize();
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }
  // 窗口大小变化
  onResize = () => {
    if (!this.kline) return;
    // const selector = document.querySelector('.full-ticker-kline');
    // const height = selector && selector.getBoundingClientRect().height; // - 50; selector.offsetHeight
    // const width = selector && selector.getBoundingClientRect().width; // selector.style.width;
    // (height > 0 && width > 0) && this.kline.resize(width, height);

    const winHeight = window.innerHeight;
    const topHeight = 50; // 页顶栏高度
    const bottomHeight = 265; // 底部高度
    const minWinHeight = 600; // 窗口最小高度
    const minHeight = minWinHeight - topHeight - bottomHeight; // K线最小高度

    const height = Math.max(winHeight - topHeight - bottomHeight, minHeight);

    const { offsetWidth } = this.klineDom;
    this.kline.resize(offsetWidth, height);
  };
  initKline = (product) => {
    const { httpUrl } = this.props.currentNode;
    // okex线上
    // let wsUrl = 'wss://okexcomreal.bafang.com:10442/ws/v3';
    let wsUrl = getWsUrl();
    let logo;
    let screenshotIcon = 'https://img.bafang.com/cdn/assets/imgs/MjAxOTM/05D71CB3408AD30681388F4D774BABBA.png';
    // okex使用CombKline（双K线)，开发交易所和国际站使用Kline（单K线），java工程中有对应引用
    const Kline = window.okui.CombKline || window.okui.Kline;
    this.kline = new Kline({
      element: '#dex-full-kline-container',
      klineUrl: httpUrl + '/okchain/v1/candles/<symbol>', //  + product
      klineType: 'TradingView',
      showToggle: false,
      wsUrl,
      product: 'dex_spot',
      exchange: 'DEX', // window.OK_GLOBAL.webType,
      // symbol: util.getShortName(product).replace('/', '-'),
      symbol: product.toLowerCase(),
      convertName: (name) => {
        return util.getShortName(name)
      },
      language: util.getSupportLocale(Cookies.get('locale') || 'en_US'),
      showIndics: false,
      logo,
      screenshotIcon,
      onReady: () => {
        console.log('ready');
      },
    });
  };
  // 对K线深度数据进行转换,string => number
  convertedDepthData = (datas) => {
    const { asks, bids } = datas;
    const newAsks = asks.map((item) => {
      return [+item[0], +item[1]];
    });
    const newBids = bids.map((item) => {
      return [+item[0], +item[1]];
    });
    return {
      asks: newAsks,
      bids: newBids
    };
  };
  render() {
    return (
      <div
        className="full-kline"
        style={{ width: '100%' }}
        ref={(dom) => {
          this.klineDom = dom;
        }}
      >
        <div id="dex-full-kline-container" /> {/*style={{ height: '100%' }}*/}
      </div>
    );
  }
}
