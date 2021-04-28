import React, { Fragment } from 'react';
import moment from 'moment';
import Tooltip from '_component/Tooltip';
import Icon from '_component/IconLite';
import { calc } from '_component/okit';
import { toLocale } from '_src/locale/react-locale';
import Config from '_constants/Config';
import { getLpTokenInfo } from '_src/utils/lpTokenUtil';
import util from './util';

export const getIssueCols = ({ mint, burn }) => [
  {
    title: toLocale('issue_column_token'),
    key: 'original_symbol',
    render: (text, data) => {
      const { whole_name, symbol } = data;
      const lpTokenInfo = getLpTokenInfo(whole_name);
      const whole_nameString = whole_name
        ? ` (${lpTokenInfo ? lpTokenInfo.name : whole_name})`
        : '';
      return (
        <div className="symbol-line">
          <Tooltip
            placement="bottomLeft"
            overlayClassName="symbol-tooltip"
            overlay={symbol}
            maxWidth={400}
            noUnderline={true}
          >
            {text.toUpperCase() + whole_nameString}
          </Tooltip>
        </div>
      );
    },
  },
  {
    title: toLocale('issue_column_mintable'),
    key: 'mintable',
    render(text) {
      return text ? (
        <Icon className="icon-check" style={{ color: '#00BC6C' }} />
      ) : (
        <Icon className="icon-close" style={{ color: '#E35E5E' }} />
      );
    },
  },
  {
    title: toLocale('issue_column_original'),
    key: 'original_total_supply',
    render: (text) => calc.showFloorTruncation(text, 8, false),
  },
  {
    title: toLocale('issue_column_total'),
    key: 'total_supply',
    render: (text) => calc.showFloorTruncation(text, 8, false),
  },
  {
    title: '',
    key: '',
    render(text, { mintable, symbol }) {
      return (
        <div className="complex-action-container">
          {mintable && (
            <>
              <span className="td-action" onClick={mint(symbol)}>
                {toLocale('issue_cell_mint')}
              </span>
              <div className="action-boundary" />
            </>
          )}
          <span className="td-action" onClick={burn(symbol)}>
            {toLocale('issue_cell_burn')}
          </span>
        </div>
      );
    },
  },
];

export const getDashboardTokenPairCols = ({ add, withdraw }) => [
  {
    title: toLocale('tokenPair_column_tokenPair'),
    key: 'product',
    render: (text) => util.getShortName(text),
  },
  {
    title: toLocale('tokenPair_column_birth'),
    key: 'block_height',
    render: (text) => (
      <a
        className="one-line"
        href={`${Config.okexchain.browserUrl}/block/${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    ),
  },
  {
    title: toLocale('tokenPair_column_deposit'),
    key: 'deposits',
    render: (text) => calc.showFloorTruncation(text.amount, 8, false),
  },
  {
    title: toLocale('tokenPair_column_rank'),
    key: 'rank',
  },
  {
    title: '',
    key: 'add',
    render: (text, { product }) => (
      <div className="complex-action-container">
        <span className="td-action" onClick={add(product)}>
          {toLocale('tokenPair_cell_add')}
        </span>
        <div className="action-boundary" />
        <span className="td-action" onClick={withdraw(product)}>
          {toLocale('tokenPair_cell_withdraw')}
        </span>
      </div>
    ),
  },
];

export const getDetailTokenPairCols = ({ add, withdraw }) => [
  {
    title: toLocale('tokenPair_column_rank'),
    key: 'rank',
  },
  {
    title: 'DEX operator',
    key: 'owner',
  },
  {
    title: toLocale('tokenPair_column_tokenPair'),
    key: 'product',
    render: (text) => util.getShortName(text),
  },
  {
    title: toLocale('tokenPair_column_birth'),
    key: 'block_height',
    render: (text) => (
      <a
        className="one-line"
        href={`${Config.okexchain.browserUrl}/block/${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    ),
  },
  {
    title: toLocale('tokenPair_column_deposit'),
    key: 'deposits',
    render: (text) => calc.showFloorTruncation(text.amount, 8, false),
  },
  {
    title: '',
    key: 'add',
    render: (text, { product }) => (
      <div className="complex-action-container">
        <span className="td-action" onClick={add(product)}>
          {toLocale('tokenPair_cell_add')}
        </span>
        <div className="action-boundary" />
        <span className="td-action" onClick={withdraw(product)}>
          {toLocale('tokenPair_cell_withdraw')}
        </span>
      </div>
    ),
  },
];

export const getAccountsCols = ({ transfer }) => [
  {
    title: toLocale('assets_column_assets'),
    key: 'assetToken',
    render: (text, data) => {
      const { whole_name, symbol } = data;
      const lpTokenInfo = getLpTokenInfo(whole_name);
      const whole_nameString = whole_name
        ? ` (${lpTokenInfo ? lpTokenInfo.name : whole_name})`
        : '';
      return (
        <div className="symbol-line">
          <Tooltip
            placement="bottomLeft"
            overlayClassName="symbol-tooltip"
            overlay={symbol}
            maxWidth={400}
            noUnderline={true}
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
    render: (text) => text,
  },
  {
    title: toLocale('assets_column_balance'),
    key: 'available',
    render: (text) => calc.showFloorTruncation(text, 8, false),
  },
  {
    title: toLocale('assets_column_list'),
    key: 'locked',
    render: (text) => calc.showFloorTruncation(text, 8, false),
  },
  {
    title: '',
    key: 'transfer',
    render: (text, { symbol }) => (
      <span className="td-action" onClick={transfer(symbol)}>
        {toLocale('assets_trans_btn')}
      </span>
    ),
  },
];

const tempUtil = {};
tempUtil.transactionsTypes = [
  { value: 1, label: toLocale('trade_type_trans') },
  { value: 2, label: toLocale('trade_type_order') },
  { value: 3, label: toLocale('trade_type_cancle') },
];
const transactionsTypesMap = {};
tempUtil.transactionsTypes.forEach(({ value, label }) => {
  transactionsTypesMap[value] = label;
});

export const getTransactionsCols = () => [
  {
    title: toLocale('trade_column_hash'),
    key: 'txhash',
    render: (text) => (
      <a
        className="one-line"
        href={`${Config.okexchain.browserUrl}/tx/${text}`}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    ),
  },
  {
    title: toLocale('trade_column_time'),
    key: 'timestamp',
    render: (text) => moment(Number(`${text}000`)).format('MM-DD HH:mm:ss'),
  },
  {
    title: toLocale('trade_column_type'),
    key: 'type',
    render: (text) => transactionsTypesMap[text] || '',
  },
  {
    title: toLocale('trade_column_amount'),
    alignRight: true,
    key: 'quantity',
    render: (text) => util.precisionInput(text, 8),
  },
];

export const getFeesCols = () => [
  {
    title: 'HandlingFeeAddress',
    key: 'handling_fee_addr',
  },
  {
    title: 'Tokenpair',
    key: 'product',
  },
  {
    title: 'OrderID',
    key: 'order_id',
  },
  {
    title: 'Date',
    key: 'timestamp',
    render: (text) => moment(Number(`${text}000`)).format('MM-DD HH:mm:ss'),
  },
  {
    title: 'HandlingFee',
    key: 'fee',
  },
];
