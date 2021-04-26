import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import DexList from '_component/DexList';
import Icon from '_component/IconLite';
import { MintDialog, BurnDialog } from '_component/ActionDialog';
import { getIssueCols } from '_src/utils/table';
import { toLocale } from '_src/locale/react-locale';
import URL from '_constants/URL';
import ont from '_src/utils/dataProxy';
import './index.less';

const defaultPageSize = 10;

class IssueDetail extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      issueTokens: [],
      isShowMintDialog: false,
      isShowBurnDialog: false,
      currentToken: '',
      isActionLoading: false,
      page: 1,
      searchText: '',
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentDidMount() {
    if (this.addr) {
      this.fetchTokens();
    }
  }

  onMintOpen = (token) => () => {
    this.setState({
      isShowMintDialog: true,
      currentToken: token,
    });
  };

  onMintClose = () => {
    this.setState({
      isShowMintDialog: false,
    });
  };

  onBurnOpen = (token) => () => {
    this.setState({
      isShowBurnDialog: true,
      currentToken: token,
    });
  };

  onBurnClose = () => {
    this.setState({
      isShowBurnDialog: false,
    });
  };

  onPageChange = (page) => {
    this.setState({ page });
  };

  onSearchChange = (e) => {
    this.setState({
      searchText: e.target.value,
      page: 1,
    });
  };

  beforeMintOrBurn = () => {
    this.setState({ isActionLoading: true });
  };

  afterMintOrBurn = () => {
    this.setState({ isActionLoading: false, currentToken: '' });
    this.fetchTokens();
  };

  fetchTokens = () => {
    this.setState({ loading: true });
    const params = {
      address: this.addr,
    };
    ont
      .get(URL.GET_TOKENS, { params })
      .then(({ data }) => {
        this.setState({
          issueTokens: data || [],
          loading: false,
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const {
      loading,
      issueTokens,
      isShowMintDialog,
      isShowBurnDialog,
      currentToken,
      isActionLoading,
      page,
      searchText,
    } = this.state;
    const pageSize = defaultPageSize;
    const filterTokens = issueTokens.filter(
      (token) =>
        token.symbol.indexOf(searchText.trim().toLowerCase().toString()) > -1
    );
    const total = filterTokens.length;
    const renderTokens = filterTokens.slice(
      (page - 1) * pageSize,
      page * pageSize
    );

    return (
      <DexDesktopContainer
        className="issue-detail-page"
        isShowAddress
        needLogin
        loading={isActionLoading}
      >
        <DexList
          title="Issue"
          tool={() => (
            <div className="issue-search-container">
              <Icon className="icon-enlarge" />
              <input
                className="issue-search-input"
                placeholder="Search"
                value={searchText}
                onChange={this.onSearchChange}
              />
            </div>
          )}
          columns={getIssueCols({
            mint: this.onMintOpen,
            burn: this.onBurnOpen,
          })}
          dataSource={renderTokens}
          rowKey="symbol"
          isLoading={loading}
          empty={toLocale('issue_empty')}
          total={total}
          page={page}
          pageSize={pageSize}
          onChange={this.onPageChange}
        />
        <MintDialog
          visible={isShowMintDialog}
          onClose={this.onMintClose}
          token={currentToken}
          beforeMint={this.beforeMintOrBurn}
          afterMint={this.afterMintOrBurn}
        />
        <BurnDialog
          visible={isShowBurnDialog}
          onClose={this.onBurnClose}
          token={currentToken}
          beforeBurn={this.beforeMintOrBurn}
          afterBurn={this.afterMintOrBurn}
        />
      </DexDesktopContainer>
    );
  }
}

export default IssueDetail;
