import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import React from 'react';
import PropTypes from 'prop-types';
import DepthTooltip from './DepthTooltip';
import './DepthList.less';
import DepthBar from '../../utils/DepthBar';
import EnumUtil from '../../utils/Enum';

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
    };
  }

  componentDidUpdate(prevProps) {
    let needToCenter = false;
    const prevData = prevProps.dataSource;
    const nowData = this.props.dataSource;

    try {
      if (!prevData.sellList.length && !prevData.buyList.length) {
        if (nowData.sellList.length || nowData.buyList.length) {
          needToCenter = true;
        }
      }
      if (needToCenter) {
        this.tickerCloneDom.style.visibility = 'hidden';
        if (this.scrollDom.scrollHeight > this.scrollDom.clientHeight) {
          this.toCenter();
        }
      }
    } catch (e) {
      console.log(e);
    }
  }

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
    return (
      <span className="spot-depth-desc">
        {preStr}
        {toLocale(intlId)}
      </span>
    );
  };

  scrollToPosition = (position) => {
    const { scrollDom, tickerDom, tickerCloneDom } = this;
    const cloneStyle = tickerCloneDom.style;
    const maxScrollPx = tickerDom.offsetTop;
    const minScrollPx =
      tickerDom.offsetTop - scrollDom.clientHeight + tickerDom.clientHeight;
    if (position === 'top') {
      scrollDom.scrollTop = maxScrollPx;
    } else if (position === 'bottom') {
      scrollDom.scrollTop = minScrollPx;
    } else if (position === 'center') {
      this.toCenter();
    } else {
      cloneStyle.visibility = 'hidden';
    }
  };

  handleScroll = () => {
    const { scrollDom, tickerDom, tickerCloneDom } = this;
    const cloneStyle = tickerCloneDom.style;
    const maxScrollPx = tickerDom.offsetTop;
    const minScrollPx =
      tickerDom.offsetTop - scrollDom.clientHeight + tickerDom.clientHeight;
    if (scrollDom.scrollTop > maxScrollPx) {
      cloneStyle.top = 0;
      cloneStyle.bottom = 'unset';
      cloneStyle.visibility = 'visible';
    } else if (scrollDom.scrollTop < minScrollPx) {
      cloneStyle.bottom = 0;
      cloneStyle.top = 'unset';
      cloneStyle.visibility = 'visible';
    } else {
      cloneStyle.visibility = 'hidden';
    }
  };

  toCenter = () => {
    const { tickerDom, scrollDom } = this;
    scrollDom.scrollTop =
      tickerDom.offsetTop -
      scrollDom.clientHeight / 2 +
      tickerDom.clientHeight / 2;
  };

  handleClickItem = (index, type) => () => {
    const { selectItem } = this.props;
    selectItem && selectItem(index, type);
  };

  render() {
    const { sellIndex, buyIndex } = this.state;
    const {
      needSum,
      needBgColor,
      dataSource,
      style,
      columnTitle,
      toCenterLabel,
      theme,
      product,
    } = this.props;
    const { sellList, buyList, ticker } = dataSource;
    const trendClass = ticker.trend === Enum.down ? 'down' : 'up';
    const iconClass = `icon-${trendClass}`;
    const isDark = theme === Enum.dark;
    const containerClass = isDark
      ? 'ok-depth-container-dark'
      : 'ok-depth-container';
    const median = needBgColor ? DepthBar.medianUnit(sellList, buyList) : 0;
    return (
      <div className={containerClass} style={style}>
        <div className="title">
          {columnTitle.map((item, index) => (
            <span key={`ok-depth-title${index}`}>{item}</span>
          ))}
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
                  price,
                  amount,
                  amountValue,
                  sum,
                  tooltipSum,
                  tooltipTotal,
                  tooltipAvg,
                } = item;
                let barWidth = 0;
                if (needBgColor) {
                  barWidth = `${DepthBar.width(
                    amount.replace(/,/, ''),
                    median
                  )}%`;
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
                      className={`sell-item ${
                        sellIndex > -1 && index >= sellIndex ? 'has-bg' : ''
                      }`}
                      onClick={this.handleClickItem(index, Enum.sell)}
                      onMouseEnter={() => {
                        this.setState({ sellIndex: index });
                      }}
                      onMouseLeave={() => {
                        this.setState({ sellIndex: -1 });
                      }}
                    >
                      <span>{price}</span>
                      <span>{amountValue < 0.001 ? '0.001' : amount}</span>
                      {needSum && <span>{sum}</span>}
                      {needBgColor && (
                        <div
                          className="process-bar"
                          style={{ width: barWidth }}
                        />
                      )}
                    </li>
                  </DepthTooltip>
                );
              })}
            </ul>
            <div
              className={`${trendClass} ticker`}
              ref={(dom) => {
                this.tickerDom = dom;
              }}
            >
              <span>
                {ticker.price === undefined || ticker.price === 'NaN'
                  ? '-- '
                  : ticker.price}
              </span>
              <Icon className={iconClass} />
            </div>
            <ul className="buy-list">
              {buyList.map((item, index) => {
                const {
                  price,
                  amount,
                  amountValue,
                  sum,
                  tooltipSum,
                  tooltipTotal,
                  tooltipAvg,
                } = item;
                let barWidth = 0;
                if (needBgColor) {
                  barWidth = `${DepthBar.width(
                    amount.replace(/,/, ''),
                    median
                  )}%`;
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
                      className={`buy-item ${
                        buyIndex > -1 && index <= buyIndex ? 'has-bg' : ''
                      }`}
                      onClick={this.handleClickItem(index, Enum.buy)}
                      onMouseEnter={() => {
                        this.setState({ buyIndex: index });
                      }}
                      onMouseLeave={() => {
                        this.setState({ buyIndex: -1 });
                      }}
                    >
                      <span>{price}</span>
                      <span>{amountValue < 0.001 ? '0.001' : amount}</span>
                      {needSum && <span>{sum}</span>}
                      {needBgColor && (
                        <div
                          className="process-bar"
                          style={{ width: barWidth }}
                        />
                      )}
                    </li>
                  </DepthTooltip>
                );
              })}
            </ul>
          </div>
          <div
            className={`${trendClass} ticker-clone`}
            ref={(dom) => {
              this.tickerCloneDom = dom;
            }}
          >
            <span>{ticker.price}</span>
            <Icon className={iconClass} />
            <div className="return-center" onClick={this.toCenter}>
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
      trend: Enum.up,
    },
  },
  style: {},
  columnTitle: [],
  selectItem: null,
  toCenterLabel: '返回盘口',
  theme: '',
};
DepthList.propTypes = {
  isShowMerge: PropTypes.bool,
  onChooseMergeType: PropTypes.func,
  dataSource: PropTypes.object,
  style: PropTypes.object,
  columnTitle: PropTypes.array,
  selectItem: PropTypes.func,
  toCenterLabel: PropTypes.string,
  theme: PropTypes.string,
};
