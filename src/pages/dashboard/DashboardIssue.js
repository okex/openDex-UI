import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import Tooltip from '_component/Tooltip';
import Icon from '_component/IconLite';
import DashboardSection from './DashboardSection';
import './DashboardIssue.less';

const tokenCols = [
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
    render() {
      return (
        <div className="issue-action-container">
          <span
            className="td-action"
          >
            {toLocale('issue_cell_mint')}
          </span>
          <div className="action-boundary" />
          <span
            className="td-action"
          >
            {toLocale('issue_cell_burn')}
          </span>
        </div>
      );
    }
  }
];

class DashboardIssue extends Component {
  constructor() {
    super();
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  render() {
    const { loading, tokens } = this.props;
    const fTokens = tokens.slice(0, 3).filter((token) => {
      return token.owner === this.addr;
    });
    return (
      <DashboardSection
        title={toLocale('dashboard_issue_title')}
        columns={tokenCols}
        dataSource={fTokens}
        rowKey="symbol"
        isLoading={loading}
        empty={toLocale('issue_empty')}
      />
    );
  }
}

export default DashboardIssue;
