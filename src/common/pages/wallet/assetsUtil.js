import moment from 'moment';
import React from 'react';
import FormatNum from '_src/utils/FormatNum';
import Tooltip from '_src/component/Tooltip';
import { calc } from '_component/okit';
import { Button } from '_component/Button';
import { toLocale } from '_src/locale/react-locale';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import PageURL from '_constants/PageURL';
import utils from '../../utils/util';
import { getLpTokenInfo } from '../../utils/lpTokenUtil';
import Config from '../../constants/Config';

const util = {
  get tabs() {
    return [
      { id: 1, label: 'assets_tab_accounts' },
      ...(function () {
        const current = DesktopTypeMenu.current
          ? DesktopTypeMenu.current.url
          : null;
        if (current !== PageURL.swapPage) {
          return [{ id: 2, label: 'assets_tab_transactions' }];
        }
        return [];
      })(),
    ];
  },
  get transactionsTypes() {
    return [
      { value: 1, label: toLocale('trade_type_trans') },
      { value: 2, label: toLocale('trade_type_order') },
      { value: 3, label: toLocale('trade_type_cancle') },
    ];
  },
  get transactionsTypesMap() {
    const transactionsTypesMap = {};
    this.transactionsTypes.forEach(({ value, label }) => {
      transactionsTypesMap[value] = label;
    });
    return transactionsTypesMap;
  },
  get transactionsCols() {
    return [
      {
        title: toLocale('trade_column_hash'),
        key: 'txhash',
        render: (text) => (
          <Tooltip
            placement="bottomLeft"
            overlay={<div style={{ wordBreak: 'break-all' }}>{text}</div>}
            maxWidth={300}
            noUnderline
          >
            <a
              href={`${Config.okexchain.browserUrl}/tx/${text}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {FormatNum.hashShort(text)}
            </a>
          </Tooltip>
        ),
      },
      {
        title: toLocale('trade_column_time'),
        key: 'timestamp',
        alignRight: true,
        render: (text) => moment(Number(`${text}000`)).format('MM-DD HH:mm:ss'),
      },
      {
        title: toLocale('trade_column_assets'),
        alignRight: true,
        key: 'symbol',
        render: (text) => {
          const symbol =
            text.indexOf('_') > 0
              ? utils.getShortName(text)
              : utils.getSymbolShortName(text);
          return symbol.toUpperCase();
        },
      },
      {
        title: toLocale('trade_column_type'),
        alignRight: true,
        key: 'type',
        render: (text) => util.transactionsTypesMap[text] || '',
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
          return <span className={color}>{sideText}</span>;
        },
      },
      {
        title: toLocale('trade_column_amount'),
        alignRight: true,
        key: 'quantity',
        render: (text) => utils.precisionInput(text, 8),
      },
      {
        title: `${toLocale('trade_column_fee')}`,
        key: 'fee',
        render: (text) => {
          text = String(text.split('-')[0]).toUpperCase();
          text = text.replace(/(\d{1,}\.?\d*)/, ($1) =>
            utils.precisionInput($1, 8)
          );
          return text;
        },
      },
    ];
  },
};

util.accountsCols = ({ transfer }) => [
  {
    title: toLocale('assets_column_assets'),
    key: 'assetToken',
    render: (text, data) => {
      const { symbol } = data;
      const lpTokenInfo = getLpTokenInfo(symbol, false);
      const textLpTokenInfo = getLpTokenInfo(text);
      const whole_nameString = symbol
        ? ` (${lpTokenInfo ? lpTokenInfo.name : symbol})`
        : '';
      if (textLpTokenInfo) text = textLpTokenInfo.name;
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
    },
  },
  {
    title: toLocale('assets_column_total'),
    key: 'total',
    alignRight: true,
    render: (text) => text,
  },
  {
    title: toLocale('assets_column_balance'),
    key: 'available',
    alignRight: true,
    render: (text) => calc.showFloorTruncation(text, 8, true),
  },
  {
    title: toLocale('assets_column_list'),
    key: 'locked',
    alignRight: true,
    render: (text) => calc.showFloorTruncation(text, 8, true),
  },
  {
    title: '',
    key: 'transfer',
    render: (text, { symbol }) => (
      <Button size={Button.size.mini} onClick={transfer(symbol)}>
        {toLocale('assets_trans_btn')}
      </Button>
    ),
  },
];
export default util;
