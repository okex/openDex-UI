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
class AddDepositsDialog extends Component {
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

  onAdd = () => {
    const { okexchainClient, project, beforeAdd, afterAdd } = this.props;
    isFunction(beforeAdd) && beforeAdd();
    const { value } = this.state;
    const amount = util.precisionInput(value).replace(/,/g,'');
    okexchainClient
      .sendAddProductDepositTransaction(amount, project)
      .then((res) => {
        this.setState({ value: '' });
        isFunction(afterAdd) && afterAdd();
        const { result } = res;
        const { data } = result;
        if (!validateTxs(res)) {
          showError(
            toLocale(`error.code.${res.result.code}`) || res.result.msg
          );
        } else {
          showSuccessDialog('Add deposits success！', data);
        }
      })
      .catch((err) => {
        isFunction(afterAdd) && afterAdd();
        showError(err.message || toLocale('sysError'));
        this.setState({ value: '' });
      });
  };

  onPwdSuccess = () => {
    this.onAdd();
  };

  handleAdd = () => {
    const { value } = this.state;
    if (isNumberString(value)) {
      this.props.onClose();
      this.props.checkPK(this.onAdd);
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
          title="Add deposits"
          visible={visible}
          onClose={this.onClose}
          onConfirm={this.handleAdd}
        />
      </Fragment>
    );
  }
}

export default AddDepositsDialog;
