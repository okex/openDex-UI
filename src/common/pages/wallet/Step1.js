import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { crypto } from '@okexchain/javascript-sdk';
import Icon from '_src/component/IconLite';
import Input from '_component/Input';
import WalletPassword from '_component/WalletPassword';
import { Button } from '_component/Button';
import { Checkbox } from '_component/Checkbox';
import * as walletActions from '_src/redux/actions/WalletAction';
import WalletLeft from '_component/WalletLeft';
import WalletRight from '_component/WalletRight';
import PageURL from '_constants/PageURL';
import './Step.less';
import './Step1.less';

function mapStateToProps() {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {
    walletAction: bindActionCreators(walletActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Step1 extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pwdFirst: '',
      pwdTwice: '',
      showTwicePwd: false,
      isSamePwd: true,
      knowCheck: false,
      canNext: false,
      nextLoading: false,
    };
    this.isValidatedPassword = false;
  }

  onNext = () => {
    if (this.state.nextLoading) {
      return false;
    }
    return this.setState(
      {
        nextLoading: true,
      },
      () => {
        setTimeout(() => {
          const { walletAction } = this.props;
          const mnemonic = crypto.generateMnemonic();
          const privateKey = crypto.getPrivateKeyFromMnemonic(mnemonic, '996');
          const keyStore = crypto.generateKeyStore(
            privateKey,
            this.state.pwdFirst
          );
          walletAction.updateMnemonic(mnemonic);
          walletAction.updatePrivate(privateKey);
          walletAction.updateKeyStore(keyStore);
          return walletAction.updateCreateStep(2);
        }, 20);
      }
    );
  };

  validateCanNext = () => {
    const { isSamePwd, pwdTwice, knowCheck } = this.state;
    this.setState({
      canNext:
        this.isValidatedPassword && isSamePwd && pwdTwice != '' && knowCheck,
    });
  };

  tooglePwdTwiceType = () => {
    this.setState({
      showTwicePwd: !this.state.showTwicePwd,
    });
  };

  changePwdFirst = ({ value, lengthCheck, chartCheck }) => {
    this.isValidatedPassword =
      lengthCheck === 'right' && chartCheck === 'right';
    const pwdFirst = value;
    const { pwdTwice } = this.state;
    this.setState(
      {
        pwdFirst,
        isSamePwd: pwdTwice === '' ? true : pwdFirst === pwdTwice,
      },
      this.validateCanNext
    );
  };

  changePwdTwice = (e) => {
    const pwdTwice = e.target.value;
    const { pwdFirst } = this.state;
    this.setState(
      {
        pwdTwice,
        isSamePwd: pwdTwice != '' && pwdFirst === pwdTwice,
      },
      this.validateCanNext
    );
  };

  changeKnow = (checked) => {
    this.setState(
      {
        knowCheck: checked,
      },
      this.validateCanNext
    );
  };

  render() {
    const {
      showTwicePwd,
      pwdTwice,
      isSamePwd,
      canNext,
      nextLoading,
      knowCheck,
    } = this.state;
    return (
      <div className="create-wallet-step1 wallet-step-dialog">
        <WalletLeft
          stepNo={1}
          stepName={toLocale('wallet_create_step1')}
          imgUrl="https://static.bafang.com/cdn/assets/imgs/MjAxOTQ/2746959A3B06A9073C31362399AD0C32.png"
        />
        <WalletRight>
          <div className="set-password-container">
            <div className="set-password-first">
              <WalletPassword onChange={this.changePwdFirst} />
            </div>
            <div className="set-password-twice">
              <Input
                value={pwdTwice}
                type={
                  !window.navigator.userAgent.match(/webkit/i)
                    ? 'password'
                    : 'text'
                }
                autoComplete="new-password"
                placeholder={toLocale('wallet_twicePassword')}
                onChange={this.changePwdTwice}
                onPaste={(e) => {
                  e.preventDefault();
                }}
                error={isSamePwd ? '' : toLocale('wallet_passwordNotSame')}
                className={showTwicePwd ? 'show' : ''}
                theme="dark"
                suffix={() => {
                  const IconClsName = showTwicePwd
                    ? 'icon-icon_display'
                    : 'icon-icon_hide';
                  return (
                    <Icon
                      className={IconClsName}
                      onClick={this.tooglePwdTwiceType}
                    />
                  );
                }}
              />
              <div className="mar-top8">
                <Checkbox
                  checked={knowCheck}
                  className="mar-top8"
                  onChange={this.changeKnow}
                >
                  <span className="know-check">
                    {toLocale('wallet_unsaveTip')}
                  </span>
                </Checkbox>
              </div>
            </div>

            <div className="next-row">
              <span>
                {toLocale('wallet_hadWallet')}
                &nbsp;
                <Link to={PageURL.walletImport}>
                  {toLocale('wallet_importNow')}
                </Link>
              </span>
              <Button
                type="primary"
                onClick={this.onNext}
                loading={nextLoading}
                disabled={!canNext}
              >
                {toLocale('wallet_nextStep')}
              </Button>
            </div>
          </div>
        </WalletRight>
      </div>
    );
  }
}

export default Step1;
