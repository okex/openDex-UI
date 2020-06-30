import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import { Dialog } from '_component/Dialog';
import Message from '_src/component/Message';
import PasswordDialog from '_component/PasswordDialog';
import { toLocale } from '_src/locale/react-locale';
import RegisterInput from '_component/DexDesktopInput';
import ClientWrapper from '_src/wrapper/ClientWrapper';
import './index.less';

const showError = () => {
  Message.error({
    content: '服务端异常，请稍后重试'
  });
};

@ClientWrapper
class Register extends Component {
  constructor() {
    super();
    this.state = {
      websiteValue: '',
      feeAddressValue: '',
      isActionLoading: false,
    };
  }

  onWebsiteChange = (e) => {
    this.setState({
      websiteValue: e.target.value
    });
  }

  onFeeAddressChange = (e) => {
    this.setState({
      feeAddressValue: e.target.value
    });
  }

  onRegister = () => {
    this.setState({ isActionLoading: true });
    const { websiteValue, feeAddressValue } = this.state;
    const { okchainClient } = this.props;
    okchainClient.sendRegisterDexOperatorTransaction(websiteValue, feeAddressValue).then((res) => {
      this.setState({ isActionLoading: false });
      const { result, status } = res;
      const log = JSON.parse(result.raw_log);
      if (status !== 200 || (log && log.code)) {
        showError();
      } else {
        const dialog = Dialog.success({
          className: 'desktop-success-dialog',
          confirmText: 'Get detail',
          theme: 'dark',
          title: 'Register success！',
          windowStyle: {
            background: '#112F62'
          },
          onConfirm: () => {
            dialog.destroy();
          },
        });
      }
    }).catch((err) => {
      console.log(err);
      this.setState({ isActionLoading: false });
      showError();
    });
  }

  onPwdEnter = (password) => {
    this.props.onPwdEnter(password, this.onRegister);
  }

  handleRegister = () => {
    this.props.checkPK(this.onRegister);
  }

  render() {
    const {
      websiteValue, feeAddressValue, isActionLoading
    } = this.state;
    const { isShowPwdDialog, isLoading, warning } = this.props;
    return (
      <DexDesktopContainer
        isShowHelp
        isShowAddress
        needLogin
        loading={isActionLoading}
      >
        <div className="register-container">
          <RegisterInput
            label={toLocale('register.website.label')}
            value={websiteValue}
            onChange={this.onWebsiteChange}
            hint={toLocale('register.website.hint')}
          />
          <RegisterInput
            label={toLocale('register.feeAddress.label')}
            value={feeAddressValue}
            onChange={this.onFeeAddressChange}
            hint={toLocale('register.feeAddress.hint')}
          />
          <div className="register-get-operato">Get operato</div>
          <button
            className="dex-desktop-btn register-btn"
            onClick={this.handleRegister}
          >
            Register
          </button>
          <PasswordDialog
            btnLoading={isLoading}
            warning={warning}
            isShow={isShowPwdDialog}
            updateWarning={this.props.updateWarning}
            onEnter={this.onPwdEnter}
            onClose={this.props.onPwdClose}
          />
        </div>
      </DexDesktopContainer>
    );
  }
}

export default Register;
