import React, { Component } from 'react';
import ont from '_src/utils/dataProxy';
import { toLocale } from '_src/locale/react-locale';
import URL from '_constants/URL';
import history from '_src/utils/history';
import PageURL from '_constants/PageURL';
import { getTransactionsCols } from '_src/utils/table';
import DashboardSection from './DashboardSection';

class DashboardTransaction extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      transactions: [],
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentDidMount() {
    if (this.addr) {
      this.fetchTransactions();
    }
  }

  fetchTransactions = () => {
    const page = 1;
    const params = {
      address: this.addr,
      page,
      per_page: 20,
    };
    this.setState({ loading: true });
    ont
      .get(URL.GET_TRANSACTIONS, { params })
      .then(({ data }) => {
        const list = data.data.map((item) => {
          const newItem = { ...item };
          newItem.uniqueKey =
            newItem.txhash +
            newItem.type +
            newItem.side +
            newItem.symbol +
            newItem.timestamp;
          return newItem;
        });
        this.setState({
          loading: false,
          transactions: list || [],
        });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  toTransactions = () => {
    history.push(PageURL.walletTransactions);
  };

  render() {
    const { loading, transactions } = this.state;
    return (
      <DashboardSection
        title={toLocale('dashboard_transaction_title')}
        columns={getTransactionsCols()}
        dataSource={transactions.slice(0, 3)}
        rowKey="uniqueKey"
        isLoading={loading}
        empty={toLocale('trade_emtpy')}
        onClickMore={this.toTransactions}
      />
    );
  }
}

export default DashboardTransaction;
