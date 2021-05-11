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
  getCommonColumns: (onClickProduct) => [
    {
      title: toLocale('spot.myOrder.hash'),
      key: 'txhash',
      render: (text) => {
        const str = FormatNum.hashShort(text);
        const href = `${Config.okexchain.browserUrl}/tx/${text}`;
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
      },
    },
    {
      title: toLocale('spot.myOrder.date'),
      key: 'timestamp',
      render: (text) => {
        const d = text.split(' ')[0];
        const t = text.split(' ')[1];
        return (
          <span>
            {d}
            <br />
            {t}
          </span>
        );
      },
    },
    {
      title: toLocale('spot.myOrder.product'),
      key: 'product',
      render: (text, data) => {
        const isSame =
          data.activeProduct &&
          data.orginalProduct.toUpperCase() ===
            data.activeProduct.toUpperCase();
        return (
          <span
            onClick={() => {
              onClickProduct && onClickProduct(data.orginalProduct);
            }}
            className={isSame || !onClickProduct ? '' : 'can-click'}
          >
            {text}
          </span>
        );
      },
    },
    {
      title: toLocale('spot.myOrder.direction'),
      key: 'side',
      render: (text, data) => <div className={data.sideClass}>{text}</div>,
    },
    {
      title: toLocale('spot.myOrder.filledPercentage'),
      key: 'filledPercentage',
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span>
          {toLocale('spot.myOrder.filledAmount')} |{' '}
          {toLocale('spot.myOrder.amount')}
        </span>
      ),
      key: 'quantity',
      render: (text, data) => {
        const baseSymbolShort = data.product.split('/')[0];
        return (
          <div>
            {data.filledQuantity} | {text} {baseSymbolShort}
          </div>
        );
      },
    },
    {
      title: (
        <span>
          {toLocale('spot.myOrder.filledPrice')} |{' '}
          {toLocale('spot.myOrder.price')}
        </span>
      ),
      key: 'price',
      render: (text, data) => {
        const quoteSymbol = data.product.split('/')[1];
        return (
          <div>
            {data.filled_avg_price} | {text} {quoteSymbol}
          </div>
        );
      },
    },
    {
      title: toLocale('spot.orders.status'),
      key: 'status',
      render: (text) => <span>{text}</span>,
    },
  ],
  getColumns: (onClickSymbol) => [
    {
      title: toLocale('spot.orders.date'),
      key: 'createTime',
      render: (text) => {
        const dateTime = util.timeStampToTime(
          parseInt(text, 10),
          'yyyy-MM-dd hh:mm:ss'
        );
        const date = dateTime.split(' ')[0];
        const time = dateTime.split(' ')[1];

        return (
          <div className="flex-row">
            <div>
              <span style={{ display: 'inline-block' }}>{date}</span>
              <br />
              <span style={{ display: 'inline-block' }}>{time}</span>
            </div>
          </div>
        );
      },
    },
    {
      title: toLocale('spot.orders.symbol'),
      key: 'symbol',
      render: (text) => (
        <span
          onClick={() => {
            onClickSymbol(text);
          }}
          className="can-click"
        >
          {text.replace('_', '/').toUpperCase()}
        </span>
      ),
    },
    {
      title: toLocale('spot.orders.type'),
      key: 'systemType',
      render: (text) => {
        const intlId =
          text === 1 ? 'spot.orders.side.spot' : 'spot.orders.side.margin';
        return toLocale(intlId);
      },
    },
    {
      title: toLocale('spot.orders.direction'),
      key: 'side',
      render: (text) => {
        const side =
          text === 1 ? 'spot.orders.actionBuy' : 'spot.orders.actionSell';
        const classType = text === 1 ? 'buy' : 'sell';
        return <div className={classType}>{toLocale(side)}</div>;
      },
    },
  ],

  getStatusColumns: (data) => {
    let explanation = null;
    const { removeType, status } = data;
    switch (Number(removeType)) {
      case 0:
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation0')}
          </div>
        );
        break;
      case 1:
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation1')}
          </div>
        );
        break;
      case 2:
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
      case 1:
        return <div>{toLocale('spot.orders.status1')}</div>;
      case 2:
        return <div>{toLocale('spot.orders.status2')}</div>;
      case 3:
        return (
          <Tooltip placement="top" overlay={explanation}>
            <div>{toLocale('spot.orders.status3')}</div>
          </Tooltip>
        );
      default:
        break;
    }
    return false;
  },
  getStatusColumnsIceAndTime: (data) => {
    let explanation = null;
    const { removeType, status } = data;
    switch (removeType) {
      case 0:
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation0')}
          </div>
        );
        break;
      case 1:
        explanation = (
          <div className="tooltip-content">
            {toLocale('spot.orders.cancelExplanation1')}
          </div>
        );
        break;
      case 2:
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
      case 1:
        return <div>{toLocale('spot.orders.status1')}</div>;
      case 2:
        return <div>{toLocale('spot.orders.status2')}</div>;
      case 3:
        return (
          <Tooltip placement="top" overlay={explanation}>
            <div>{toLocale('spot.orders.status3')}</div>
          </Tooltip>
        );
      case 4:
        return <div>{toLocale('spot.orders.partialStatus')}</div>;
      case 5:
        return <div>{toLocale('spot.orders.pausedStatus')}</div>;
      default:
        break;
    }
    return false;
  },
  getEmpty: () => {
    const isLogin = util.isLogined();
    const { tradeType } = window.OK_GLOBAL;
    const NoData = (
      <div className="flex-column" style={{ alignItems: 'center' }}>
        <Icon
          className="icon-Nodeallist"
          isColor={true}
          style={{
            width: '48px',
            height: '48px',
            opacity: tradeType === Enum.tradeType.fullTrade ? 0.65 : 1,
          }}
        />
        <div className="mar-top10">{toLocale('spot.orders.noData')}</div>
      </div>
    );
    const NotLogin = (
      <div className="order-list-not-login">
        <p className="c-title">
          <br />
          <Link to={PageURL.walletCreate}>
            {toLocale('wallet_create_step1')}
          </Link>
          /<Link to={PageURL.walletImport}>{toLocale('wallet_import')}</Link>
        </p>
      </div>
    );
    return isLogin ? NoData : NotLogin;
  },
  renderPagination: (pagination, type) => {
    const { per_page, total } = pagination;
    const tblContainer = document.querySelector('.ok-table-container');
    const totalPage = Math.ceil((total || 0) / per_page);
    let path = 'open';
    if (type === Enum.order.type.history) {
      path = 'history';
    } else if (type === Enum.order.type.detail) {
      path = 'deals';
    }
    if (totalPage < 2) {
      tblContainer && (tblContainer.style.height = '155px');
      return false;
    }
    tblContainer && (tblContainer.style.height = '125px');
    if (type === Enum.order.type.noDeal) {
      return null;
    }
    return (
      <div style={{ textAlign: 'center' }}>
        <Link to={path}>{toLocale('link_to_all')}</Link>
      </div>
    );
  },
  formatDataCommon: (order, config) => {
    const priceTruncate =
      'max_price_digit' in config ? config.max_price_digit : 4;
    const sizeTruncate = 'max_size_digit' in config ? config.max_size_digit : 4;
    const newOrder = { ...order };
    newOrder.timestamp = util.timeStampToTime(
      parseInt(newOrder.timestamp, 10),
      'yyyy-MM-dd hh:mm:ss'
    );
    newOrder.orginalProduct = newOrder.product;
    newOrder.product = util.getShortName(newOrder.product);
    newOrder.sideClass = newOrder.side === 'BUY' ? 'buy' : 'sell';
    newOrder.side = toLocale(
      newOrder.side === 'BUY' ? 'spot.buy' : 'spot.sell'
    );
    newOrder.money = calc.showFloorTruncation(
      calc.mul(newOrder.price, newOrder.quantity),
      priceTruncate
    );
    newOrder.filledPercentage = '';
    if (Number(calc.sub(newOrder.quantity, newOrder.remain_quantity)) === 0) {
      newOrder.filledPercentage = '0.00%';
    } else if (
      calc.sub(newOrder.quantity, newOrder.remain_quantity) < newOrder.quantity
    ) {
      newOrder.filledPercentage = `${calc.floorDiv(
        calc.sub(newOrder.quantity, newOrder.remain_quantity) * 100,
        newOrder.quantity,
        2
      )}%`;
      if (![4, 5].includes(Number(newOrder.status))) {
        newOrder.status = 6;
      }
    } else {
      newOrder.filledPercentage = '100%';
    }
    newOrder.status = toLocale(`spot.myOrder.${OrderStatus[newOrder.status]}`);
    newOrder.price = calc.showFloorTruncation(newOrder.price, priceTruncate);
    newOrder.filled_avg_price = calc.showFloorTruncation(
      newOrder.filled_avg_price,
      priceTruncate
    );
    newOrder.filledQuantity = calc.showFloorTruncation(
      calc.sub(newOrder.quantity, newOrder.remain_quantity),
      sizeTruncate
    );
    newOrder.quantity = calc.showFloorTruncation(
      newOrder.quantity,
      sizeTruncate
    );
    newOrder.priceTruncate = priceTruncate;
    newOrder.sizeTruncate = sizeTruncate;
    return newOrder;
  },
  formatOpenData: (orderList, productObj, activeProduct) =>
    orderList.map((order) => {
      const config = productObj[order.product] || {};
      return commonUtil.formatDataCommon({ ...order, activeProduct }, config);
    }),
  formatClosedData: (orderList, productObj) =>
    orderList.map((order) => {
      const config = productObj[order.product] || {};
      const o = commonUtil.formatDataCommon(order, config);
      return o;
    }),
  formatDealsData: (orderList, productObj) =>
    orderList.map((order) => {
      const config = productObj[order.product] || {};
      const priceTruncate =
        'max_price_digit' in config ? config.max_price_digit : 4;
      const sizeTruncate =
        'max_size_digit' in config ? config.max_size_digit : 4;
      const newOrder = { ...order };
      newOrder.timestamp = util.timeStampToTime(
        parseInt(newOrder.timestamp, 10),
        'yyyy-MM-dd hh:mm:ss'
      );
      newOrder.orginalProduct = newOrder.product;
      newOrder.product = util.getShortName(newOrder.product);
      newOrder.sideClass = newOrder.side === 'BUY' ? 'buy' : 'sell';
      newOrder.side = toLocale(
        newOrder.side === 'BUY' ? 'spot.buy' : 'spot.sell'
      );
      newOrder.money = calc.showFloorTruncation(
        newOrder.price * newOrder.volume,
        priceTruncate
      );
      newOrder.price = calc.showFloorTruncation(newOrder.price, priceTruncate);
      newOrder.volume = calc.showFloorTruncation(newOrder.volume, sizeTruncate);
      return newOrder;
    }),
};
export default commonUtil;
