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
import walletUtil from './walletUtil';
import util from '_src/utils/util';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import './ImportByMnemonic.less';
import defaultSelect from '_src/assets/images/defaultSelect.svg'
import selected from '_src/assets/images/selected.svg'


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
      step: 1,
      pathType: 'new'
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
  nextStep = () => {
    if (!this.state.pathType) return
    this.setState({
      step: 2
    })
  }
  prevStep = () => {
    this.setState({
      step: 1
    })
  }
  selectPathType = (type) => {
    this.setState({
      pathType: type
    })
  }
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
      const { password, pathType } = this.state;
      const mnemonic = this.state.mnemonic.trim();
      const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, pathType === 'old' ? 996 : 60);
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
    const { mnemonic, isValidatedMnemonic, buttonLoading, isNone, step, pathType } = this.state;
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
        <div className={"step1 step-content" + (step === 1 ? ' show' : ' hidden')}>
          <p className="step-path-title">{toLocale('import_mnemonic_select_title')}</p>
          <div className={"step-path-content" + (pathType === 'new' ? ' select' : '')} onClick={() => this.selectPathType('new')}>
            <p className="select-box">
              <span>{toLocale('import_mnemonic_new_user')}</span>
              <img className="select-icon" src={pathType === 'new' ? selected : defaultSelect} alt=""/>
            </p>
            <p>{toLocale('import_mnemonic_new_instructions')}</p>
          </div>
          <div className={"step-path-content" + (pathType === 'old' ? ' select' : '')} onClick={() => this.selectPathType('old')}>
            <p className="select-box">
              <span>{toLocale('import_mnemonic_old_user')}</span>
              <img className="select-icon" src={pathType === 'old' ? selected : defaultSelect} alt=""/>
            </p>
            <p>{toLocale('import_mnemonic_old_instructions')}</p>
            <p className="mnemonic-path-tip">{toLocale('import_mnemonic_path_tip')}</p>
          </div>
          <div className="mnemonic-footer">
            <Button
              type="primary"
              onClick={this.nextStep}
            >
              {toLocale('next_step')}
            </Button>
          </div>
        </div>
        <div className={"step2 step-content" + (step === 2 ? ' show' : ' hidden')}>
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
          <div className="mnemonic-footer">
            <Button
              className="prev-btn"
              onClick={this.prevStep}
            >
              {toLocale('prev_step')}
            </Button>
            <Button
              type="primary"
              loading={buttonLoading}
              onClick={this.handleEnsure}
            >
              {toLocale('ensure')}
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ImportByMnemonic;
