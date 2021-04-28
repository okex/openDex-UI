import moment from 'moment';
import React from 'react';
import { crypto } from '@okexchain/javascript-sdk';
import FormatNum from '_src/utils/FormatNum';
import Tooltip from '_src/component/Tooltip';
import calc from '_src/utils/calc';
import { Button } from '_component/Button';
import { toLocale } from '_src/locale/react-locale';
import Menu from '_src/component/Menu';
import utils from '../../utils/util';
import { getLpTokenInfo } from '../../utils/lpTokenUtil';
import Config from '../../constants/Config';

const SubMenu = Menu.SubMenu;

const util = {
  get tabs() {
    return [
      { id: 1, label: 'assets_tab_accounts' },
      { id: 2, label: 'assets_tab_transactions' },
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
            noUnderline={true}
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
        key: 'blockTimeU0',
        alignRight: true,
        render: (text) => moment(Number(text)).format('MM-DD HH:mm:ss'),
      },
      {
        title: toLocale('trade_column_num'),
        alignRight: true,
        key: 'numberValue',
        render: (text, { symbol }) => {
          const originalSymbol =
            symbol.indexOf('_') > 0
              ? utils.getShortName(symbol)
              : utils.getSymbolShortName(symbol);
          return `${calc.ceilTruncate(text)} ${originalSymbol.toUpperCase()}`;
        },
      },
      {
        title: toLocale('trade_column_direction'),
        alignRight: true,
        key: 'from',
        render: (from) => {
          const userAddr = window.OK_GLOBAL.generalAddr;
          let sideText = toLocale('trade_type_in');
          if (crypto.toChecksumAddress(from) === userAddr) {
            sideText = toLocale('trade_type_out');
          }
          return <span>{sideText}</span>;
        },
      },
      {
        title: toLocale('assets_address'),
        alignRight: true,
        key: 'to',
        render: (text, { from }) => {
          const userAddr = window.OK_GLOBAL.generalAddr;
          let address = crypto.toChecksumAddress(from);
          if (address === userAddr) {
            address = crypto.toChecksumAddress(text);
          }
          let drawText = `${address.slice(0, 5)}...${address.slice(
            address.length - 5,
            address.length
          )}`;

          return (
            <Tooltip
              placement="bottomLeft"
              overlay={<div style={{ wordBreak: 'break-all' }}>{address}</div>}
              maxWidth={300}
              noUnderline={true}
            >
              {drawText}
            </Tooltip>
          );
        },
      },
    ];
  },
};

util.accountsCols = ({ transfer, moreOperationsChange }) => {
  const moreBoxConf = [
    {
      url: '',
      type: 'detail',
      get label() {
        return toLocale('dex_more_detail');
      },
      noLink: true,
    },
    {
      url: '',
      type: 'migration',
      get label() {
        return toLocale('dex_more_migration');
      },
      noLink: true,
    },
    {
      url: '',
      type: 'hidden',
      get label() {
        return toLocale('dex_more_hidden');
      },
      noLink: true,
    },
  ];
  return [
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
              noUnderline={true}
            >
              {text + whole_nameString}
            </Tooltip>
          </div>
        );
      },
    },
    {
      title: toLocale('assets_column_type'),
      key: 'assetsType',
      render: (text) =>
        text ? <span className="assets-column-type">{text}</span> : <span />,
    },
    {
      title: toLocale('assets_column_total'),
      key: 'total',
      render: (text) => text,
    },
    {
      title: '',
      key: 'operation',
      render: (_text, { symbol, assetsType }) => {
        const menuSelect = ({ key }) => {
          moreOperationsChange(key, symbol);
        };
        let boxConfig = moreBoxConf;
        if (assetsType !== 'KIP 20')
          boxConfig = moreBoxConf.filter(({ type }) => {
            if (symbol === 'okt' && type === 'migration') return false;
            return type !== 'hidden';
          });
        else boxConfig = moreBoxConf.filter(({ type }) => type !== 'migration');

        return (
          <div className="assets-container">
            <Button
              size={Button.size.mini}
              onClick={transfer(symbol, assetsType)}
            >
              {toLocale('assets_trans_btn')}
            </Button>
            <Menu
              mode="horizontal"
              onClick={menuSelect}
              selectable={false}
              className="okdex-menu-assets"
            >
              <SubMenu key="help" title={toLocale('assets_more_btn')}>
                {boxConfig.map((item) => (
                  <Menu.Item key={item.type}>{item.label}</Menu.Item>
                ))}
              </SubMenu>
            </Menu>
          </div>
        );
      },
    },
  ];
};
export default util;
