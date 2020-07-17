/* eslint-disable camelcase */
import React, { Component } from 'react';
import Message from '_src/component/Message';
import DexDesktopContainer from '_component/DexDesktopContainer';
import DexDesktopInput from '_component/DexDesktopInput';
import DexDesktopInputPair from '_component/DexDesktopInputPair';
import DexTable from '_component/DexTable';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { toLocale } from '_src/locale/react-locale';
import { getFeesCols } from '_src/utils/table';
import './index.less';

const DEFAULT_PAGINATION = {
  page: 1,
  total: 0,
  per_page: 10,
};

class FeesPage extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      address: window.OK_GLOBAL.senderAddr,
      baseAsset: '',
      quoteAsset: '',
      fees: [],
      pagination: DEFAULT_PAGINATION,
    };
  }

  componentDidMount() {
    this.fetchFeesByState();
  }

  onAddressChange = (e) => {
    this.setState({
      address: e.target.value,
    });
  }

  onBaseAssetChange = (e) => {
    this.setState({ baseAsset: e.target.value });
  }

  onQuoteAssetChange = (e) => {
    this.setState({ quoteAsset: e.target.value });
  }

  onPageChange = (pageSize) => {
    const pagination = {
      ...this.state.pagination,
      page: pageSize,
    };
    this.fetchFees(pagination);
  }

  fetchFeesByState = () => {
    const { pagination } = this.state;
    this.fetchFees(pagination);
  }

  fetchFees = (pagination) => {
    const { page, per_page } = pagination;
    const { address, baseAsset, quoteAsset } = this.state;
    if (address === '' && baseAsset === '' && quoteAsset === '') {
      Message.error({ content: '请至少输入一个检索条件' });
    } else {
      this.setState({ loading: true });
      const params = {
        page,
        per_page,
        address,
        base_asset: baseAsset,
        quote_asset: quoteAsset,
      };
      ont.get(`${URL.GET_FEES}`, { params }).then(({ data }) => {
        this.setState({
          loading: false,
          fees: data.data || [],
          pagination: data.param_page || DEFAULT_PAGINATION,
        });
      }).catch((err) => {
        this.setState({ loading: false });
        console.log(err);
      });
    }
  }

  handleQuery = () => {
    const pagination = DEFAULT_PAGINATION;
    this.fetchFees(pagination);
  }

  render() {
    const {
      loading, address, baseAsset, quoteAsset,
      pagination, fees,
    } = this.state;

    return (
      <DexDesktopContainer
        className="fees-page"
        isShowAddress
        isShowHelp
        needLogin
      >
        <div className="fees-container">
          <DexDesktopInput
            label="HandlingFeeAddress:"
            value={address}
            onChange={this.onAddressChange}
          />
          <DexDesktopInputPair
            label={toLocale('listToken.label')}
            firstValue={baseAsset}
            onFirstChange={this.onBaseAssetChange}
            secondValue={quoteAsset}
            onSecondChange={this.onQuoteAssetChange}
          />
          <button className="dex-desktop-btn" onClick={this.handleQuery}>
            Query
          </button>
          <DexTable
            columns={getFeesCols()}
            dataSource={fees}
            rowKey="order_id"
            isLoading={loading}
            empty={<div>暂无运营商币对手续费数据</div>}
            pagination={pagination}
            onPageChange={this.onPageChange}
            hideOnSinglePage={false}
          />
        </div>
      </DexDesktopContainer>
    );
  }
}

export default FeesPage;
