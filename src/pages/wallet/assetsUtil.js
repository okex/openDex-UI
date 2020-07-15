import moment from 'moment';
import React from 'react';
import FormatNum from '_src/utils/FormatNum';
import Tooltip from '_src/component/Tooltip';
import { calc } from '_component/okit';
import { Button } from '_component/Button';
import IconLite from '_src/component/IconLite';
import { toLocale } from '_src/locale/react-locale';
import utils from '../../utils/util';
import Config from '../../constants/Config';

const util = {};

util.tabs = [{ id: 1, label: toLocale('assets_tab_accounts'), }, { id: 2, label: toLocale('assets_tab_transactions'), }];
util.accountsCols = ({ transfer }, { valuationUnit }) => {
  // const valuationName = valuationUnit || '--';
  return [
    {
      title: toLocale('assets_column_assets'),
      key: 'assetToken',
      render: (text, data) => {
        const { whole_name, symbol } = data;
        const whole_nameString = whole_name ? ` (${whole_name})` : '';
        return (
          <div className="symbol-line">
            <Tooltip
              placement="bottomLeft"
              overlayClassName="symbol-tooltip"
              overlay={symbol}
              maxWidth={400}
              noUnderline
            >
              {text + whole_nameString}
            </Tooltip>
          </div>
        );
      }
    },
    {
      title: toLocale('assets_column_total'),
      key: 'total',
      alignRight: true,
      render: (text) => {
        return text;
      }
    },
    {
      title: toLocale('assets_column_balance'),
      key: 'available',
      alignRight: true,
      render: (text) => {
        return calc.showFloorTruncation(text, 8, false);
      }
    },
    // {
    //   title: toLocale('assets_column_freeze'),
    //   key: 'freeze',
    //   alignRight: true,
    //   render: (text) => {
    //     return calc.showFloorTruncation(text, 8, false);
    //   }
    // },
    {
      title: toLocale('assets_column_list'),
      key: 'locked',
      alignRight: true,
      render: (text) => {
        return calc.showFloorTruncation(text, 8, false);
      }
    },
    // {
    //   title: `OKB ${toLocale('valuation')}`,
    //   key: 'okbValuation',
    //   alignRight: true,
    //   render: (text) => {
    //     return text;
    //   }
    // },
    // {
    //   title: `${valuationName} ${toLocale('valuation')}`,
    //   key: 'legalValuation',
    //   alignRight: true,
    //   render: (text) => {
    //     return text;
    //   }
    // },
    {
      title: '',
      key: 'transfer',
      render: (text, { symbol }) => {
        return (
          <Button
            size={Button.size.mini}
            onClick={transfer(symbol)}
          >
            {toLocale('assets_trans_btn')}
          </Button>
        );
      }
    },
  ];
};
util.transactionsTypes = [
  { value: 1, label: toLocale('trade_type_trans') },
  { value: 2, label: toLocale('trade_type_order') },
  { value: 3, label: toLocale('trade_type_cancle') },
];
const transactionsTypesMap = {};
util.transactionsTypes.forEach(({ value, label }) => {
  transactionsTypesMap[value] = label;
});
util.transactionsCols = [
  {
    title: toLocale('trade_column_hash'),
    key: 'txhash',
    render: (text) => { // trade-info/
      return <a href={`${Config.okchain.browserUrl}/tx/${text}`} target="_blank" rel="noopener noreferrer">{FormatNum.hashShort(text)}</a>;
    }
  },
  {
    title: toLocale('trade_column_time'),
    key: 'timestamp',
    alignRight: true,
    render: (text) => {
      return moment(Number(`${text}000`)).format('MM-DD HH:mm:ss');
    }
  },
  {
    title: toLocale('trade_column_assets'),
    alignRight: true,
    key: 'symbol',
    render: (text) => {
      const symbol = (text.indexOf('_') > 0) ? utils.getShortName(text) : utils.getSymbolShortName(text);
      return symbol.toUpperCase();
    }
  },
  {
    title: toLocale('trade_column_type'),
    alignRight: true,
    key: 'type',
    render: (text) => {
      return transactionsTypesMap[text] || '';
    }
  },
  {
    title: toLocale('trade_column_direction'),
    alignRight: true,
    key: 'side',
    render: (text, data) => {
      const { type } = data;
      let sideText = '';
      let color = 'primary-green';
      if (type === 1) {
        if (text === 3) {
          color = 'primary-red';
          sideText = toLocale('trade_type_pay');
        }
        if (text === 4) {
          sideText = toLocale('trade_type_receive');
        }
      } else {
        if (text === 1) {
          sideText = toLocale('trade_type_buy');
        }
        if (text === 2) {
          sideText = toLocale('trade_type_sell');
          color = 'primary-red';
        }
      }
      return (
        <span className={color}>
          {sideText}
        </span>
      );
    }
  },
  {
    title: toLocale('trade_column_amount'),
    alignRight: true,
    key: 'quantity',
  },
  {
    title: `${toLocale('trade_column_fee')}`,
    key: 'fee',
    render: (text) => {
      return String(text.split('-')[0]).toUpperCase();
    }
  },
];
export default util;
