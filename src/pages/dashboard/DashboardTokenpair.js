import React, { Component, Fragment } from 'react';
import {
  AddDepositsDialog,
  WithdrawDepositsDialog,
} from '_component/ActionDialog';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { toLocale } from '_src/locale/react-locale';
import { getDashboardTokenPairCols } from '_src/utils/table';
import history from '_src/utils/history';
import PageURL from '_constants/PageURL';
import DashboardSection from './DashboardSection';

class DashboardTokenpair extends Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      deposits: [],
      isShowAddDialog: false,
      isShowWithdrawDialog: false,
      project: '',
    };
    this.addr = window.OK_GLOBAL.senderAddr;
  }

  componentDidMount() {
    if (this.addr) {
      this.fetchAccountDeposit();
    }
  }

  onAddOpen = (project) => {
    return () => {
      this.setState({
        isShowAddDialog: true,
        project,
      });
    };
  };

  onAddClose = () => {
    this.setState({
      isShowAddDialog: false,
    });
  };

  onWithdrawOpen = (project) => {
    return () => {
      this.setState({
        isShowWithdrawDialog: true,
        project,
      });
    };
  };

  onWithdrawClose = () => {
    this.setState({
      isShowWithdrawDialog: false,
    });
  };

  afterAddOrWithdraw = () => {
    this.props.afterAddOrWithdraw();
    this.setState({
      project: '',
    });
    this.fetchAccountDeposit();
  };

  fetchAccountDeposit = () => {
    const page = 1;
    const params = {
      address: this.addr,
      page,
      per_page: 3,
    };
    this.setState({ loading: true });
    ont
      .get(`${URL.GET_ACCOUNT_DEPOSIT}`, { params })
      .then(({ data }) => {
        this.setState({ loading: false, deposits: data.data });
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  toTokenpairDetail = () => {
    history.push(PageURL.tokenpairDetailPage);
  };

  render() {
    const { beforeAddOrWithdraw } = this.props;
    const {
      loading,
      deposits,
      isShowAddDialog,
      isShowWithdrawDialog,
      project,
    } = this.state;
    return (
      <Fragment>
        <DashboardSection
          title={toLocale('dashboard_tokenPair_title')}
          columns={getDashboardTokenPairCols({
            add: this.onAddOpen,
            withdraw: this.onWithdrawOpen,
          })}
          dataSource={deposits}
          rowKey="product"
          isLoading={loading}
          empty={toLocale('tokenPair_emtpy')}
          onClickMore={this.toTokenpairDetail}
        />
        <AddDepositsDialog
          visible={isShowAddDialog}
          onClose={this.onAddClose}
          project={project}
          beforeAdd={beforeAddOrWithdraw}
          afterAdd={this.afterAddOrWithdraw}
        />
        <WithdrawDepositsDialog
          visible={isShowWithdrawDialog}
          onClose={this.onWithdrawClose}
          project={project}
          beforeWithdraw={beforeAddOrWithdraw}
          afterWithdraw={this.afterAddOrWithdraw}
        />
      </Fragment>
    );
  }
}

export default DashboardTokenpair;
