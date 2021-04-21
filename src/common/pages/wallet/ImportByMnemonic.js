import React, { Component, createRef } from 'react';
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
import URL from '_src/constants/URL';
import ont from '_src/utils/dataProxy';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import env from '_src/constants/env';
import { calc } from '_component/okit';
import defaultSelect from '_src/assets/images/defaultSelect.svg'
import selected from '_src/assets/images/selected.svg'
import walletTypeTree from '_src/assets/images/walletTypeTree.svg'
import introduce from '_src/assets/images/introduce.svg'
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
    const know = window.localStorage.getItem(env.envConfig.know)
    this.state = {
      mnemonic: '',
      password: '',
      isValidatedMnemonic: true,
      buttonLoading: false,
      isNone: false,
      step: know ? 1 : 0,
      oldBalance: '',
      newBalance: '',
      oldPrivateKey: '',
      newPrivateKey: '',
      pathType: ''
    };
    this.isValidatedPassword = false;
    this.passwordInput = createRef()
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
    if (!this.state.pathType) return
    const generateKey = () => {
      const { pathType, newPrivateKey, oldPrivateKey, password} = this.state
      const privateKey = pathType === 'old' ? oldPrivateKey : newPrivateKey
      const keyStore = crypto.generateKeyStore(privateKey, password);
      window.localStorage.setItem(env.envConfig.mnemonicPathType, pathType)
      walletUtil.setUserInSessionStroage(privateKey, keyStore);
      this.props.commonAction.setPrivateKey(privateKey);
      util.go(DesktopTypeMenu.current ? DesktopTypeMenu.current.url : void 0);
    }
    this.setState({
      buttonLoading: true,
    }, () => {
      setTimeout(generateKey, 10);
    });
  }
  prevStep = () => {
    this.setState({
      step: 1,
      pathType: '',
      mnemonic: ''
    })
    this.passwordInput.current.changeValue({target: {value: ''}})
  }
  selectPathType = (type) => {
    this.setState({
      pathType: type
    })
  }
  nextStep = () => {
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
  fetchAcount = (address) => {
    return new Promise((resolve, reject) => {
      ont.get(`${URL.GET_ACCOUNTS}/${address}`, {
        params: { symbol: env.envConfig.token.base },
      })
      .then(({ data }) => {
        let { currencies=[] } = data;
        if (currencies.length > 0 && currencies[0].symbol === 'okt') {
          resolve(currencies[0].available)
          return
        }
        resolve(0)
      })
      .catch((err) => {
        reject(err);
      });
    })
  }
  validateMnemonic = async () => {
    try {
      const mnemonic = this.state.mnemonic.trim();
      const oldPrivateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, 996);
      const newPrivateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, 60);
      const oldAddress = crypto.getAddressFromPrivateKey(oldPrivateKey, env.envConfig.addressPrefix);
      const newAddress = crypto.getAddressFromPrivateKey(newPrivateKey, env.envConfig.addressPrefix);
      const oldBalance = await this.fetchAcount(oldAddress)
      const newBalance = await this.fetchAcount(newAddress)
      this.setState({
        isValidatedMnemonic: true,
        buttonLoading: false,
        isNone: false,
        oldBalance: calc.showFloorTruncation(oldBalance),
        newBalance: calc.showFloorTruncation(newBalance),
        oldPrivateKey,
        newPrivateKey,
        newAddress: crypto.convertBech32ToHex(newAddress)[0],
        oldAddress,
        step: 2
      });
    } catch (e) {
      this.setState({
        isValidatedMnemonic: false,
        buttonLoading: false,
        isNone: false,
      });
    }
  };
  know = () => {
    window.localStorage.setItem(env.envConfig.know, 'have')
    this.setState({
      step: 1
    })
  }

  omit = (addr) => {
    if (!addr) return ''
    return addr.slice(0, 5) + '...' + addr.slice(addr.length - 1 - 5, addr.length - 1)
  }
  render() {
    const {
      mnemonic, isValidatedMnemonic, buttonLoading, isNone, step, pathType,
      oldAddress, newAddress, oldBalance, newBalance
    } = this.state;
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
        <div className={"step0 step-content instructions" + (step === 0 ? ' show' : ' hidden')}>
          <div className="tree">
            <img src={walletTypeTree} alt=""/>
          </div>
          <div className="article">
            <h1>{toLocale('import_mnemonic_article_title')}</h1>
            <p>{toLocale('import_mnemonic_article_content1')}</p>
            <p>{toLocale('import_mnemonic_article_content2')}</p>
            <p>{toLocale('import_mnemonic_article_content3')}</p>
          </div>
          <div className="mnemonic-footer">
            <Button type="primary" loading={buttonLoading} onClick={this.know}>
              {toLocale('import_mnemonic_know_button')}
            </Button>
          </div>
        </div>
        <div className={"step1 step-content" + (step === 1 ? ' show' : ' hidden')}>
          <div className="mnemonic-container">
            <div>{toLocale('wallet_import_mnemonic_enter')}</div>
            <textarea value={mnemonic} onChange={this.changeMnemonic} />
            <div className={className} style={{ fontSize: '12px' }}>
              {toLocale(p)}
            </div>
          </div>
          <div className="password-container">
            <WalletPassword
              ref={this.passwordInput}
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
              type="primary"
              loading={buttonLoading}
              onClick={this.nextStep}
             >
              {toLocale('next_step')}
             </Button>
          </div>
        </div>
        <div className={"step2 step-content" + (step === 2 ? ' show' : ' hidden')}>
          <div className="step-path-title">
            {toLocale('import_mnemonic_select_title')}
            <div className="icon-introduce-container" tabIndex="0" onBlur={this.closeInstructions}>
              <img className="icon-introduce" src={introduce} alt=""/>
              <div className="instruction-tips">
                <p>{toLocale('import_mnemonic_article_content1')}</p>
                <p>{toLocale('import_mnemonic_article_content2')}</p>
                <p>{toLocale('import_mnemonic_article_content3')}</p>
              </div>
            </div>
          </div>
          <div className={"step-path-content" + (pathType === 'new' ? ' select' : '')} onClick={() => this.selectPathType('new')}>
            <p className="select-box">
              <span>{toLocale('import_mnemonic_new_user', {addr: this.omit(newAddress), num: newBalance})}</span>
              <img className="select-icon" src={pathType === 'new' ? selected : defaultSelect} alt=""/>
            </p>
            <p>{toLocale('import_mnemonic_new_instructions')}</p>
          </div>
          <div className={"step-path-content" + (pathType === 'old' ? ' select' : '')} onClick={() => this.selectPathType('old')}>
            <p className="select-box">
              <span>{toLocale('import_mnemonic_old_user', {addr: this.omit(oldAddress), num: oldBalance})}</span>
              <img className="select-icon" src={pathType === 'old' ? selected : defaultSelect} alt=""/>
            </p>
            <p>{toLocale('import_mnemonic_old_instructions')}</p>
            <p className="mnemonic-path-tip">{toLocale('import_mnemonic_path_tip')}</p>
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
              disabled={!pathType}
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
