import React, { Component } from 'react';
import moment from 'moment';
import ont from '_src/utils/dataProxy';
import { toLocale } from '_src/locale/react-locale';
import URL from '_constants/URL';
import history from '_src/utils/history';
import PageURL from '_constants/PageURL';
import Config from '_constants/Config';
import DashboardSection from './DashboardSection';

const util = {};
util.transactionsTypes = [
  { value: 1, label: toLocale('trade_type_trans') },
  { value: 2, label: toLocale('trade_type_order') },
  { value: 3, label: toLocale('trade_type_cancle') },
];
const transactionsTypesMap = {};
util.transactionsTypes.forEach(({ value, label }) => {
  transactionsTypesMap[value] = label;
});
const transactionsCols = [
  {
    title: toLocale('trade_column_hash'),
    key: 'txhash',
    render: (text) => {
      return <a className="one-line" href={`${Config.okchain.browserUrl}/tx/${text}`} target="_blank" rel="noopener noreferrer">{text}</a>;
    }
  },
  {
    title: toLocale('trade_column_time'),
    key: 'timestamp',
    render: (text) => {
      return moment(Number(`${text}000`)).format('MM-DD HH:mm:ss');
    }
  },
  {
    title: toLocale('trade_column_type'),
    key: 'type',
    render: (text) => {
      return transactionsTypesMap[text] || '';
    }
  },
  {
    title: toLocale('trade_column_amount'),
    alignRight: true,
    key: 'quantity',
  },
];

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
    ont.get(URL.GET_TRANSACTIONS, { params }).then(({ data }) => {
      const list = data.data.map((item) => {
        const newItem = { ...item };
        newItem.uniqueKey = newItem.txhash + newItem.type + newItem.side + newItem.symbol + newItem.timestamp;
        return newItem;
      });
      this.setState({
        loading: false,
        transactions: list || [],
      });
    }).catch(() => {
      this.setState({ loading: false });
    });
  };

  toTransactions = () => {
    history.push(PageURL.walletTransactions);
  }

  render() {
    const { loading, transactions } = this.state;
    return (
      <DashboardSection
        title={toLocale('dashboard_transaction_title')}
        columns={transactionsCols}
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
