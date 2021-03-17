import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as CommonActions from '_src/redux/actions/CommonAction';
import { withRouter } from 'react-router-dom';
import PageURL from '_src/constants/PageURL';
import DexTab from '_component/DexTab';
import WalletAddress from '_component/WalletAddress';
import AssetsAccounts from './AssetsAccounts';
import AssetsTransactions from './AssetsTransactions';
import assetsUtil from './assetsUtil';
import { toLocale } from '_src/locale/react-locale';
import env from '_src/constants/env';
import information from '_src/assets/images/Information.svg'
import './Assets.less';

function mapStateToProps() {
  return {
    location: window.location,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonActions: bindActionCreators(CommonActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
@withRouter
class Assets extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      copySuccess: false,
      pathType: window.localStorage.getItem(env.envConfig.mnemonicPathType)
    };
    this.isAssets = this.props.location.pathname.includes(PageURL.walletAssets);
    if (!window.OK_GLOBAL.senderAddr) {
      this.props.history.replace(PageURL.walletImport);
    }
  }
  componentDidMount() {}
  onChangeTab = (current) => {
    return () => {
      if (this.state.loading) return;
      this.props.history.replace(
        current === 1 ? PageURL.walletAssets : PageURL.walletTransactions
      );
      if (
        (current === 1 && this.isAssets) ||
        (current === 2 && !this.isAssets)
      ) {
        this.setState({ loading: true });
        setTimeout(() => {
          this.setState({ loading: false });
        }, 100);
      }
    };
  };
  onCopy = () => {
    if (this.state.copySuccess) return;
    this.setState({ copySuccess: true });
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.setState({ copySuccess: false });
    }, 1000);
  };
  render() {
    const { loading, pathType } = this.state;
    const tipStyle = pathType === 'old' ? {} : { display: 'none' }
    return (
      <div className="wallet-main">
        <div className="top-tip" style={tipStyle}>
          <img src={information} alt=""/>
          <p>{toLocale('dex_top_tip')}</p>
          <a href="#">{toLocale('for_details')}</a>
        </div>
        <div className="wallet-address-container">
          <WalletAddress addressType="universality" />
          <WalletAddress addressType="OKExChain" />
        </div>
        <DexTab
          tabs={assetsUtil.tabs}
          current={this.isAssets ? 1 : 2}
          onChangeTab={this.onChangeTab}
        />
        {loading ? null : this.isAssets ? (
          <AssetsAccounts />
        ) : (
          <AssetsTransactions />
        )}
      </div>
    );
  }
}

export default Assets;
