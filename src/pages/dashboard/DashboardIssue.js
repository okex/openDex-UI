/* eslint-disable camelcase */
import React, { Component, Fragment } from 'react';
import { toLocale } from '_src/locale/react-locale';
import { MintDialog, BurnDialog } from '_component/ActionDialog';
import history from '_src/utils/history';
import PageURL from '_constants/PageURL';
import { getIssueCols } from '_src/utils/table';
import DashboardSection from './DashboardSection';
import './DashboardIssue.less';

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

  toIssueDetail = () => {
    history.push(PageURL.issueDetailPage);
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
          columns={getIssueCols({ mint: this.onMintOpen, burn: this.onBurnOpen })}
          dataSource={fTokens}
          rowKey="symbol"
          isLoading={loading}
          empty={toLocale('issue_empty')}
          onClickMore={this.toIssueDetail}
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
