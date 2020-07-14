import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import DexDesktopInput from '_component/DexDesktopInput';
import DexDesktopInputPair from '_component/DexDesktopInputPair';
import DexTable from '_component/DexTable';
import { toLocale } from '_src/locale/react-locale';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { getDetailTokenPairCols } from '_src/utils/table';
import './index.less';

class TokenpairDetail extends Component {
  constructor() {
    super();
    this.state = {
      isActionLoading: false,
      loading: false,
      baseAsset: '',
      quoteAsset: '',
      operator: '',
      tokenpairs: [],
      pagination: {
        page: 1,
        total: 5,
        per_page: 3,
      }
    };
  }

  componentDidMount() {
    this.fetchTokenpairs();
  }

  onBaseAssetChange = (e) => {
    this.setState({ baseAsset: e.target.value });
  }

  onQuoteAssetChange = (e) => {
    this.setState({ quoteAsset: e.target.value });
  }

  onOperatorChange = (e) => {
    this.setState({ operator: e.target.value });
  }

  onPageChange = (pageSize) => {
    this.setState({
      pagination: {
        ...this.state.pagination,
        page: pageSize
      }
    });
  }

  fetchTokenpairs = () => {
    const { pagination } = this.state;
    const params = {
      page: pagination.page,
      per_page: pagination.per_page,
    };
    this.setState({ loading: true });
    ont.get(`${URL.GET_ACCOUNT_DEPOSIT}/${window.OK_GLOBAL.senderAddr}`, { params }).then(({ data }) => {
      this.setState({ loading: false, tokenpairs: data });
    }).catch(() => {
      this.setState({ loading: false });
    });
  }

  render() {
    const {
      isActionLoading, loading,
      baseAsset, quoteAsset, operator,
      tokenpairs, pagination
    } = this.state;

    return (
      <DexDesktopContainer
        className="tokenpair-detail-page"
        isShowAddress
        isShowHelp
        needLogin
        loading={isActionLoading}
      >
        <div className="tokenpair-detail-container">
          <DexDesktopInput
            label="DEX operator"
            value={operator}
            onChange={this.onOperatorChange}
          />
          <DexDesktopInputPair
            label={toLocale('listToken.label')}
            firstValue={baseAsset}
            onFirstChange={this.onBaseAssetChange}
            secondValue={quoteAsset}
            onSecondChange={this.onQuoteAssetChange}
          />
          <button className="dex-desktop-btn" onClick={() => {}}>
            Query
          </button>
          <DexTable
            columns={getDetailTokenPairCols({ add: () => {}, withdraw: () => {} })}
            dataSource={tokenpairs}
            rowKey="product"
            isLoading={loading}
            empty={<div>{toLocale('tokenPair_emtpy')}</div>}
            pagination={pagination}
            onPageChange={this.onPageChange}
          />
        </div>
      </DexDesktopContainer>
    );
  }
}

export default TokenpairDetail;
