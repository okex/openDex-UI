import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import URL from '_constants/URL';
import ont from '_src/utils/dataProxy';
import DashboardAsset from './DashboardAsset';
import DashboardTransaction from './DashboardTransaction';
import DashboardTokenpair from './DashboardTokenpair';
import DashboardIssue from './DashboardIssue';
import './index.less';

class Dashboard extends Component {
  constructor() {
    super();
    this.state = {
      currencies: [],
      tokens: [],
      isTokensLoading: false,
      isAccountsLoading: false,
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentDidMount() {
    if (this.addr) {
      this.fetchAccounts();
      this.fetchTokens();
    }
  }

  fetchAccounts = () => {
    this.setState({ isAccountsLoading: true });
    ont.get(`${URL.GET_ACCOUNTS}/${this.addr}`).then(({ data }) => {
      const { currencies } = data;
      this.setState({
        currencies,
        isAccountsLoading: false,
      });
    }).catch(() => {
      this.setState({ isAccountsLoading: false });
    });
  }

  fetchTokens = () => {
    this.setState({ isTokensLoading: true });
    ont.get(URL.GET_TOKENS).then(({ data }) => {
      this.setState({
        tokens: data,
        isTokensLoading: false,
      });
    }).catch(() => {
      this.setState({ isTokensLoading: false });
    });
  }

  render() {
    const {
      currencies, tokens, isTokensLoading, isAccountsLoading
    } = this.state;

    return (
      <DexDesktopContainer isShowAddress needLogin>
        <div className="dashboard-page-container" >
          <DashboardAsset
            tokens={tokens}
            currencies={currencies}
            loading={isAccountsLoading || isTokensLoading}
            onTransferSuccess={this.fetchAccounts}
          />
          <DashboardTransaction />
          <DashboardTokenpair />
          <DashboardIssue
            tokens={tokens}
            loading={isTokensLoading}
          />
        </div>
      </DexDesktopContainer>
    );
  }
}

export default Dashboard;
