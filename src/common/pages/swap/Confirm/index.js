import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import util from '_src/utils/util';
import Message from '_src/component/Message';
import PasswordDialog from '_component/PasswordDialog';
import * as CommonAction from '_src/redux/actions/CommonAction';

function mapStateToProps(state) {
  const { okexchainClient,privateKey } = state.Common;
  return { okexchainClient,privateKey };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}
@connect(mapStateToProps, mapDispatchToProps)
export default class Confirm extends React.Component {

  constructor() {
    super();
    this.state = {
      isShow:false,
      pwdErr:'',
      processingPwd:false
    }
  }

  onClose = () => {
    this.setState({isShow:false});
  }

  onEnter = (pwd) => {
    if (!util.isLogined()) window.location.reload();
    if (this.state.processingPwd) return;
    this.setState({processingPwd: true});
    const {commonAction,okexchainClient} = this.props;
    setTimeout(() => {
      commonAction.validatePassword(pwd, (privateKey) => {
        this.onClose();
        okexchainClient.setAccountInfo(privateKey).then(() => {
          this.onClick(false);
        });
      },() => {
        this.setState({
          pwdErr: toLocale('trans_err_pwd'),
          processingPwd: false,
        });
        }
      );
    },20)
  }

  checkPwd() {
    if (!util.isLogined()) window.location.reload();
    const expiredTime = window.localStorage.getItem('pExpiredTime') || 0;
    if (new Date().getTime() >= +expiredTime || !this.props.privateKey) {
      this.setState({isShow:true});
      return false;
    }
    return true;
  }

  confirmBtn() {
    const {children} = this.props;
    const child = React.Children.only(children);
    return React.cloneElement(child,{
      onClick: () => this.onClick()
    });
  }

  onClick = async (checkPwd=true) => {
    const {loadingTxt,successTxt,onClick} = this.props;
    if(!onClick || this.loading) return;
    if(checkPwd && !this.checkPwd()) return;
    let loadingToast;
    try {
      this.loading = true;
      loadingToast = loadingTxt ? Message.loading({
        content: loadingTxt,
        duration: 0,
      }) : null;
      const fn = util.debounce(onClick, 100);
      await fn();
      if(loadingToast) loadingToast.destroy();
      if(successTxt) Message.success({
        content: successTxt,
        duration: 3,
      });
      this.loading = false;
    } catch(e) {
      console.log(e);
    } finally {
      if(loadingToast) loadingToast.destroy();
      this.loading = false;
    }
  }

  render() {
    const {pwdErr,processingPwd,isShow} = this.state;
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
    )
  }
}