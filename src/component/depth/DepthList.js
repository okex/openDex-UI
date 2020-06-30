import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import React from 'react';
import PropTypes from 'prop-types';
import Cookies from 'js-cookie';
// import { calc } from '_component/okit';
import DepthTooltip from './DepthTooltip';
import './DepthList.less';
import DepthBar from '../../utils/DepthBar';
import EnumUtil from '../../utils/Enum';
import util from '../../utils/util';

const Enum = {
  dark: 'dark',
  up: 'up',
  down: 'down',
  buy: EnumUtil.placeOrder.type.buy,
  sell: EnumUtil.placeOrder.type.sell,
};
export default class DepthList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sellIndex: -1,
      buyIndex: -1,
      isShowMergeList: false
    };
  }
  // 组件再次render后，深度数据已经渲染，此时再进行垂直居中计算
  componentDidUpdate(prevProps) {
    let needToCenter = false; // 是否需要居中
    const prevData = prevProps.dataSource;
    const nowData = this.props.dataSource;

    try {
      // 上一次dataSource为空，且本次有数据，则认为需要重新居中
      if (!prevData.sellList.length && !prevData.buyList.length) {
        if (nowData.sellList.length || nowData.buyList.length) {
          needToCenter = true;
        }
      }
      // 如果需要居中，则判断是否出现滚动条，若有滚动条，则进行滚动居中操作
      if (needToCenter) {
        this.tickerCloneDom.style.visibility = 'hidden';
        // 出现滚动条的情况
        if (this.scrollDom.scrollHeight > this.scrollDom.clientHeight) {
          this.toCenter();
        }
      }
    } catch (e) {
      //
    }
  }


  // 合并系数over
  onMergeTypeOver = () => {
    this.setState({
      isShowMergeList: true
    });
  };
  // 合并系数out
  onMergeTypeOut = () => {
    this.setState({
      isShowMergeList: false
    });
  };
  // 选择某个合并系数
  setChooseMergeType = (key) => {
    return () => {
      this.setState({
        isShowMergeList: false
      });
      const { onChooseMergeType } = this.props;
      onChooseMergeType && onChooseMergeType(key);
    };
  };

  // ticker居中
  // toCenter = () => {
  //   const { centerBarDom, scrollDom } = this;
  //   scrollDom.scrollTop = centerBarDom.offsetTop
  //     - (scrollDom.clientHeight / 2)
  //     + (centerBarDom.clientHeight / 2);
  // };

  // 浮点转'X'位小数
  floatToXDecimal = (originFloat) => {
    const tempStr = originFloat.toString();
    let intlId = 'spot.xDecimal';
    let preStr = '';
    switch (tempStr) {
      case '0.1':
        preStr = 1;
        intlId = 'spot.singleDecimal';
        break;
      case '1':
        preStr = '0';
        break;
      case '10':
        intlId = 'spot.10Decimal';
        break;
      case '100':
        intlId = 'spot.100Decimal';
        break;
      case '1000':
        intlId = 'spot.1000Decimal';
        break;
      case '10000':
        intlId = 'spot.10000Decimal';
        break;
      default:
        preStr = tempStr.length - (tempStr.indexOf('.') + 1);
        break;
    }
    const locale = util.getSupportLocale(Cookies.get('locale') || 'en_US');
    if (locale && locale.indexOf('ko') > -1) { // 韩国站单独特殊处理
      if (Number(tempStr) < 10) {
        preStr = tempStr;
        intlId = 'spot.xDecimal';
      }
    }
    return (
      <span className="spot-depth-desc">
        {preStr}
        {toLocale(intlId)}
      </span>
    );
  };

  // 手动设置事件
  // 滚动事件，改变ticker clone状态
  scrollToPosition = (position) => {
    const { scrollDom, tickerDom, tickerCloneDom } = this;
    const cloneStyle = tickerCloneDom.style;
    const maxScrollPx = tickerDom.offsetTop;
    const minScrollPx = tickerDom.offsetTop - scrollDom.clientHeight + tickerDom.clientHeight;
    if (position === 'top') { // ticker clone置顶
      scrollDom.scrollTop = maxScrollPx;
    } else if (position === 'bottom') { // ticker clone置底
      scrollDom.scrollTop = minScrollPx;
    } else if (position === 'center') { // ticker 居中
      this.toCenter();
    } else {
      cloneStyle.visibility = 'hidden';
    }
  };
  /*
  scrollToPosition = (position) => {
    const { scrollDom, centerBarDom, tickerCloneDom } = this;
    const cloneStyle = tickerCloneDom.style;
    const maxScrollPx = centerBarDom.offsetTop;
    const minScrollPx = centerBarDom.offsetTop - scrollDom.clientHeight + centerBarDom.clientHeight;
    if (position === 'top') { // ticker clone置顶
      scrollDom.scrollTop = maxScrollPx;
    } else if (position === 'bottom') { // ticker clone置底
      scrollDom.scrollTop = minScrollPx;
    } else if (position === 'center') { // ticker 居中
      this.toCenter();
      // scrollDom.scrollTop = centerBarDom.offsetTop - (scrollDom.clientHeight / 2) + (centerBarDom.clientHeight / 2);
    } else {
      cloneStyle.visibility = 'hidden';
    }
  };
  // 滚动事件，改变ticker clone状态
  handleScrollForTickerClone = () => {
    const { scrollDom, centerBarDom, tickerCloneDom } = this;
    const cloneStyle = tickerCloneDom.style;
    const maxScrollPx = centerBarDom.offsetTop - 28;
    if (scrollDom.scrollTop > maxScrollPx) { // ticker clone置底
      cloneStyle.bottom = 0;
      cloneStyle.top = 'unset';
      cloneStyle.visibility = 'visible';
    } else if (scrollDom.scrollTop == 0) { // ticker clone置顶
      cloneStyle.bottom = 'unset';
      cloneStyle.top = 0;
      cloneStyle.visibility = 'visible';
    } else { // ticker clone隐藏
      cloneStyle.visibility = 'hidden';
    }
  }; */

  // 滚动事件，改变ticker clone状态
  handleScroll = () => {
    const { scrollDom, tickerDom, tickerCloneDom } = this;
    const cloneStyle = tickerCloneDom.style;
    const maxScrollPx = tickerDom.offsetTop;
    const minScrollPx = tickerDom.offsetTop - scrollDom.clientHeight + tickerDom.clientHeight;
    if (scrollDom.scrollTop > maxScrollPx) { // ticker clone置顶
      cloneStyle.top = 0;
      cloneStyle.bottom = 'unset';
      cloneStyle.visibility = 'visible';
    } else if (scrollDom.scrollTop < minScrollPx) { // ticker clone置底
      cloneStyle.bottom = 0;
      cloneStyle.top = 'unset';
      cloneStyle.visibility = 'visible';
    } else { // ticker clone隐藏
      cloneStyle.visibility = 'hidden';
    }
  };
  // ticker居中
  toCenter = () => {
    const { tickerDom, scrollDom } = this;
    scrollDom.scrollTop = tickerDom.offsetTop
      - (scrollDom.clientHeight / 2)
      + (tickerDom.clientHeight / 2);
  };
  // 点击某条数据
  handleClickItem = (index, type) => {
    return () => {
      const { selectItem } = this.props;
      selectItem && selectItem(index, type);
    };
  };

  render() {
    const { sellIndex, buyIndex } = this.state;
    const {
      needSum, needBgColor, dataSource, style, columnTitle, toCenterLabel, theme, product
    } = this.props;
    const { sellList, buyList, ticker } = dataSource;
    const trendClass = ticker.trend === Enum.down ? 'down' : 'up';
    const iconClass = `icon-${trendClass}`;
    const isDark = theme === Enum.dark;
    const containerClass = isDark ? 'ok-depth-container-dark' : 'ok-depth-container';
    // 全屏交易需要widthBar
    const median = needBgColor ? DepthBar.medianUnit(sellList, buyList) : 0; // 返回没有逗号，不需要再判断
    // const config = window.OK_GLOBAL.productConfig;
    // const { mergeType, mergeTypes } = config;
    //
    // const defaultMerge = (mergeTypes && mergeTypes.split) ? mergeTypes.split(',')[0] : EnumUtil.defaultMergeType;
    // const { isShowMergeList } = this.state;
    // const allMerge = (mergeTypes && mergeTypes.split) ? mergeTypes.split(',') : EnumUtil.defaultMergeTypes;
    // const currMergeType = mergeType || defaultMerge;
    return (
      <div
        className={containerClass}
        style={style}
        // ref={(dom) => {
        //   if (dom) {
        //     this.scrollDom = dom.parentElement.parentElement;
        //     this.scrollDom.onscroll = this.handleScrollForTickerClone;
        //   }
        // }}
      >
        <div className="title">
          {columnTitle.map((item, index) => {
            return <span key={`ok-depth-title${index}`}>{item}</span>;
          })}
        </div>
        <div className="scroll-container">
          <div
            className="scroll-box"
            ref={(dom) => {
              this.scrollDom = dom;
            }}
            onScroll={this.handleScroll}
          >
            <ul className="sell-list">
              {sellList.map((item, index) => {
                const {
                  price, amount, amountValue, sum, tooltipSum, tooltipTotal, tooltipAvg
                } = item;
                let barWidth = 0;
                if (needBgColor) {
                  barWidth = `${DepthBar.width(amount.replace(/,/, ''), median)}%`;
                }
                return (
                  <DepthTooltip
                    key={`ok-depth-sell-tooltip-${index}`}
                    tooltipAvg={tooltipAvg}
                    tooltipTotal={tooltipTotal}
                    tooltipSum={tooltipSum}
                    placement={isDark ? 'right' : 'left'}
                    symbol={product}
                    align={{
                      offset: isDark ? [6, -10] : [-10, -10],
                    }}
                  >
                    <li
                      key={`ok-depth-sell-${index}`}
                      className={`sell-item ${sellIndex > -1 && index >= sellIndex ? 'has-bg' : ''}`}
                      onClick={this.handleClickItem(index, Enum.sell)}
                      onMouseEnter={() => { this.setState({ sellIndex: index }); }}
                      onMouseLeave={() => { this.setState({ sellIndex: -1 }); }}
                    >
                      <span>{price}</span>
                      <span>{amountValue < 0.001 ? '0.001' : amount}</span>
                      {needSum && <span>{sum}</span>}
                      {needBgColor && <div className="process-bar" style={{ width: barWidth }} />}
                    </li>
                  </DepthTooltip>
                );
              })}
            </ul>
            {/* <div
              className="center-bar"
              ref={(dom) => {
                   this.centerBarDom = dom;
                 }}
            > */}
            {/* 行情 */}
            <div
              className={`${trendClass} ticker`}
              ref={(dom) => {
                this.tickerDom = dom;
              }}
            >
              <span>{(ticker.price === undefined || ticker.price === 'NaN') ? '-- ' : ticker.price}</span>
              <Icon className={iconClass} />
            </div>
            {/* 合并深度
              <div
                className="spot-depth-drop"
                style={{ display: this.props.isShowMerge ? 'block' : 'none' }}
                onMouseOver={this.onMergeTypeOver}
                onMouseOut={this.onMergeTypeOut}
              >
                {this.floatToXDecimal(currMergeType)}
                <Icon className="icon-spread" />
                <div
                  className="spot-depth-drop-list"
                  style={{ display: isShowMergeList ? 'block' : 'none' }}
                >
                  {
                    allMerge.map((x, index) => {
                      return (
                        <p
                          onClick={this.setChooseMergeType(x)}
                          key={index.toString() + x}
                        >
                          {this.floatToXDecimal(x)}
                        </p>
                      );
                    })
                  }
                </div>
              </div> */}
            {/* </div> */}
            <ul className="buy-list">
              {buyList.map((item, index) => {
                const {
                  price, amount, amountValue, sum, tooltipSum, tooltipTotal, tooltipAvg
                } = item;
                let barWidth = 0;
                if (needBgColor) {
                  barWidth = `${DepthBar.width(amount.replace(/,/, ''), median)}%`;
                }
                return (
                  <DepthTooltip
                    key={`ok-depth-buy-tooltip-${index}`}
                    tooltipAvg={tooltipAvg}
                    tooltipTotal={tooltipTotal}
                    tooltipSum={tooltipSum}
                    placement={isDark ? 'right' : 'left'}
                    symbol={product}
                    align={{
                      offset: isDark ? [6, 8] : [-10, 10],
                    }}
                  >
                    <li
                      key={`ok-depth-buy-${index}`}
                      className={`buy-item ${buyIndex > -1 && index <= buyIndex ? 'has-bg' : ''}`}
                      onClick={this.handleClickItem(index, Enum.buy)}
                      onMouseEnter={() => { this.setState({ buyIndex: index }); }}
                      onMouseLeave={() => { this.setState({ buyIndex: -1 }); }}
                    >
                      <span>{price}</span>
                      <span>{amountValue < 0.001 ? '0.001' : amount}</span>
                      {needSum && <span>{sum}</span>}
                      {
                        needBgColor && <div className="process-bar" style={{ width: barWidth }} />
                      }
                    </li>
                  </DepthTooltip>
                );
              })}
            </ul>
          </div>
          {/* 行情clone（动态浮动） */}
          {/* (this.scrollDom && (this.scrollDom.scrollHeight > this.scrollDom.clientHeight)) */}
          <div
            className={`${trendClass} ticker-clone`}
            ref={(dom) => {
              this.tickerCloneDom = dom;
            }}
          >
            <span>{ticker.price}</span>
            <Icon className={iconClass} />
            <div
              className="return-center"
              onClick={this.toCenter}
            >
              {toCenterLabel}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
DepthList.defaultProps = {
  isShowMerge: true,
  onChooseMergeType: null,
  dataSource: {
    sellList: [],
    buyList: [],
    ticker: {
      price: '--',
      trend: Enum.up
    }
  },
  style: {},
  columnTitle: [],
  selectItem: null,
  toCenterLabel: '返回盘口',
  theme: ''
};
DepthList.propTypes = {
  isShowMerge: PropTypes.bool,
  onChooseMergeType: PropTypes.func,
  dataSource: PropTypes.object,
  style: PropTypes.object,
  columnTitle: PropTypes.array,
  selectItem: PropTypes.func,
  toCenterLabel: PropTypes.string,
  theme: PropTypes.string
};
