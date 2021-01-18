import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '_component/Button';
import { toLocale } from '_src/locale/react-locale';
import { crypto } from '@okexchain/javascript-sdk'; 
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import walletUtil from './walletUtil';
import util from '_src/utils/util';
import classNames from 'classnames';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import './ImportBywalletconnect.less';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(commonActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class ImportByWalletConnect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      buttonLoading: false,
      qrcodeUri:'',
      walletBtnTxtKey: 'wallet_connect_ensure'
    };
  }
  
  handleEnsure = () => {
    this.setState(
      {
        buttonLoading: true,
        walletBtnTxtKey: 'wallet_connect_ensureing'
      },
      () => {
        setTimeout(this.validateWalletConnect, 3000);
      }
    );
  };
  validateWalletConnect = () => {
    try {
      // walletUtil.setUserInSessionStroage(walletconnect, keyStore);
      util.go(DesktopTypeMenu.current ? DesktopTypeMenu.current.url : void 0);
    } finally {
      this.setState({
        buttonLoading: false,
        walletBtnTxtKey: 'wallet_connect_ensure'
      });
    }
  };
  render() {
    const {
      buttonLoading,walletBtnTxtKey
    } = this.state;
    return (
      <div className="import-by-walletconnect-container">
        <div className="walletconnect-container">
          <div className="walletconnect-title">{toLocale('wallet_connect_title')}</div>
          <div className="walletconnect-title-tip">{toLocale('wallet_connect_title_tip')}</div>
          <div className="walletconnect-error"><span>{toLocale('wallet_connect_error')}</span></div>
        </div>
        {/* <div className="qrcode-wrap">
          <div className="qrcode-title">{toLocale('wallet_connect_qrcode')}</div>
          <div className="qrcode-contain">
            <div className="qrcode-title-desc">{toLocale('wallet_connect_qrcodedesc')}</div>
            <div className="qrcode-img"></div>
          </div>
        </div> */}
        <Button
          type="primary"
          className={classNames({loading:buttonLoading})}
          loading={buttonLoading}
          onClick={this.handleEnsure}
        >
          {toLocale(walletBtnTxtKey)}
        </Button>
      </div>
    );
  }
}

export default ImportByWalletConnect;
