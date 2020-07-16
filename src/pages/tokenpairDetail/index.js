import React, { Component } from 'react';
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
        total: 10,
        per_page: 10,
      },
      isShowAddDialog: false,
      isShowWithdrawDialog: false,
      project: '',
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
    this.fetchTokenpairs();
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
