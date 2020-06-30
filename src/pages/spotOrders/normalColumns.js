import React from 'react';
import { toLocale } from '_src/locale/react-locale';

import commonUtil from './commonUtil';
import { OrderStatus } from '../../constants/OrderStatus';
import util from '../../utils/util';
import FormatNum from '../../utils/FormatNum';

export default {
  noDealColumns: (onCancelOrder, onClickProduct) => {
    const commonCols = commonUtil.getCommonColumns(onClickProduct);
    const normalCols = [{ // 操作（未成交）
      title: toLocale('spot.orders.operation'),
      key: 'operation',
      render: (text, record) => {
        return (
          <div>
            <a
              className="order-cancel"
              onClick={onCancelOrder(record)}
            >
              {toLocale('spot.orders.cancel')}
            </a>
          </div>
        );
      }
    }];
    return commonCols.concat(normalCols);
  },
  historyColumns: (onClickSymbol) => {
    const commonCols = commonUtil.getCommonColumns(onClickSymbol);
    const historyCols = [];
    /*
    const historyCols = [{ // 成交均价
      title: (
        <span>
          {toLocale('spot.myOrder.filledPrice')}
        </span>
      ),
      key: 'filled_avg_price',
      render: (text) => {
        return (<div>{text}</div>);
      }
    }, { // 委托量
      title: (
        <span>
          {toLocale('spot.myOrder.amount')}
        </span>
      ),
      key: 'quantity',
      render: (text) => {
        return (<div>{text}</div>);
      }
    }, { // 成交量
      title: (
        <span>
          {toLocale('spot.myOrder.filledAmount')}
        </span>
      ),
      key: 'remain_quantity',
      render: (text, data) => {
        return (<div>{data.filledQuantity}</div>);
      }
    }, { // 成交状态
      title: toLocale('spot.myOrder.filledStatus'),
      key: 'status',
      render: (text) => {
        return (
          <span>{text}</span>
        );
      }
    }]; */
    return commonCols.concat(historyCols);
  },
  detailColumns: () => {
    const detailCols = [{ // 区块高度订单号
      title: toLocale('spot.myOrder.height'),
      key: 'block_height',
      render: (text) => { // className="can-click"
        return (
          <span>
            {text}
          </span>
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
        ); // return (<span>{text}</span>);
      }
    }, { // 订单号
      title: toLocale('spot.myOrder.id'),
      key: 'order_id',
      render: (text) => { // className="can-click"
        return (
          <span>
            {text}
          </span>
        );
      }
    }, { // 交易对
      title: toLocale('spot.myOrder.product'),
      key: 'product',
      render: (text) => {
        return (
          <span>
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
    }, { // 成交均价
      title: toLocale('spot.myOrder.filledPrice'),
      key: 'price',
      render: (text) => {
        return (<div>{text}</div>);
      }
    }, { // 成交量
      title: toLocale('spot.myOrder.filledAmount'),
      key: 'volume',
      render: (text) => {
        return (<div>{text}</div>);
      }
    }, { // 成交额
      title: toLocale('spot.myOrder.filledMoney'),
      key: 'total',
      render: (text, data) => {
        return (<span>{data.money}</span>);
      }
    }, { // 手续费(OKB)
      title: toLocale('spot.myOrder.fee'),
      key: 'fee',
      render: (text) => {
        let txt = '';
        if (text) {
          txt = text.split('-')[0];
        }
        return FormatNum.formatFeeStr(txt.toUpperCase());
      }
    }];
    return detailCols;
  }
};
