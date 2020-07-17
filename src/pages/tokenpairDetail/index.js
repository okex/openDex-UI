/* eslint-disable camelcase */
import React, { Component } from 'react';
import Message from '_src/component/Message';
import DexDesktopContainer from '_component/DexDesktopContainer';
import DexDesktopInput from '_component/DexDesktopInput';
import DexDesktopInputPair from '_component/DexDesktopInputPair';
import DexTable from '_component/DexTable';
import { AddDepositsDialog, WithdrawDepositsDialog } from '_component/ActionDialog';
import { toLocale } from '_src/locale/react-locale';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { getDetailTokenPairCols } from '_src/utils/table';
import './index.less';

const DEFAULT_PAGINATION = {
  page: 1,
  total: 0,
  per_page: 10,
};

class TokenpairDetail extends Component {
  constructor() {
    super();
    this.state = {
      isActionLoading: false,
      loading: false,
      address: window.OK_GLOBAL.senderAddr,
      baseAsset: '',
      quoteAsset: '',
      tokenpairs: [],
      pagination: DEFAULT_PAGINATION,
      isShowAddDialog: false,
      isShowWithdrawDialog: false,
      project: '',
    };
  }

  componentDidMount() {
    this.fetchTokenpairsByState();
  }

  onBaseAssetChange = (e) => {
    this.setState({ baseAsset: e.target.value });
  }

  onQuoteAssetChange = (e) => {
    this.setState({ quoteAsset: e.target.value });
  }

  onAddressChange = (e) => {
    this.setState({ address: e.target.value });
  }

  onPageChange = (pageSize) => {
    const pagination = {
      ...this.state.pagination,
      page: pageSize,
    };
    this.fetchTokenpairs(pagination);
  }

  onAddOpen = (project) => {
    return () => {
      this.setState({
        isShowAddDialog: true,
        project,
      });
    };
  }

  onAddClose = () => {
    this.setState({
      isShowAddDialog: false,
    });
  }

  onWithdrawOpen = (project) => {
    return () => {
      this.setState({
        isShowWithdrawDialog: true,
        project,
      });
    };
  }

  onWithdrawClose = () => {
    this.setState({
      isShowWithdrawDialog: false
    });
  }

  beforeAddOrWithdraw = () => {
    this.setState({ isActionLoading: true });
  }

  afterAddOrWithdraw = () => {
    this.setState({
      isActionLoading: false,
      project: ''
    });
    this.fetchTokenpairsByState();
  }

  fetchTokenpairsByState = () => {
    const { pagination } = this.state;
    this.fetchTokenpairs(pagination);
  }

  fetchTokenpairs = (pagination) => {
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
      ont.get(`${URL.GET_ACCOUNT_DEPOSIT}`, { params }).then(({ data }) => {
        this.setState({
          loading: false,
          tokenpairs: data.data || [],
          pagination: data.param_page || DEFAULT_PAGINATION,
        });
      }).catch(() => {
        this.setState({ loading: false });
      });
    }
  }

  handleQuery = () => {
    const pagination = DEFAULT_PAGINATION;
    this.fetchTokenpairs(pagination);
  }

  render() {
    const {
      isActionLoading, loading,
      baseAsset, quoteAsset, address,
      tokenpairs, pagination,
      isShowAddDialog, isShowWithdrawDialog, project
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
            columns={getDetailTokenPairCols({ add: this.onAddOpen, withdraw: this.onWithdrawOpen })}
            dataSource={tokenpairs}
            rowKey="product"
            isLoading={loading}
            empty={<div>{toLocale('tokenPair_emtpy')}</div>}
            pagination={pagination}
            onPageChange={this.onPageChange}
            hideOnSinglePage={false}
          />
          <AddDepositsDialog
            visible={isShowAddDialog}
            onClose={this.onAddClose}
            project={project}
            beforeAdd={this.beforeAddOrWithdraw}
            afterAdd={this.afterAddOrWithdraw}
          />
          <WithdrawDepositsDialog
            visible={isShowWithdrawDialog}
            onClose={this.onWithdrawClose}
            project={project}
            beforeWithdraw={this.beforeAddOrWithdraw}
            afterWithdraw={this.afterAddOrWithdraw}
          />
        </div>
      </DexDesktopContainer>
    );
  }
}

export default TokenpairDetail;
