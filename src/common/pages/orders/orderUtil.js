import React from 'react';
import moment from 'moment';
import { calc } from '_component/okit';
import Icon from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import { OrderStatus, OrderType } from '../../constants/OrderStatus';

const orderUtil = {
  sideType: () => ({
    1: toLocale('spot.buy'),
    2: toLocale('spot.sell'),
  }),
  sideList: () => [
    {
      value: 0,
      label: toLocale('spot.buyAndSell'),
    },
    {
      value: 1,
      label: toLocale('spot.buy'),
    },
    {
      value: 2,
      label: toLocale('spot.sell'),
    },
  ],
  getEmptyContent: () => (
    <div
      className="flex-column"
      style={{ alignItems: 'center', color: 'rgba(255, 255, 255, 0.45)' }}
    >
      <Icon
        className="icon-Nodeallist"
        isColor={true}
        style={{ width: '48px', height: '48px' }}
      />
      <div className="mar-top10">{toLocale('spot.orders.noData')}</div>
    </div>
  ),
  getColumns: (productObj, cancelHandler) => [
    {
      title: toLocale('spot.orders.date'),
      key: 'createTime',
      render: (text) => (
        <div className="date-str">
          {moment(text).format('YYYY-MM-DD HH:mm:ss')}
        </div>
      ),
    },
    {
      title: toLocale('spot.orders.symbol'),
      key: 'symbol',
      render: (text) => text.toString().replace('_', '/').toUpperCase(),
    },
    {
      title: toLocale('spot.orders.type'),
      key: 'systemType',
      render: (text) => {
        const intlId =
          Number(text) === 1
            ? 'spot.orders.side.spot'
            : 'spot.orders.side.margin';
        return <div style={{ minWidth: '45px' }}>{toLocale(intlId)}</div>;
      },
    },
    {
      title: (
        <div style={{ minWidth: '30px' }}>{toLocale('spot.orders.side2')}</div>
      ),
      key: 'side',
      render: (text) => {
        const colorClass = Number(text) === 1 ? 'primary-green' : 'primary-red';
        return (
          <label className={colorClass}>{orderUtil.sideType()[text]}</label>
        );
      },
    },
    {
      title: toLocale('spot.orders.entrustMount'),
      key: 'size',
      render: (text) => <div className="digits-str">{text}</div>,
    },
    {
      title: toLocale('spot.orders.orderType'),
      key: 'orderType',
      render: (text) => (
        <div className="order-option-str one-line">
          {toLocale(OrderType[text] || '')}
        </div>
      ),
    },
    {
      title: toLocale('spot.orders.entrustPrice'),
      key: 'price',
      render: (text, record) => {
        if (Number(record.orderType) === 1) {
          return toLocale('spot.market');
        }
        return <div className="digits-str">{text}</div>;
      },
    },
    {
      title: toLocale('spot.orders.entrustMoney'),
      key: 'total',
      render: (text) => <div className="digits-str">{text}</div>,
    },
    {
      title: toLocale('spot.orders.dealt'),
      key: 'filledSize',
      render: (text) => <div className="digits-str">{text}</div>,
    },
    {
      title: toLocale('spot.orders.dealAveragePrice'),
      key: 'avgPrice',
      render: (text) => <div className="digits-str">{text}</div>,
    },
    {
      title: toLocale('spot.orders.status'),
      key: 'status',
      render: (text, record) => {
        const { CANCELING, CANCELLED, COMPLETE_FILLED } = OrderStatus;
        const { FAK, FOK } = OrderType;
        return (
          <div style={{ minWidth: '90px' }}>
            {toLocale(`spot.orders.${OrderStatus[text]}`)}
            &nbsp;&nbsp;
            {[CANCELING, CANCELLED, COMPLETE_FILLED].indexOf(
              record.status.toString()
            ) > -1 ||
            (productObj[record.symbol] &&
              Number(productObj[record.symbol].tradingMode) === 2) ||
            [FAK, FOK].includes(record.orderType.toString()) ? null : (
              <a
                className="order-cancel"
                onClick={cancelHandler(record.id, record.symbol)}
              >
                {toLocale('spot.orders.cancel')}
              </a>
            )}
          </div>
        );
      },
    },
  ],
  formatOrders: (orders, productList) =>
    orders.map((oriOrder) => {
      const order = { ...oriOrder };
      const { orderType, side, symbol } = order;
      const currProduct =
        productList.filter((product) => product.symbol === symbol)[0] || {};
      const priceTruncate = currProduct.max_price_digit
        ? currProduct.max_price_digit
        : 2;
      const sizeTruncate =
        'max_size_digit' in currProduct ? currProduct.max_size_digit : 2;
      let price = '';
      let size = '';
      let total = '';
      let notNealSize = 0;
      if (Number(orderType) === 1) {
        if (Number(side) === 1) {
          size = '--';
          total = calc.showFloorTruncation(order.quoteSize, priceTruncate);
        } else {
          size = calc.showFloorTruncation(order.size, sizeTruncate);
          total = '--';
        }
        notNealSize = 0;
      } else {
        price = order.price.replace(/,/g, '');
        price = calc.showFloorTruncation(price, priceTruncate);
        size = calc.showFloorTruncation(order.size, sizeTruncate);
        total = calc.showFloorTruncation(
          calc.mul(order.size, order.price),
          priceTruncate
        );
        notNealSize = order.size - order.filledSize;
      }
      notNealSize = calc.showFloorTruncation(notNealSize, sizeTruncate);
      const baseCurr = order.symbol.split('_')[1].toUpperCase();
      const tradeCurr = order.symbol.split('_')[0].toUpperCase();
      order.size = size === '--' ? size : `${size} ${tradeCurr}`;
      order.price = `${price} ${baseCurr}`;
      order.total = total === '--' ? total : `${total} ${baseCurr}`;
      order.notNealSize = notNealSize;
      let avgPrice = 0;
      if (+order.filledSize !== 0) {
        avgPrice = calc.div(order.executedValue, order.filledSize);
      }
      if (Number(side) === 1) {
        order.avgPrice = `${calc.showFloorTruncation(
          avgPrice,
          priceTruncate
        )} ${baseCurr}`;
      } else {
        order.avgPrice = `${calc.showCeilTruncation(
          avgPrice,
          priceTruncate
        )} ${baseCurr}`;
      }
      order.filledSize = `${calc.showFloorTruncation(
        order.filledSize,
        sizeTruncate
      )} ${tradeCurr}`;
      return order;
    }),
};
export default orderUtil;
