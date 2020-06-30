import React, { Component } from 'react';
import { calc } from '_component/okit';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import DashboardSection from './DashboardSection';

const depositCols = [
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
    render: (text, data) => {
      return (
        <span
          className="td-action"
        >
          {toLocale('tokenPair_cell_add')}
        </span>
      );
    }
  }
];

class DashboardTokenpair extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      deposits: [],
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentDidMount() {
    if (this.addr) {
      this.fetchAccountDeposit();
    }
  }

  fetchAccountDeposit = () => {
    const page = 1;
    const address = this.addr;
    const params = {
      page,
      per_page: 3,
    };
    this.setState({ loading: true });
    ont.get(`${URL.GET_ACCOUNT_DEPOSIT}/${address}`, { params }).then(({ data }) => {
      this.setState({ loading: false, deposits: data });
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const { loading, deposits } = this.state;
    return (
      <DashboardSection
        title={toLocale('dashboard_tokenPair_title')}
        columns={depositCols}
        dataSource={deposits}
        rowKey="product"
        isLoading={loading}
        empty={toLocale('tokenPair_emtpy')}
      />
    );
  }
}

export default DashboardTokenpair;
