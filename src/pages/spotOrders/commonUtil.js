/* eslint-disable no-else-return */
import React from 'react';
import Tooltip from 'rc-tooltip';
import { Link } from 'react-router-dom';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import FormatNum from '_src/utils/FormatNum';
import { calc } from '_component/okit';
import util from '../../utils/util';
import { OrderStatus } from '../../constants/OrderStatus';
import PageURL from '../../constants/PageURL';
import Enum from '../../utils/Enum';
import Config from '../../constants/Config';

const commonUtil = {
  // 公共列
  getCommonColumns: (onClickProduct) => {
    return [
      { // 哈希值
        title: toLocale('spot.myOrder.hash'),
        key: 'txhash',
        render: (text) => {
          const str = FormatNum.hashShort(text); // `${text.substr(0, 9)}...${text.substring(text.length - 3)}`;
          const href = `${Config.okexchain.browserUrl}/tx/${text}`; // trade-info/
          return (
            <a
              title={text}
              className="can-click"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
            >
              {str}
            </a>
          );
        }
      }, { // 时间
        title: toLocale('spot.myOrder.date'),
        key: 'timestamp',
        render: (text) => {
          const d = text.split(' ')[0];
          const t = text.split(' ')[1];
          return (
            <span>{d}<br />{t}</span>
          );
        }
      }, { // 交易对
        title: toLocale('spot.myOrder.product'),
        key: 'product',
        render: (text, data) => {
          // 相同币对不可点
          const isSame = (data.activeProduct && data.orginalProduct.toUpperCase() === data.activeProduct.toUpperCase());
          return (
            <span
              onClick={() => {
                onClickProduct && onClickProduct(data.orginalProduct);
              }}
              className={(isSame || !onClickProduct) ? '' : 'can-click'}
            >
              {text}
            </span>
          );
        }
      }, { // 方向
        title: toLocale('spot.myOrder.direction'),
        key: 'side',
        render: (text, data) => {
          return <div className={data.sideClass}>{text}</div>;
        }
      }, { // 成交比例
        title: toLocale('spot.myOrder.filledPercentage'),
        key: 'filledPercentage',
        render: (text) => {
          return (
            <span>{text}</span>
          );
        }
      }, { // 已成交量 | 委托总量
        title: (
          <span>
            {toLocale('spot.myOrder.filledAmount')} | {toLocale('spot.myOrder.amount')}
          </span>
        ),
        key: 'quantity',
        render: (text, data) => {
          const baseSymbolShort = data.product.split('/')[0];
          return (<div>{data.filledQuantity} | {text} {baseSymbolShort}</div>);
        }
      }, { // 成交均价 | 委托价
        title: (
          <span>
            {toLocale('spot.myOrder.filledPrice')} | {toLocale('spot.myOrder.price')}
          </span>
        ),
        key: 'price',
        render: (text, data) => {
          const quoteSymbol = data.product.split('/')[1];
          return (<div>{data.filled_avg_price} | {text} {quoteSymbol}</div>);
        }
      }, { // 状态
        title: toLocale('spot.orders.status'),
        key: 'status',
        render: (text) => {
          return (
            <span>{text}</span>
          );
        }
      }
    ];
  },
  // 公共列
  getColumns: (onClickSymbol) => {
    return [
      { // 委托时间
        title: toLocale('spot.orders.date'),
        key: 'createTime',
        render: (text) => {
          const dateTime = util.timeStampToTime(parseInt(text, 10), 'yyyy-MM-dd hh:mm:ss');
          const date = dateTime.split(' ')[0];
          const time = dateTime.split(' ')[1];

          return (
            <div className="flex-row">
              <div>
                <span style={{ display: 'inline-block' }}>{date}</span><br />
                <span style={{ display: 'inline-block' }}>{time}</span>
              </div>
            </div>
          );
        }
      }, { // 币对
        title: toLocale('spot.orders.symbol'),
        key: 'symbol',
        render: (text) => {
          return (
            <span
              onClick={() => {
                onClickSymbol(text);
              }}
              className="can-click"
            >
              {text.replace('_', '/')
                .toUpperCase()}
            </span>
          );
        }
      }, { // 类型
        title: toLocale('spot.orders.type'),
        key: 'systemType',
        render: (text) => {
          const intlId = text === 1 ? 'spot.orders.side.spot' : 'spot.orders.side.margin';
          return toLocale(intlId);
        }
      }, { // 方向
        title: toLocale('spot.orders.direction'),
        key: 'side',
        render: (text) => {
          const side = text === 1 ? 'spot.orders.actionBuy' : 'spot.orders.actionSell';
          const classType = text === 1 ? 'buy' : 'sell';
          return <div className={classType}>{toLocale(side)}</div>;
        }
      }
    ];
  },
  // 策略委托"状态"列
  getStatusColumns: (data) => {
    let explanation = null;
    const { removeType, status } = data;
    switch (Number(removeType)) {
      case 0: // 委托超时撤单
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation0')}
          </div>
        );
        break;
      case 1: // 用户手动撤单
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation1')}
          </div>
        );
        break;
      case 2: // 余额不足撤单
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation3')}
          </div>
        );
        break;
      default:
        break;
    }
    switch (status) {
      case 1: // 待生效
        return (
          <div>
            {toLocale('spot.orders.status1')}
          </div>
        );
      case 2: // 已生效
        return (
          <div>
            {toLocale('spot.orders.status2')}
          </div>
        );
      case 3: // 已撤销-有解释浮层以说明
        return (
          <Tooltip placement="top" overlay={explanation}>
            <div>
              {toLocale('spot.orders.status3')}
            </div>
          </Tooltip>
        );
      default:
        break;
    }
    return false;
  },
  // 策略委托"状态"列（冰山和时间规划）
  getStatusColumnsIceAndTime: (data) => {
    let explanation = null;
    const { removeType, status } = data;
    switch (removeType) {
      case 0: // 委托超时撤单
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation0')}
          </div>
        );
        break;
      case 1: // 用户手动撤单
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation1')}
          </div>
        );
        break;
      case 2: // 余额不足撤单
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation3')}
          </div>
        );
        break;
      default:
        break;
    }
    switch (status) {
      case 1: // 待生效
        return (
          <div>
            {toLocale('spot.orders.status1')}
          </div>
        );
      case 2: // 已生效
        return (
          <div>
            {toLocale('spot.orders.status2')}
          </div>
        );
      case 3: // 已撤销
        return (
          <Tooltip placement="top" overlay={explanation}>
            <div>
              {toLocale('spot.orders.status3')}
            </div>
          </Tooltip>
        );
      case 4: // 部分生效
        return (
          <div>
            {toLocale('spot.orders.partialStatus')}
          </div>
        );
      case 5: // 暂停生效
        return (
          <div>
            {toLocale('spot.orders.pausedStatus')}
          </div>
        );
      default:
        break;
    }
    return false;
  },
  // 获取table空数据时的样式
  getEmpty: () => {
    const isLogin = util.isLogined();
    const { tradeType } = window.OK_GLOBAL;
    const NoData = (
      <div className="flex-column" style={{ alignItems: 'center' }}>
        <Icon
          className="icon-Nodeallist"
          isColor
          style={{
            width: '48px',
            height: '48px',
            opacity: tradeType === Enum.tradeType.fullTrade ? 0.65 : 1
          }}
        />
        <div className="mar-top10">
          {toLocale('spot.orders.noData')}
        </div>
      </div>
    );
    const NotLogin = (
      <div className="order-list-not-login">
        <p className="c-title">
          <br />
          <Link to={`${PageURL.homePage}/wallet/create`}>
            {toLocale('wallet_create_step1')}
          </Link>
          <a> / </a>
          <Link to={`${PageURL.homePage}/wallet/import`}>
            {toLocale('wallet_import')}
          </Link>
        </p>
      </div>
    );
    return (
      isLogin ? NoData : NotLogin
    );
  },
  // 渲染页码
  renderPagination: (pagination, type, onPageChange, theme) => {
    const { page, per_page, total } = pagination;
    const tblContainer = document.querySelector('.ok-table-container');
    const totalPage = Math.ceil((total || 0) / per_page);
    let path = 'open';
    if (type === Enum.order.type.history) {
      path = 'history';
    } else if (type === Enum.order.type.detail) {
      path = 'deals';
    }
    if (totalPage < 2) { // 1页以内的不显示分页控件
      tblContainer && (tblContainer.style.height = '155px');
      return false;
    }
    tblContainer && (tblContainer.style.height = '125px');
    if (type === Enum.order.type.noDeal) {
      return null;
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Link to={path}>
          {toLocale('link_to_all')}
        </Link>
      </div>
    );
  },
  formatDataCommon: (order, config) => {
    const priceTruncate = 'max_price_digit' in config ? config.max_price_digit : 4; // 价格精度
    const sizeTruncate = 'max_size_digit' in config ? config.max_size_digit : 4; // 数量精度
    const newOrder = { ...order }; // 避免修改原始对象
    newOrder.timestamp = util.timeStampToTime(parseInt(newOrder.timestamp, 10), 'yyyy-MM-dd hh:mm:ss'); // .substring(5);
    newOrder.orginalProduct = newOrder.product;
    newOrder.product = util.getShortName(newOrder.product); // newOrder.product.replace('_', '/').toUpperCase();
    newOrder.sideClass = newOrder.side === 'BUY' ? 'buy' : 'sell';
    newOrder.side = toLocale(newOrder.side === 'BUY' ? 'spot.buy' : 'spot.sell');
    newOrder.money = calc.showFloorTruncation(calc.mul(newOrder.price, newOrder.quantity), priceTruncate);
    newOrder.filledPercentage = '';
    if (Number(calc.sub(newOrder.quantity, newOrder.remain_quantity)) === 0) { // 未成交
      newOrder.filledPercentage = '0.00%';
    } else if (calc.sub(newOrder.quantity, newOrder.remain_quantity) < newOrder.quantity) { // 部分成交
      newOrder.filledPercentage = `${calc.floorDiv(calc.sub(newOrder.quantity, newOrder.remain_quantity) * 100, newOrder.quantity, 2)}%`;
      // TODO 后端接口实现后去掉改行 部分成交
      if (![4, 5].includes(Number(newOrder.status))) {
        newOrder.status = 6;
      }
    } else { // 完全成交
      newOrder.filledPercentage = '100%';
    }
    newOrder.status = toLocale(`spot.myOrder.${OrderStatus[newOrder.status]}`);
    newOrder.price = calc.showFloorTruncation(newOrder.price, priceTruncate);
    newOrder.filled_avg_price = calc.showFloorTruncation(newOrder.filled_avg_price, priceTruncate);
    newOrder.filledQuantity = calc.showFloorTruncation(calc.sub(newOrder.quantity, newOrder.remain_quantity), sizeTruncate);
    newOrder.quantity = calc.showFloorTruncation(newOrder.quantity, sizeTruncate);
    // 配置写进对象
    newOrder.priceTruncate = priceTruncate;
    newOrder.sizeTruncate = sizeTruncate;
    return newOrder;
  },
  formatOpenData: (orderList, productObj, activeProduct) => {
    return orderList.map((order) => {
      const config = productObj[order.product] || {};
      return commonUtil.formatDataCommon({ ...order, activeProduct }, config);
    });
  },
  formatClosedData: (orderList, productObj) => {
    return orderList.map((order) => {
      const config = productObj[order.product] || {};
      const o = commonUtil.formatDataCommon(order, config);
      // o.filled_avg_price = (o.filled_avg_price > 0) ? calc.showFloorTruncation(o.filled_avg_price, o.priceTruncate) : '--';
      return o;
    });
  },
  formatDealsData: (orderList, productObj) => {
    return orderList.map((order) => {
      const config = productObj[order.product] || {};
      const priceTruncate = 'max_price_digit' in config ? config.max_price_digit : 4; // 价格精度
      const sizeTruncate = 'max_size_digit' in config ? config.max_size_digit : 4; // 数量精度
      const newOrder = { ...order }; // 避免修改原始对象
      newOrder.timestamp = util.timeStampToTime(parseInt(newOrder.timestamp, 10), 'yyyy-MM-dd hh:mm:ss'); // .substring(5);
      newOrder.orginalProduct = newOrder.product;
      newOrder.product = util.getShortName(newOrder.product); // newOrder.product.replace('_', '/').toUpperCase();
      newOrder.sideClass = newOrder.side === 'BUY' ? 'buy' : 'sell';
      newOrder.side = toLocale(newOrder.side === 'BUY' ? 'spot.buy' : 'spot.sell');
      newOrder.money = calc.showFloorTruncation(newOrder.price * newOrder.volume, priceTruncate);
      newOrder.price = calc.showFloorTruncation(newOrder.price, priceTruncate);
      newOrder.volume = calc.showFloorTruncation(newOrder.volume, sizeTruncate);
      return newOrder;
    });
  }
};
export default commonUtil;
