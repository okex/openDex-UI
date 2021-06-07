import React from 'react';
import { connect } from 'react-redux';
import { getWsUrl } from '_src/utils/websocket';
import Cookies from 'js-cookie';
import './FullTradeKLine.less';
import Config from '_src/constants/Config';
import util from '_src/utils/util';
import env from '_src/constants/env';

function mapStateToProps(state) {
  const { product, depth200, currencyTicker } = state.SpotTrade;
  return {
    product,
    depth200,
    currencyTicker,
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
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const oldProduct = this.props.product;
    const newProduct = nextProps.product;
    const oldTicker = this.props.currencyTicker;
    const newTicker = nextProps.currencyTicker;
    if (newProduct !== oldProduct && newProduct !== '') {
      if (oldProduct === '' || !this.kline) {
        this.initKline(newProduct);
      } else {
        this.kline.setSymbol(newProduct.toLowerCase());
      }
    }
    if (newTicker && oldTicker !== newTicker) {
      const { price } = newTicker;
      this.kline.updateLastData({
        close: Number(price),
      });
    }
    const depth = nextProps.depth200;
    depth.asks = depth.asks.map((item) => [Number(item[0]), Number(item[1])]);
    depth.bids = depth.bids.map((item) => [Number(item[0]), Number(item[1])]);

    this.kline && this.kline.setDepth(depth);

    this.onResize();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
  }

  onResize = () => {
    if (!this.kline) return;
    const winHeight = window.innerHeight;
    const topHeight = 50;
    const bottomHeight = 265;
    const minWinHeight = 600;
    const minHeight = minWinHeight - topHeight - bottomHeight;

    const height = Math.max(winHeight - topHeight - bottomHeight, minHeight);

    const { offsetWidth } = this.klineDom;
    this.kline.resize(offsetWidth, height);
  };

  initKline = (product) => {
    let wsUrl = getWsUrl();
    let logo;
    let screenshotIcon =
      'https://static.coinall.ltd/cdn/assets/imgs/MjAxOTM/05D71CB3408AD30681388F4D774BABBA.png';
    const Kline = window.okui.CombKline || window.okui.Kline;
    this.kline = new Kline({
      kId: env.envConfig.kId,
      element: '#full-kline-container',
      klineUrl: `${Config.okexchain.clientUrl}/${env.envConfig.apiPath}/candles/<symbol>`,
      klineType: 'TradingView',
      showToggle: false,
      wsUrl,
      product: 'dex_spot',
      exchange: 'DEX',
      symbol: product.toLowerCase(),
      convertName: (name) => util.getShortName(name),
      language: util.getSupportLocale(Cookies.get('locale') || 'en_US'),
      showIndics: false,
      logo,
      screenshotIcon,
    });
  };

  convertedDepthData = (datas) => {
    const { asks, bids } = datas;
    const newAsks = asks.map((item) => [+item[0], +item[1]]);
    const newBids = bids.map((item) => [+item[0], +item[1]]);
    return {
      asks: newAsks,
      bids: newBids,
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
        <div id="full-kline-container" />
      </div>
    );
  }
}
