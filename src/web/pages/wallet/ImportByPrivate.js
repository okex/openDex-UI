import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button } from '_component/Button';
import { toLocale } from '_src/locale/react-locale';
import { crypto } from '@okexchain/javascript-sdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import PageURL from '_constants/PageURL';
import WalletPassword from '_component/WalletPassword';
import ValidateCheckbox from '_component/ValidateCheckbox';
import walletUtil from './walletUtil';
import './ImportByPrivateKey.less';

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
class ImportByprivateKey extends Component {
  constructor(props) {
    super(props);
    this.state = {
      privateKey: '',
      password: '',
      isValidatedPrivateKey: true,
      buttonLoading: false,
      isNone: false,
    };
    this.isValidatedPassword = false;
  }
  changePrivateKey = (e) => {
    const privateKey = e.target.value.trim();
    this.setState({
      privateKey,
      isValidatedPrivateKey: true,
      isNone: false,
    });
  };
  changePassword = ({ value, lengthCheck, chartCheck }) => {
    this.isValidatedPassword =
      lengthCheck === 'right' && chartCheck === 'right';
    this.setState({
      password: value,
    });
  };
  handleEnsure = () => {
    if (this.state.privateKey.length === 0) {
      this.setState({
        isNone: true,
      });
      return;
    }
    if (!this.isValidatedPassword || !this.state.isValidatedPrivateKey) {
      this.setState({
        updateLengthCheck: 'wrong',
        updateChartCheck: 'wrong',
      });
      return;
    }
    this.setState(
      {
        buttonLoading: true,
      },
      () => {
        setTimeout(this.validatePrivateKey, 10);
      }
    );
  };
  validatePrivateKey = () => {
    try {
      const { privateKey, password } = this.state;
      if (!/^[\d|a-f]{64}$/.test(privateKey)) {
        throw new Error('not pass the reg');
      }
      const keyStore = crypto.generateKeyStore(privateKey, password);
      walletUtil.setUserInSessionStroage(privateKey, keyStore);
      this.setState({
        isValidatedPrivateKey: true,
        buttonLoading: false,
        isNone: false,
      });
      this.props.commonAction.setPrivateKey(privateKey);
      this.props.history.push(PageURL.spotFullPage);
    } catch (e) {
      this.setState({
        isValidatedPrivateKey: false,
        buttonLoading: false,
        isNone: false,
      });
    }
  };
  render() {
    const {
      privateKey,
      isValidatedPrivateKey,
      buttonLoading,
      isNone,
    } = this.state;
    let p;
    if (isNone) {
      p = 'wallet_import_private_none';
    } else if (!isValidatedPrivateKey) {
      p = 'wallet_import_private_error';
    }
    return (
      <div className="import-by-privateKey-container">
        <div className="privateKey-container">
          <div>{toLocale('wallet_import_private_enter')}</div>
          <textarea value={privateKey} onChange={this.changePrivateKey} />
          <div style={{ color: '#FB6262' }}>{toLocale(p)}</div>
        </div>
        <div className="password-container">
          <WalletPassword
            placeholder={toLocale('wallet_import_password_placeholder')}
            onChange={this.changePassword}
            updateLengthCheck={this.state.updateLengthCheck}
            updateChartCheck={this.state.updateChartCheck}
          />
          <ValidateCheckbox type="warning" className="mar-top8">
            {toLocale('wallet_import_sessionPasswordTip')}
          </ValidateCheckbox>
        </div>
        <Button
          type="primary"
          loading={buttonLoading}
          onClick={this.handleEnsure}
        >
          {toLocale('wallet_ensure')}
        </Button>
      </div>
    );
  }
}

export default ImportByprivateKey;
