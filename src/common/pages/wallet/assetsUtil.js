import moment from 'moment';
import React, { Component } from 'react';
import { crypto } from '@okexchain/javascript-sdk';
import FormatNum from '_src/utils/FormatNum';
import Tooltip from '_src/component/Tooltip';
import calc from '_src/utils/calc';
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
        key: 'blockTimeU0',
        alignRight: true,
        render: (text) => {
          return moment(Number(text)).format('MM-DD HH:mm:ss');
        },
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
          const userAddr = window.OK_GLOBAL.generalAddr
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
          const userAddr = window.OK_GLOBAL.generalAddr
          let address = crypto.toChecksumAddress(from)
          if (address === userAddr) {
            address = crypto.toChecksumAddress(text)
          }
          let drawText = `${address.slice(0 ,5)}******${address.slice(address.length - 5, address.length)}`;

          return (
            <Tooltip
              placement="bottomLeft"
              overlay={<div style={{"wordBreak":"break-all"}}>{address}</div>}
              maxWidth={300}
              noUnderline
            >
            {drawText}
            </Tooltip>
          );
        },
      }
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
        class Operation extends Component {
          constructor () {
            super()
            this.state = {
              active: false
            }
          }
          moreClick = (e) => {
            const active = this.state.active
            e.target.focus()
            this.setState({active: !active})
            
          }
          moreBtnBlur = () => {
            setTimeout(() => {
              this.setState({active: false})
            }, 100)
          }
          render = () => {
            const active = this.state.active
            let boxConfig = moreBoxConf
            if (assetsType !== 'KIP 20') boxConfig = moreBoxConf.filter(({type}) => type !== 'hidden')
            else boxConfig = moreBoxConf.filter(({type}) => type !== 'migration')
            return (<div className="assets-container">
              <Button size={Button.size.mini} onClick={transfer(symbol, assetsType)}>
                {toLocale('assets_trans_btn')}
              </Button>
              <Button
                className={"assets-more-bth" + (active ? ' active' : '')}
                onBlur={this.moreBtnBlur}
                onClick={this.moreClick}
                size={Button.size.mini}
              >
                {toLocale('assets_more_btn')}
              </Button>
              <div className="more-box">
                  <ComboBox
                    current={{}}
                    data={{symbol}}
                    comboBoxDataSource={boxConfig}
                    onChange={moreOperationsChange}
                  />
                </div>
            </div>);
          }
        }
        return <Operation />
      },
    },
  ];
};
export default util;
