import React from 'react';
import { toLocale } from '_src/locale/react-locale';
import commonUtil from './commonUtil';
import FormatNum from '../../utils/FormatNum';

export default {
  noDealColumns: (onCancelOrder, onClickProduct) => {
    const commonCols = commonUtil.getCommonColumns(onClickProduct);
    const normalCols = [
      {
        title: toLocale('spot.orders.operation'),
        key: 'operation',
        render: (text, record) => {
          return (
            <div>
              <a className="order-cancel" onClick={onCancelOrder(record)}>
                {toLocale('spot.orders.cancel')}
              </a>
            </div>
          );
        },
      },
    ];
    return commonCols.concat(normalCols);
  },
  historyColumns: (onClickSymbol) => {
    const commonCols = commonUtil.getCommonColumns(onClickSymbol);
    const historyCols = [];
    return commonCols.concat(historyCols);
  },
  detailColumns: () => {
    const detailCols = [
      {
        title: toLocale('spot.myOrder.height'),
        key: 'block_height',
        render: (text) => {
          return <span>{text}</span>;
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
        title: toLocale('spot.myOrder.id'),
        key: 'order_id',
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: toLocale('spot.myOrder.product'),
        key: 'product',
        render: (text) => {
          return <span>{text}</span>;
        },
      },
      {
        title: toLocale('spot.myOrder.direction'),
        key: 'side',
        render: (text, data) => {
          return <div className={data.sideClass}>{text}</div>;
        },
      },
      {
        title: toLocale('spot.myOrder.filledPrice'),
        key: 'price',
        render: (text) => {
          return <div>{text}</div>;
        },
      },
      {
        title: toLocale('spot.myOrder.filledAmount'),
        key: 'volume',
        render: (text) => {
          return <div>{text}</div>;
        },
      },
      {
        title: toLocale('spot.myOrder.filledMoney'),
        key: 'total',
        render: (text, data) => {
          return <span>{data.money}</span>;
        },
      },
      {
        title: toLocale('spot.myOrder.fee'),
        key: 'fee',
        render: (text) => {
          let txt = '';
          if (text) {
            txt = text.split('-')[0];
          }
          return FormatNum.formatFeeStr(txt.toUpperCase());
        },
      },
    ];
    return detailCols;
  },
};
