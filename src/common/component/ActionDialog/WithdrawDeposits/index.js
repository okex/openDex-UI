import React, { Component, Fragment } from 'react';
import Message from '_src/component/Message';
import SingleInputDialog from '_component/ActionDialog/SingleInputDialog';
import showSuccessDialog from '_component/ActionDialog/successDialog';
import ClientWrapper from '_src/wrapper/ClientWrapper';
import util from '_src/utils/util';
import { isNumberString, isFunction } from '_src/utils/type';
import { toLocale } from '_src/locale/react-locale';
import { validateTxs } from '_src/utils/client';

const showError = (content = toLocale('sysError')) => {
  Message.error({
    content,
  });
};

@ClientWrapper
class WithdrawDepositsDialog extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  };

  onClose = () => {
    this.props.onClose();
    this.setState({
      value: '',
    });
  };

  onWithdraw = () => {
    const {
      okexchainClient,
      project,
      beforeWithdraw,
      afterWithdraw,
    } = this.props;
    isFunction(beforeWithdraw) && beforeWithdraw();
    const { value } = this.state;
    const amount = util.precisionInput(value);
    okexchainClient
      .sendWithdrawProductDepositTransaction(amount, project)
      .then((res) => {
        this.setState({ value: '' });
        isFunction(afterWithdraw) && afterWithdraw();
        const { result } = res;
        const { txhash } = result;
        if (!validateTxs(res)) {
          showError(
            toLocale(`error.code.${res.result.code}`) || res.result.msg
          );
        } else {
          showSuccessDialog('Withdraw deposits success！', txhash);
        }
      })
      .catch((err) => {
        console.log(err);
        isFunction(afterWithdraw) && afterWithdraw();
        showError(err.message || toLocale('sysError'));
        this.setState({ value: '' });
      });
  };

  onPwdSuccess = () => {
    this.onWithdraw();
  };

  handleWithdraw = () => {
    const { value } = this.state;
    if (isNumberString(value)) {
      this.props.onClose();
      this.props.checkPK(this.onWithdraw);
    } else {
      Message.error({
        content: '输入类型错误，请重新输入',
      });
    }
  };

  render() {
    const { visible } = this.props;
    const { value } = this.state;

    return (
      <Fragment>
        <SingleInputDialog
          value={value}
          onChange={this.onChange}
          title="Withdraw deposits"
          visible={visible}
          onClose={this.onClose}
          onConfirm={this.handleWithdraw}
        />
      </Fragment>
    );
  }
}

export default WithdrawDepositsDialog;
