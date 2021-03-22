import moment from 'moment';
import React from 'react';
import FormatNum from '_src/utils/FormatNum';
import Tooltip from '_src/component/Tooltip';
import { calc } from '_component/okit';
import { Button } from '_component/Button';
import { toLocale } from '_src/locale/react-locale';
import utils from '../../utils/util';
import { getLpTokenInfo } from '../../utils/lpTokenUtil';
import Config from '../../constants/Config';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import PageURL from '_constants/PageURL';
import ComboBox from '_src/component/ComboBox/ComboBox';

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
        render: (text) => {
          return (
            <Tooltip
              placement="bottomLeft"
              overlay={<div style={{"wordBreak":"break-all"}}>{text}</div>}
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
          );
        },
      },
      {
        title: toLocale('trade_column_time'),
        key: 'timestamp',
        alignRight: true,
        render: (text) => {
          return moment(Number(`${text}000`)).format('MM-DD HH:mm:ss');
        },
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
        render: (text) => {
          return util.transactionsTypesMap[text] || '';
        },
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
        render: (text) => {
          return utils.precisionInput(text, 8);
        },
      },
      {
        title: `${toLocale('trade_column_fee')}`,
        key: 'fee',
        render: (text) => {
          text = String(text.split('-')[0]).toUpperCase();
          text = text.replace(/(\d{1,}\.?\d*)/, function ($1) {
            return utils.precisionInput($1, 8);
          });
          return text;
        },
      },
    ];
  },
};

util.accountsCols = ({ transfer, moreOperationsChange }, { valuationUnit }) => {
  const moreBoxConf = [
    {
      url: '',
      type: 'detail',
      get label() {
        return toLocale('dex_more_detail');
      },
      noLink: true
    }, {
      url: '',
      type: 'migration',
      get label() {
        return toLocale('dex_more_migration');
      },
      noLink: true
    }, {
      url: '',
      type: 'hidden',
      get label() {
        return toLocale('dex_more_hidden');
      },
      noLink: true
    }
  ]

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
              noUnderline
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
      render: (text) => {
        return !!text ? (<span className="assets-column-type">{text}</span>) : <span></span>;
      },
    },
    {
      title: toLocale('assets_column_total'),
      key: 'total',
      render: (text) => {
        return text;
      },
    },
    {
      title: '',
      key: 'operation',
      render: (text, { symbol, assetsType }) => {
        let boxConfig = moreBoxConf
        if (assetsType === 'OIP 10') boxConfig = moreBoxConf.filter(({type}) => type !== 'hidden')
        else boxConfig = moreBoxConf.filter(({type}) => type !== 'migration')

        return (<>
          <Button size={Button.size.mini} onClick={transfer(symbol, assetsType)}>
            {toLocale('assets_trans_btn')}
          </Button>
          <Button className="assets-more-bth" size={Button.size.mini}>
            {toLocale('assets_more_btn')}
            <div className="more-box">
              <ComboBox
                current={{}}
                data={{symbol}}
                comboBoxDataSource={boxConfig}
                onChange={moreOperationsChange}
              />
            </div>
          </Button>
        </>);
      },
    },
  ];
};
export default util;
