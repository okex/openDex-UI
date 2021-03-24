import React, { Component } from 'react';
import { Button } from '_component/Button';
import URL from '_src/constants/URL';
import { toLocale } from '_src/locale/react-locale';
import Config from '_constants/Config';
import DatePicker from '_component/ReactDatepicker';
import Select from '_component/ReactSelect';
import DexTable from '_component/DexTable';
import moment from 'moment';
import { calc } from '_component/okit';
import Cookies from 'js-cookie';
import assetsUtil from './assetsUtil';
import './Assets.less';
import ont from '../../utils/dataProxy';
import util from '../../utils/util';
import env from '_src/constants/env';

class AssetsTransactions extends Component {
  constructor(props) {
    super(props);
    this.minDate = moment().subtract(1, 'years');
    this.maxDate = moment();
    this.defaultPage = {
      page: 1,
      per_page: 20,
      total: 0,
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
        address: this.addr,
        page,
        per_page: 20,
      };
      this.setState({ loading: true });
      ont.get(URL.GET_TRANSACTIONS, { params })
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
          transactions: list || [],
          param_page: data.param_page || this.defaultPage,
        });
      })
      .catch()
      .then(() => {
        this.setState({ loading: false });
      });
      return
    }
    alert('暂不支持')
    // TODO oip 20
    // const params = {
    //   tokenType: 'OIP20'
    // };
    // this.setState({ loading: true });
    // ont.get(URL.GET_TRANSACTIONS20.replace('{chain}', env.envConfig.oklinkPagePath).replace('{address}', this.addr), { params })
    // .then(({ data }) => {
    //   const list = data.data.map((item) => {
    //     const newItem = { ...item };
    //     newItem.uniqueKey =
    //       newItem.txhash +
    //       newItem.type +
    //       newItem.side +
    //       newItem.symbol +
    //       newItem.timestamp;
    //     return newItem;
    //   });
    //   this.setState({
    //     transactions: list || [],
    //     param_page: data.param_page || this.defaultPage,
    //   });
    // })
    // .catch()
    // .then(() => {
    //   this.setState({ loading: false });
    // });
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
