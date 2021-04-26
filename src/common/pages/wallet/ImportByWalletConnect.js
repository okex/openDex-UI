import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '_component/Button';
import { toLocale } from '_src/locale/react-locale';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import util from '_src/utils/util';
import classNames from 'classnames';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import walletUtil from './walletUtil';
import './walletconnect.less';

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
      qrcodeError: false,
      walletBtnTxtKey: 'wallet_connect_ensure',
    };
  }

  handleEnsure = () => {
    this.setState({
      buttonLoading: true,
      qrcodeError: false,
      walletBtnTxtKey: 'wallet_connect_ensureing',
    });
    this.props.commonAction.getWalletConnectQrcode({
      sessionSuccess: () => {
        this.setState({
          buttonLoading: false,
          qrcodeError: false,
          walletBtnTxtKey: 'wallet_connect_ensure',
        });
      },
      sessionCancel: () => {
        this.setState({
          buttonLoading: false,
          qrcodeError: false,
          walletBtnTxtKey: 'wallet_connect_ensure',
        });
      },
      sessionFail: () => {
        this.setState({
          buttonLoading: false,
          qrcodeError: true,
          walletBtnTxtKey: 'wallet_connect_ensure',
        });
      },
      success: ({ address }) => {
        this.validateWalletConnect(address);
      },
    });
  };

  validateWalletConnect = (address) => {
    walletUtil.setUserInSessionStroageByWalletConnect(address);
    util.go(DesktopTypeMenu.current ? DesktopTypeMenu.current.url : void 0);
  };

  render() {
    const { buttonLoading, walletBtnTxtKey, qrcodeError } = this.state;
    return (
      <div className="import-by-walletconnect-container">
        <div className="walletconnect-container">
          <div className="walletconnect-title">
            {toLocale('wallet_connect_title')}
          </div>
          <div className="walletconnect-title-tip">
            {toLocale('wallet_connect_title_tip')}
          </div>
          {qrcodeError && (
            <div className="walletconnect-error">
              <span>{toLocale('wallet_connect_error')}</span>
            </div>
          )}
        </div>
        <Button
          type="primary"
          className={classNames({ loading: buttonLoading })}
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
