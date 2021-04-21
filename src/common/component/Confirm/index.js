import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import Message from '_src/component/Notification';
import PasswordDialog from '_component/PasswordDialog';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { validateTxs } from '_src/utils/client';
import Config from '../../constants/Config';
import getRef from '../getRef';

function mapStateToProps(state) {
  const { okexchainClient, privateKey } = state.Common;
  return { okexchainClient, privateKey };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}
@connect(mapStateToProps, mapDispatchToProps)
@getRef
export default class Confirm extends React.Component {
  constructor() {
    super();
    this.state = {
      isShow: false,
      pwdErr: '',
      processingPwd: false,
      loading: false,
    };
    this._onClick = util.debounce(this.onClick, 300);
  }

  onClose = () => {
    this.setState({ isShow: false, pwdErr: '' });
  };

  onEnter = (pwd) => {
    if (!util.isLogined()) window.location.reload();
    if (this.state.processingPwd) return;
    this.setState({ processingPwd: true });
    const { commonAction } = this.props;
    setTimeout(() => {
      commonAction.validatePassword(
        pwd,
        (privateKey) => {
          this.onClose();
          this.onClick(privateKey, false);
        },
        () => {
          this.setState({
            pwdErr: toLocale('trans_err_pwd'),
            processingPwd: false,
          });
        }
      );
    }, 20);
  };

  checkPwd() {
    if (!util.isLogined()) return window.location.reload();
    if (util.isWalletConnect()) return true;
    const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
    if (new Date().getTime() >= +expiredTime || !this.props.privateKey) {
      this.setState({ isShow: true });
      return false;
    }
    return true;
  }

  confirmBtn() {
    const { children } = this.props;
    if (!children) return null;
    const child = React.Children.only(children);
    return React.cloneElement(child, {
      onClick: () => this._onClick(),
    });
  }

  onClick = (privateKey, checkPwd = true) => {
    const {
      loadingTxt,
      successTxt,
      onClick,
      okexchainClient,
      onCancel,
    } = this.props;
    if (!onClick || this.loading) return;
    if (checkPwd && !this.checkPwd()) return;
    this.setState({ loading: true });
    privateKey = privateKey || this.props.privateKey;
    okexchainClient
      .setAccountInfo(privateKey || this.props.privateKey)
      .then(async () => {
        let loadingToast;
        try {
          this.loading = true;
          loadingToast = loadingTxt
            ? Message.loading({
                content: loadingTxt,
                desc: (
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    href={`${
                      Config.okexchain.browserAddressUrl
                    }/${util.getMyAddr()}`}
                  >
                    {toLocale('pending transactions link')}
                  </a>
                ),
                duration: 0,
                onClose: () => {
                  this.loading = false;
                  if (onCancel) onCancel();
                },
              })
            : null;
          const res = await onClick();
          if (!validateTxs(res)) {
            throw new Error(
              toLocale(`error.code.${res.result.code}`) || res.result.msg
            );
          }
          if (successTxt) {
            loadingToast &&
              loadingToast.update({
                content: successTxt,
                type: Message.TYPE.success,
              });
          }
          this.loading = false;
        } catch (e) {
          const typeErr = e instanceof TypeError;
          const content =
            typeErr || e.message.includes('timing out')
              ? toLocale('network error')
              : e.message || toLocale('sysError');
          loadingToast &&
            loadingToast.update({
              content,
              type: Message.TYPE.error,
            });
        } finally {
          if (loadingToast) {
            setTimeout(() => {
              loadingToast.destroy();
            }, 5000);
          }
          this.loading = false;
          this.setState({ loading: false });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { pwdErr, processingPwd, isShow } = this.state;
    return (
      <>
        {this.confirmBtn()}
        <PasswordDialog
          isShow={isShow}
          onClose={this.onClose}
          onEnter={this.onEnter}
          btnLoading={processingPwd}
          updateWarning={(err) => {
            this.setState({ pwdErr: err });
          }}
          warning={pwdErr}
        />
      </>
    );
  }
}
