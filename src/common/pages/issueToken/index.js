import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import DexDesktopInput from '_component/DexDesktopInput';
import DexDesktopCheckbox from '_component/DexDesktopCheckbox';
import { toLocale } from '_src/locale/react-locale';
import { Dialog } from '_component/Dialog';
import Message from '_src/component/Message';
import ClientWrapper from '_src/wrapper/ClientWrapper';
import util from '_src/utils/util';
import { validateTxs } from '_src/utils/client';
import Config from '_constants/Config';
import './index.less';

const showError = (content = toLocale('sysError')) => {
  Message.error({
    content,
  });
};

@ClientWrapper
class IssueToken extends Component {
  constructor() {
    super();
    this.state = {
      symbol: '',
      wholename: '',
      totalSupply: '',
      mintable: 0,
      desc: '',
      isActionLoading: false,
    };
  }

  onSymbolChange = (e) => {
    this.setState({
      symbol: e.target.value,
    });
  };

  onWholenameChange = (e) => {
    this.setState({
      wholename: e.target.value,
    });
  };

  onTotalSupplyChange = (e) => {
    this.setState({
      totalSupply: e.target.value,
    });
  };

  onMintableChange = (e) => {
    this.setState({
      mintable: e.target.checked ? 1 : 0,
    });
  };

  onDescChange = (e) => {
    this.setState({
      desc: e.target.value,
    });
  };

  onIssue = () => {
    this.setState({ isActionLoading: true });
    const { symbol, wholename, totalSupply, mintable, desc } = this.state;
    const { okexchainClient } = this.props;
    const fSymbol = symbol.toLowerCase();
    const fTotal = util.precisionInput(totalSupply).replace(/,/g,'');
    const fMintable = mintable === 1;
    okexchainClient
      .sendTokenIssueTransaction(fSymbol, wholename, fTotal, fMintable, desc)
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
            confirmText: 'Get Detail',
            theme: 'dark',
            title: 'Issue success！',
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
        console.log(err);
        this.setState({ isActionLoading: false });
        showError(err.message || toLocale('sysError'));
      });
  };

  onPwdSuccess = () => {
    this.onIssue();
  };

  handleIssue = () => {
    this.props.checkPK(this.onIssue);
  };

  render() {
    const {
      symbol,
      wholename,
      totalSupply,
      desc,
      mintable,
      isActionLoading,
    } = this.state;
    return (
      <DexDesktopContainer
        isShowHelp
        isShowAddress
        needLogin
        loading={isActionLoading}
      >
        <div className="issue-token-container">
          <DexDesktopInput
            label={toLocale('issueToken.symbol.label')}
            value={symbol}
            onChange={this.onSymbolChange}
            hint={toLocale('issueToken.symbol.hint')}
          />
          <DexDesktopInput
            label={toLocale('issueToken.wholename.label')}
            value={wholename}
            onChange={this.onWholenameChange}
          />
          <DexDesktopInput
            label={toLocale('issueToken.totalSupply.label')}
            value={totalSupply}
            onChange={this.onTotalSupplyChange}
          />
          <DexDesktopCheckbox
            label={toLocale('issueToken.mintable.label')}
            checked={mintable === 1}
            onChange={this.onMintableChange}
          />
          <DexDesktopInput
            label={toLocale('issueToken.desc.label')}
            value={desc}
            onChange={this.onDescChange}
            multiple
          />
          <button
            className="dex-desktop-btn issue-token-btn"
            onClick={this.handleIssue}
          >
            {toLocale('issueToken.issue.btn')}
          </button>
        </div>
      </DexDesktopContainer>
    );
  }
}

export default IssueToken;
