import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import { Button } from '_component/Button';
import { crypto } from '@okexchain/javascript-sdk';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as commonActions from '_src/redux/actions/CommonAction';
import WalletPassword from '_component/WalletPassword';
import ValidateCheckbox from '_component/ValidateCheckbox';
import util from '_src/utils/util';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import walletUtil from './walletUtil';
import './ImportByMnemonic.less';

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
class ImportByMnemonic extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mnemonic: '',
      password: '',
      isValidatedMnemonic: true,
      buttonLoading: false,
      isNone: false,
    };
    this.isValidatedPassword = false;
  }

  changeMnemonic = (e) => {
    const mnemonic = e.target.value;
    this.setState({
      mnemonic,
      isValidatedMnemonic: true,
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
    if (this.state.mnemonic.length === 0) {
      this.setState({
        isNone: true,
      });
      return;
    }
    if (!this.isValidatedPassword || !this.state.isValidatedMnemonic) {
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
        setTimeout(this.validateMnemonic, 10);
      }
    );
  };

  validateMnemonic = () => {
    try {
      const { password } = this.state;
      const mnemonic = this.state.mnemonic.trim();
      const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, '996');
      const keyStore = crypto.generateKeyStore(privateKey, password);
      walletUtil.setUserInSessionStroage(privateKey, keyStore);
      this.setState({
        isValidatedMnemonic: true,
        buttonLoading: false,
        isNone: false,
      });
      this.props.commonAction.setPrivateKey(privateKey);
      util.go(DesktopTypeMenu.current ? DesktopTypeMenu.current.url : void 0);
    } catch (e) {
      this.setState({
        isValidatedMnemonic: false,
        buttonLoading: false,
        isNone: false,
      });
    }
  };

  render() {
    const { mnemonic, isValidatedMnemonic, buttonLoading, isNone } = this.state;
    let p;
    let className = '';
    if (isNone) {
      p = 'wallet_import_mnemonic_none';
      className = 'prompt-container';
    } else if (isValidatedMnemonic) {
      p = 'wallet_import_mnemonic_splitTip';
    } else {
      className = 'prompt-container';
      p = 'wallet_import_mnemonic_error';
    }
    return (
      <div className="import-by-mnemonic-container">
        <div className="mnemonic-container">
          <div>{toLocale('wallet_import_mnemonic_enter')}</div>
          <textarea value={mnemonic} onChange={this.changeMnemonic} />
          <div className={className} style={{ fontSize: '12px' }}>
            {toLocale(p)}
          </div>
        </div>
        <div className="password-container">
          <WalletPassword
            placeholder={toLocale('wallet_import_mnemonic_sessionPassword')}
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

export default ImportByMnemonic;
