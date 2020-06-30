import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import moment from 'moment';
import * as walletActions from '_src/redux/actions/WalletAction';
import { Dialog } from '_component/Dialog';
import { Button } from '_component/Button';
import util from '_src/utils/util';
import './SafeTip.less';

function mapStateToProps(state) {
  const { keyStore } = state.WalletStore;
  return { keyStore };
}

function mapDispatchToProps(dispatch) {
  return {
    walletAction: bindActionCreators(walletActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class SafeTip extends Component {
  static propTypes = {
    visible: PropTypes.bool
  }

  static defaultProps = {
    visible: true
  }
  constructor(props) {
    super(props);
    this.state = {
      visible: props.visible,
      hasDownload: false
    };
  }
  componentDidMount() {
    if (this.state.visible) {
      this.dialog = Dialog.show({
        hideCloseBtn: true,
        width: '440px',
        children: this.renderContent()
      });
    }
  }
  downloadKeyStore = () => {
    const { keyStore } = this.props;
    const keyStoreName = `keystore_${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    util.downloadObjectAsJson(keyStore, keyStoreName);
    this.setState({
      hasDownload: true
    });
  }
  handleKnew = () => {
    const { onEnsure } = this.props;
    if (!this.state.hasDownload) {
      // const { keyStore } = this.props;
      // const keyStoreName = `keystore_${moment().format('YYYY-MM-DD HH:mm:ss')}`;
      this.downloadKeyStore();
    }
    this.dialog.destroy();
    onEnsure && onEnsure();
  }
  renderContent = () => {
    return (
      <div className="wallet-safe-tip">
        <div style={{ fontSize: 18 }}>
          {toLocale('wallet_safeTip_title')}
        </div>
        <img
          className="mar-top30"
          src="https://static.bafang.com/cdn/assets/imgs/MjAxOTQ/EB1742AFFE1C68081E13A3404A79A141.png"
        />
        <div className="safe-tip-content">
          {toLocale('wallet_safeTip_beforeKeystore')}
          <a onClick={this.downloadKeyStore}>Keystore</a>
          &nbsp;{toLocale('wallet_safeTip_afterKeystore')}
        </div>
        <Button
          className="safe-tip-knew"
          type="primary"
          onClick={this.handleKnew}
        >
          {toLocale('wallet_known')}
        </Button>
      </div>
    );
  }
  render() {
    return null;
  }
}

export default SafeTip;
