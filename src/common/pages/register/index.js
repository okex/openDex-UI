import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import { Dialog } from '_component/Dialog';
import Message from '_src/component/Message';
import { toLocale } from '_src/locale/react-locale';
import RegisterInput from '_component/DexDesktopInput';
import ClientWrapper from '_src/wrapper/ClientWrapper';
import Config from '_constants/Config';
import util from '_src/utils/util';
import { validateTxs } from '_src/utils/client';
import './index.less';

const opJson = {
  dex_name: '',
  dex_owner_key: '',
  org: {
    website: '',
    code_of_conduct: '',
    email: '',
    branding: {
      logo_256: '',
      logo_1024: '',
      logo_svg: '',
    },
    location: {
      name: '',
      country: '',
      latitude: 0,
      longitude: 0,
    },
    social: {
      steemit: '',
      twitter: '',
      youtube: '',
      facebook: '',
      github: '',
      reddit: '',
      keybase: '',
      telegram: '',
    },
  },
  nodes: [
    {
      location: {
        name: '',
        country: '',
        latitude: 0,
        longitude: 0,
      },
      node_type: '',
      api_endpoint: '',
    },
    {
      location: {
        name: '',
        country: '',
        latitude: 0,
        longitude: 0,
      },
      node_type: '',
      ws_endpoint: '',
    },
  ],
};

const showError = (content = toLocale('sysError')) => {
  Message.error({
    content,
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
      websiteValue: e.target.value,
    });
  };

  onFeeAddressChange = (e) => {
    this.setState({
      feeAddressValue: e.target.value,
    });
  };

  onRegister = () => {
    this.setState({ isActionLoading: true });
    const { websiteValue, feeAddressValue } = this.state;
    const { okexchainClient } = this.props;
    okexchainClient
      .sendRegisterDexOperatorTransaction(websiteValue, feeAddressValue)
      .then((res) => {
        this.setState({ isActionLoading: false });
        const { result } = res;
        const { data } = result;
        if (!validateTxs(res)) {
          showError(
            toLocale(`error.code.${res.result.code}`) || res.result.msg
          );
        } else {
          const dialog = Dialog.success({
            className: 'desktop-success-dialog',
            confirmText: 'Get detail',
            theme: 'dark',
            title: 'Register success！',
            windowStyle: {
              background: '#112F62',
            },
            onConfirm: () => {
              window.open(`${Config.okexchain.browserUrl}/tx/${data}`);
              dialog.destroy();
            },
          });
        }
      })
      .catch((err) => {
        this.setState({ isActionLoading: false });
        showError(err.message || toLocale('sysError'));
      });
  };

  onPwdSuccess = () => {
    this.onRegister();
  };

  handleRegister = () => {
    this.props.checkPK(this.onRegister);
  };

  handleDownloadOperator = () => {
    util.downloadObjectAsJson(opJson, 'operator.json');
  };

  render() {
    const { websiteValue, feeAddressValue, isActionLoading } = this.state;
    return (
      <DexDesktopContainer
        isShowHelp={true}
        isShowAddress={true}
        needLogin={true}
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
          <div className="register-get-operato">
            <span
              className="operato-dl-btn"
              onClick={this.handleDownloadOperator}
            >
              Get operato
            </span>
          </div>
          <button
            className="dex-desktop-btn register-btn"
            onClick={this.handleRegister}
          >
            Register
          </button>
        </div>
      </DexDesktopContainer>
    );
  }
}

export default Register;
