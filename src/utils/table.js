/* eslint-disable camelcase */
import React, { Fragment } from 'react';
import Tooltip from '_component/Tooltip';
import Icon from '_component/IconLite';
import { calc } from '_component/okit';
import { toLocale } from '_src/locale/react-locale';
import util from './util';

export const getIssueCols = ({ mint, burn }) => {
  return [
    {
      title: toLocale('issue_column_token'),
      key: 'original_symbol',
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
        return text ? <Icon className="icon-check" style={{ color: '#00BC6C' }} /> : <Icon className="icon-close" style={{ color: '#E35E5E' }} />;
      }
    },
    {
      title: toLocale('issue_column_original'),
      key: 'original_total_supply',
      render: (text) => {
        return calc.showFloorTruncation(text, 8, false);
      }
    },
    {
      title: toLocale('issue_column_total'),
      key: 'total_supply',
      render: (text) => {
        return calc.showFloorTruncation(text, 8, false);
      }
    },
    {
      title: '',
      key: '',
      render(text, { mintable, symbol }) {
        return (
          <div className="complex-action-container">
            {
              mintable && (
                <Fragment>
                  <span
                    className="td-action"
                    onClick={mint(symbol)}
                  >
                    {toLocale('issue_cell_mint')}
                  </span>
                  <div className="action-boundary" />
                </Fragment>
              )
            }
            <span
              className="td-action"
              onClick={burn(symbol)}
            >
              {toLocale('issue_cell_burn')}
            </span>
          </div>
        );
      }
    }
  ];
};

export const getDashboardTokenPairCols = ({ add, withdraw }) => {
  return [
    {
      title: toLocale('tokenPair_column_tokenPair'),
      key: 'product',
      render: (text) => {
        return util.getShortName(text);
      }
    },
    {
      title: toLocale('tokenPair_column_birth'),
      key: 'block_height',
    },
    {
      title: toLocale('tokenPair_column_deposit'),
      key: 'deposits',
      render: (text) => {
        return calc.showFloorTruncation(text.amount, 8, false);
      }
    },
    {
      title: toLocale('tokenPair_column_rank'),
      key: 'rank',
    },
    {
      title: '',
      key: 'add',
      render: (text, { product }) => {
        return (
          <div className="complex-action-container">
            <span
              className="td-action"
              onClick={add(product)}
            >
              {toLocale('tokenPair_cell_add')}
            </span>
            <div className="action-boundary" />
            <span
              className="td-action"
              onClick={withdraw(product)}
            >
              {toLocale('tokenPair_cell_withdraw')}
            </span>
          </div>
        );
      }
    }
  ];
};

export const getDetailTokenPairCols = ({ add, withdraw }) => {
  return [
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
      render: (text) => {
        return util.getShortName(text);
      }
    },
    {
      title: toLocale('tokenPair_column_birth'),
      key: 'block_height',
    },
    {
      title: toLocale('tokenPair_column_deposit'),
      key: 'deposits',
      render: (text) => {
        return calc.showFloorTruncation(text.amount, 8, false);
      }
    },
    {
      title: '',
      key: 'add',
      render: (text, { product }) => {
        return (
          <div className="complex-action-container">
            <span
              className="td-action"
              onClick={add(product)}
            >
              {toLocale('tokenPair_cell_add')}
            </span>
            <div className="action-boundary" />
            <span
              className="td-action"
              onClick={withdraw(product)}
            >
              {toLocale('tokenPair_cell_withdraw')}
            </span>
          </div>
        );
      }
    }
  ];
};
