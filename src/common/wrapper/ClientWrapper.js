import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import Config from '_constants/Config';
import PasswordDialog from '_component/PasswordDialog';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';

function mapStateToProps(state) {
  const { okexchainClient, privateKey } = state.Common;
  return {
    privateKey,
    okexchainClient,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

const ClientWrapper = (Com) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class Client extends Component {
    constructor() {
      super();
      this.state = {
        isShowPwdDialog: false,
        isLoading: false,
        warning: '',
      };
    }

    onPwdOpen = () => {
      this.setState(
        {
          isShowPwdDialog: true,
        },
        () => {
          const o = window.document.getElementsByClassName('pwd-input');
          if (o && o[0] && o[0].focus) {
            o[0].focus();
          }
        }
      );
    };

    onPwdClose = () => {
      this.setState({
        isLoading: false,
        isShowPwdDialog: false,
      });
    };

    onPwdEnter = (password) => {
      const { commonAction } = this.props;
      if (password.trim() === '') {
        return this.updateWarning(toLocale('spot.place.tips.pwd'));
      }
      this.updateWarning('');
      this.setState(
        {
          isLoading: true,
        },
        () => {
          setTimeout(() => {
            commonAction.validatePassword(
              password,
              () => {
                this.setState(
                  {
                    isShowPwdDialog: false,
                  },
                  () => {
                    this.setAccountInfo(this.wrappedInstance.onPwdSuccess);
                  }
                );
              },
              () => {
                this.setState({
                  warning: toLocale('pwd_error'),
                  isLoading: false,
                });
              }
            );
          }, Config.validatePwdDeferSecond);
        }
      );
      return false;
    };

    setAccountInfo = (success) => {
      const { okexchainClient, privateKey } = this.props;
      okexchainClient.setAccountInfo(privateKey).then(() => {
        success && success();
      });
    };

    updateWarning = (warning) => {
      this.setState({
        warning,
      });
    };

    checkPK = (success) => {
      const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
      if (
        util.isWalletConnect() ||
        (new Date().getTime() < +expiredTime && this.props.privateKey)
      ) {
        this.setAccountInfo(success);
      } else {
        this.onPwdOpen();
      }
    };

    render() {
      const { isShowPwdDialog, isLoading, warning } = this.state;
      return (
        <>
          <Com
            {...this.props}
            checkPK={this.checkPK}
            ref={(instance) => {
              this.wrappedInstance = instance;
            }}
          />
          <PasswordDialog
            btnLoading={isLoading}
            warning={warning}
            isShow={isShowPwdDialog}
            updateWarning={this.updateWarning}
            onEnter={this.onPwdEnter}
            onClose={this.onPwdClose}
          />
        </>
      );
    }
  }

  return Client;
};

export default ClientWrapper;
