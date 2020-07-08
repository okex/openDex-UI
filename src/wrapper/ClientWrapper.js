import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';
import Config from '_constants/Config';
import PasswordDialog from '_component/PasswordDialog';
import { toLocale } from '_src/locale/react-locale';

function mapStateToProps(state) {
  const { okchainClient, privateKey } = state.Common;
  return {
    privateKey,
    okchainClient,
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

    // 开启资金密码弹窗
    onPwdOpen = () => {
      this.setState({
        isShowPwdDialog: true
      }, () => {
        const o = window.document.getElementsByClassName('pwd-input');
        if (o && o[0] && o[0].focus) {
          o[0].focus();
        }
      });
    };

    onPwdClose = () => {
      this.setState({
        isLoading: false,
        isShowPwdDialog: false
      });
    }

    onPwdEnter = (password) => {
      const { commonAction } = this.props;
      if (password.trim() === '') {
        return this.updateWarning(toLocale('spot.place.tips.pwd'));
      }
      this.updateWarning('');
      this.setState({
        isLoading: true
      }, () => {
        setTimeout(() => {
          commonAction.validatePassword(password, () => {
            this.setState({
              isShowPwdDialog: false,
            }, () => {
              this.setAccountInfo(this.wrappedInstance.onPwdSuccess);
            });
          }, () => {
            this.setState({
              warning: toLocale('pwd_error'),
              isLoading: false,
            });
          });
        }, Config.validatePwdDeferSecond);
      });
      return false;
    }

    setAccountInfo = (success) => {
      const { okchainClient, privateKey } = this.props;
      okchainClient.setAccountInfo(privateKey).then(() => {
        success && success();
      });
    }

    updateWarning = (warning) => {
      this.setState({
        warning
      });
    }

    checkPK = (success) => {
      // 检查私钥，如果未过期直接取私钥，如果过期显示弹窗
      const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
      // 小于30分钟，且privateKey，（true时），不需要输入密码，直接提交
      if ((new Date().getTime() < +expiredTime) && this.props.privateKey) {
        // 没过期、提交操作
        this.setAccountInfo(success);
      } else {
        this.onPwdOpen();
      }
    }

    render() {
      const { isShowPwdDialog, isLoading, warning } = this.state;
      return (
        <Fragment>
          <Com
            {...this.props}
            checkPK={this.checkPK}
            ref={(instance) => { this.wrappedInstance = instance; }}
          />
          <PasswordDialog
            btnLoading={isLoading}
            warning={warning}
            isShow={isShowPwdDialog}
            updateWarning={this.updateWarning}
            onEnter={this.onPwdEnter}
            onClose={this.onPwdClose}
          />
        </Fragment>
      );
    }
  }

  return Client;
};

export default ClientWrapper;
