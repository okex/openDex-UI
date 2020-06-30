import React from 'react';
import PropTypes from 'prop-types';
import { toLocale } from '_src/locale/react-locale';
import { Dialog } from '_component/Dialog';
import { Button } from '_component/Button';
import Icon from '_src/component/IconLite';
import Config from '_constants/Config';
import './index.less';


/* eslint-disable react/sort-comp */
class Index extends React.Component {
  static propTypes = {
    isShow: PropTypes.bool,
    btnLoading: PropTypes.bool,
    warning: PropTypes.string,
    onEnter: PropTypes.func,
    onClose: PropTypes.func,
    updateWarning: PropTypes.func,
  };
  static defaultProps = {
    isShow: false,
    btnLoading: false,
    warning: '',
    onEnter: () => {},
    onClose: () => {},
    updateWarning: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      password: '',
    };
    this.inputType = 'password';
    if (window.navigator.userAgent.match(/webkit/i)) {
      this.inputType = 'text';
    }
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.isShow !== nextProps.isShow) {
      if (nextProps.isShow) {
        setTimeout(() => {
          this.pwdInput.focus();
        }, 100);
      }
      if (!nextProps.isShow) {
        // 从显示到隐藏，清空密码框
        this.setState({
          password: '',
        });
      }
    }
  }
  clearPwd = () => {
    this.setState({ password: '' }, () => {
      this.pwdInput.focus();
    });
  };
  // 输入密码
  onChangePwd = (e) => {
    const password = e.target.value;
    let localWarning = '';
    this.setState({ password });
    const { lengthReg, chartReg } = Config.pwdValidate;
    const lengthCheck = lengthReg.test(password);
    const chartCheck = chartReg.test(password);
    // todo: 是否要在onfirm的时候检查呢？
    if (!lengthCheck) {
      localWarning = toLocale('wallet_password_lengthValidate'); // 至少10位字符
    } else if (!chartCheck) {
      localWarning = toLocale('wallet_password_chartValidate'); // 必须包含数字、大小写字母
    }
    this.props.updateWarning(localWarning);
  };
  isDisabled = () => {
    const { lengthReg, chartReg } = Config.pwdValidate;
    const { password } = this.state;
    const lengthCheck = lengthReg.test(password);
    const chartCheck = chartReg.test(password);
    return password === '' || !lengthCheck || !chartCheck;
  };
  render() {
    const {
      btnLoading, isShow, onEnter, onClose, warning
    } = this.props;
    const { password } = this.state;
    return (
      <Dialog
        theme="base-dialog pwd-dialog"
        title={toLocale('please_input_pwd')}
        openWhen={isShow}
        onClose={onClose}
      >
        <div className="pwd-container">
          <input
            placeholder={toLocale('wallet_password_placeholder')}
            type={this.inputType}
            className="pwd-input"
            autoComplete="new-pwd-input"
            value={password}
            onChange={this.onChangePwd}
            onPaste={(e) => { e.preventDefault(); }}
            ref={(dom) => {
              this.pwdInput = dom;
            }}
          />
          <Icon className="clear-pwd icon-close-circle" onClick={this.clearPwd} />
          <p className="pwd-error">{warning}</p>
          <Button
            block
            type={Button.btnType.primary}
            onClick={() => {
              onEnter(this.state.password);
            }}
            loading={btnLoading}
            disabled={this.isDisabled()}
          >
            {toLocale('OK')}
          </Button>
        </div>
      </Dialog>
    );
  }
}

export default Index;
