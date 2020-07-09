import React, { Component, Fragment } from 'react';
import { toLocale } from '_src/locale/react-locale';
import { calc } from '_component/okit';
import Tooltip from '_component/Tooltip';
import Icon from '_component/IconLite';
import MintDialog from '_component/MintDialog';
import BurnDialog from '_component/BurnDialog';
import DashboardSection from './DashboardSection';
import './DashboardIssue.less';

const tokenCols = ({ mint, burn }) => {
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
      render(text, { symbol }) {
        return (
          <div className="issue-action-container">
            <span
              className="td-action"
              onClick={mint(symbol)}
            >
              {toLocale('issue_cell_mint')}
            </span>
            <div className="action-boundary" />
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

class DashboardIssue extends Component {
  constructor() {
    super();
    this.state = {
      isShowMintDialog: false,
      isShowBurnDialog: false,
      currentToken: '',
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  onMintOpen = (token) => {
    return () => {
      this.setState({
        isShowMintDialog: true,
        currentToken: token,
      });
    };
  }

  onMintClose = () => {
    this.setState({
      isShowMintDialog: false,
    });
  }

  onBurnOpen = (token) => {
    return () => {
      this.setState({
        isShowBurnDialog: true,
        currentToken: token,
      });
    };
  }

  onBurnClose = () => {
    this.setState({
      isShowBurnDialog: false,
    });
  }

  afterMintOrBurn = () => {
    this.props.afterMintOrBurn();
    this.setState({
      currentToken: ''
    });
  }

  render() {
    const {
      loading, tokens, beforeMintOrBurn
    } = this.props;
    const { isShowMintDialog, isShowBurnDialog, currentToken } = this.state;
    const fTokens = tokens.slice(0, 3).filter((token) => {
      return token.owner === this.addr;
    });
    return (
      <Fragment>
        <DashboardSection
          title={toLocale('dashboard_issue_title')}
          columns={tokenCols({ mint: this.onMintOpen, burn: this.onBurnOpen })}
          dataSource={fTokens}
          rowKey="symbol"
          isLoading={loading}
          empty={toLocale('issue_empty')}
        />
        <MintDialog
          visible={isShowMintDialog}
          onClose={this.onMintClose}
          token={currentToken}
          beforeMint={beforeMintOrBurn}
          afterMint={this.afterMintOrBurn}
        />
        <BurnDialog
          visible={isShowBurnDialog}
          onClose={this.onBurnClose}
          token={currentToken}
          beforeBurn={beforeMintOrBurn}
          afterBurn={this.afterMintOrBurn}
        />
      </Fragment>
    );
  }
}

export default DashboardIssue;
