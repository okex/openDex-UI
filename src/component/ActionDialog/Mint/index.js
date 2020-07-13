import React, { Component, Fragment } from 'react';
import Message from '_src/component/Message';
import SingleInputDialog from '_component/ActionDialog/SingleInputDialog';
import showSuccessDialog from '_component/ActionDialog/successDialog';
import ClientWrapper from '_src/wrapper/ClientWrapper';
import util from '_src/utils/util';
import { isNumberString, isFunction } from '_src/utils/type';

const showError = () => {
  Message.error({
    content: '服务端异常，请稍后重试'
  });
};

@ClientWrapper
class MintDialog extends Component {
  constructor() {
    super();
    this.state = {
      value: '',
    };
  }

  onChange = (e) => {
    this.setState({ value: e.target.value });
  }

  onClose = () => {
    this.props.onClose();
    this.setState({
      value: ''
    });
  }

  onMint = () => {
    const {
      okchainClient, token, beforeMint, afterMint
    } = this.props;
    isFunction(beforeMint) && beforeMint();
    const { value } = this.state;
    const amount = util.precisionInput(value);
    okchainClient.sendTokenMintTransaction(token, amount).then((res) => {
      this.setState({ value: '' });
      isFunction(afterMint) && afterMint();
      const { result, status } = res;
      const { txhash } = result;
      const log = JSON.parse(result.raw_log);
      if (status !== 200 || (log && log.code)) {
        showError();
      } else {
        showSuccessDialog('Mint success！', txhash);
      }
    }).catch((err) => {
      console.log(err);
      isFunction(afterMint) && afterMint();
      showError();
      this.setState({ value: '' });
    });
  }

  onPwdSuccess = () => {
    this.onMint();
  }

  handleMint = () => {
    const { value } = this.state;
    if (isNumberString(value)) {
      this.props.onClose();
      this.props.checkPK(this.onMint);
    } else {
      Message.error({
        content: '输入类型错误，请重新输入'
      });
    }
  }

  render() {
    const { visible } = this.props;
    const { value } = this.state;

    return (
      <Fragment>
        <SingleInputDialog
          value={value}
          onChange={this.onChange}
          title="Mint"
          visible={visible}
          onClose={this.onClose}
          onConfirm={this.handleMint}
        />
      </Fragment>
    );
  }
}

export default MintDialog;
