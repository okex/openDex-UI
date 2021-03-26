import React, { Component } from 'react';
import { Button } from '_component/Button';
import URL from '_src/constants/URL';
import { toLocale } from '_src/locale/react-locale';
import Config from '_constants/Config';
import DexTable from '_component/DexTable';
import moment from 'moment';
import assetsUtil from './assetsUtil';
import './Assets.less';
import ont from '../../utils/dataProxy';

class AssetsTransactions extends Component {
  constructor(props) {
    super(props);
    this.minDate = moment().subtract(1, 'years');
    this.maxDate = moment();
    this.defaultPage = {
      page: 1,
      per_page: 20,
      total: 0
    };
    this.state = {
      transactions: [],
      loading: false,
      currentTab: '10',
      param_page: this.defaultPage,
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }
  componentDidMount() {
    document.title =
      toLocale('assets_tab_transactions') + toLocale('spot.page.title');
    if (this.addr) {
      this.fetchTransactions();
    }
  }
  fetchTransactions = (page = 1) => {
    const { currentTab } = this.state;
    if (currentTab === '10') {
      const params = {
        type: 'okexchain/token/MsgTransfer',
        limit: this.state.param_page.per_page,
        offset: (page - 1) * this.state.param_page.per_page
      };
      this.setState({ loading: true });
      ont.get(URL.GET_TRANSACTIONS10.replace('{address}', this.addr), { params })
      .then(({ data }) => {
        const list = data.hits.map((item) => {
          return {
            ...item,
            uniqueKey: item.hash + item.blocktime,
            txhash: item.hash,
            from: item.from[0],
            to: item.to[0].address,
            symbol: item.to[0].coins[0].symbol,
            numberValue: item.to[0].coins[0].value
          };
        });
        const param_page = {
          total: data.total,
          page: page
        }
        this.setState({
          transactions: list || [],
          param_page: { ...this.state.param_page, ...param_page },
        });
      })
      .catch()
      .then(() => {
        this.setState({ loading: false });
      });
      return
    }
    const params = {
      tokenType: 'OIP20',
      limit: this.state.param_page.per_page,
      offset: (page - 1) * this.state.param_page.per_page
    };
    this.setState({ loading: true });
    ont.get(URL.GET_TRANSACTIONS20.replace('{address}', this.addr), { params })
    .then(({ data }) => {
      const list = data.hits.map((item) => {
        return {
          ...item,
          numberValue: item.value,
          uniqueKey: item.txhash + item.blocktime
        };
      });
      
      const param_page = {
        total: data.total,
        page: page
      }
      this.setState({
        transactions: list || [],
        param_page: { ...this.state.param_page, ...param_page },
      });
    })
    .catch()
    .then(() => {
      this.setState({ loading: false });
    });
  };
  switchtab = (type) => {
    this.setState({
      currentTab: type,
      page: 1
    }, () => this.fetchTransactions())
  }
  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  render() {
    const {
      transactions,
      currentTab,
      loading,
      param_page,
    } = this.state;
    return (
      <div>
        <div className="query-container">
          <div className="sub-query">
            <span onClick={() => this.switchtab('10')} className={'records-tab' + (currentTab === '10' ? ' switch' : '')}>
              {toLocale('wallet_transaction_records_tab10')}
            </span>
            <span onClick={() => this.switchtab('20')} className={'records-tab' + (currentTab === '20' ? ' switch' : '')}>
              {toLocale('wallet_transaction_records_tab20')}
            </span>
            <Button
              size={Button.size.small}
              type={Button.btnType.primary}
              onClick={() => {
                this.fetchTransactions();
              }}
            >
              {toLocale('trade_query_search')}
            </Button>
          </div>
          <a
            href={Config.okexchain.browserUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {toLocale('trade_query_more')} &gt;&gt;
          </a>
        </div>
        <DexTable
          columns={assetsUtil.transactionsCols}
          dataSource={transactions}
          rowKey="uniqueKey"
          style={{ clear: 'both', zIndex: 0 }}
          pagination={param_page}
          onPageChange={this.fetchTransactions}
          isLoading={loading}
          empty={<div>{toLocale('trade_emtpy')}</div>}
        />
      </div>
    );
  }
}

export default AssetsTransactions;
