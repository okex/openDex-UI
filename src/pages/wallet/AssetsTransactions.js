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

/* eslint-disable react/sort-comp */
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
      startDate: 0,
      endDate: 0,
      type: 0,
      loading: false,
      param_page: this.defaultPage,
    };
    this.typeOptions = [{ value: 0, label: toLocale('all') }].concat(
      assetsUtil.transactionsTypes
    );
    this.addr = window.OK_GLOBAL.senderAddr;
  }
  componentDidMount() {
    document.title =
      toLocale('assets_tab_transactions') + toLocale('spot.page.title');
    if (this.addr) {
      this.fetchTransactions();
    }
  }
  onDatePickerChange = (type) => {
    return (date) => {
      this.setState({ [type]: date });
    };
  };
  onTypeChange = ({ value: type }) => {
    this.setState({ type });
  };
  fetchTransactions = (page = 1) => {
    const { startDate, endDate, type } = this.state;
    const params = {
      address: this.addr,
      page,
      per_page: 20,
      type: type || undefined,
      start: startDate
        ? calc.div(moment(startDate).startOf('day').valueOf(), 1000)
        : undefined,
      end: endDate
        ? calc.div(moment(endDate).endOf('day').valueOf() - 999, 1000)
        : undefined,
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
          transactions: list || [],
          param_page: data.param_page || this.defaultPage,
        });
      })
      .catch()
      .then(() => {
        this.setState({ loading: false });
      });
  };
  handleDateChangeRaw = (e) => {
    e.preventDefault();
  };
  render() {
    const {
      transactions,
      startDate,
      endDate,
      type,
      loading,
      param_page,
    } = this.state;
    return (
      <div>
        <div className="query-container">
          <div className="sub-query">
            <DatePicker
              small
              selectsStart
              theme="dark"
              placeholderText={toLocale('trade_query_begin')}
              selected={startDate || null}
              startDate={startDate || null}
              endDate={endDate || null}
              dateFormat="YYYY-MM-DD"
              onChangeRaw={this.handleDateChangeRaw}
              minDate={this.minDate}
              maxDate={endDate || this.maxDate}
              locale={util
                .getSupportLocale(Cookies.get('locale') || 'en_US')
                .toLocaleLowerCase()}
              onChange={this.onDatePickerChange('startDate')}
            />
            <div className="dash" />
            <DatePicker
              small
              selectsEnd
              theme="dark"
              placeholderText={toLocale('trade_query_end')}
              selected={endDate || null}
              startDate={startDate || null}
              endDate={endDate || null}
              dateFormat="YYYY-MM-DD"
              onChangeRaw={this.handleDateChangeRaw}
              minDate={startDate || this.minDate}
              maxDate={this.maxDate}
              locale={util
                .getSupportLocale(Cookies.get('locale') || 'en_US')
                .toLocaleLowerCase()}
              onChange={this.onDatePickerChange('endDate')}
            />
            <span>{toLocale('trade_query_order_type')}</span>
            <Select
              clearable={false}
              searchable={false}
              small
              theme="dark"
              options={this.typeOptions}
              value={type}
              onChange={this.onTypeChange}
              style={{ width: 180 }}
            />
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
            href={Config.okchain.browserUrl}
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
