import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import DexDesktopContainer from '_component/DexDesktopContainer';
import { toLocale } from '_src/locale/react-locale';
import ClientWrapper from '_src/wrapper/ClientWrapper';
import { Dialog } from '_component/Dialog';
import Message from '_src/component/Message';
import DexDesktopInput from '_component/DexDesktopInput';
import DexDesktopInputPair from '_component/DexDesktopInputPair';
import PageURL from '_constants/PageURL';
import util from '_src/utils/util';
import Config from '_constants/Config';
import { validateTxs } from '_src/utils/client';
import './index.less';

const showError = (content = toLocale('sysError')) => {
  Message.error({
    content,
  });
};

@withRouter
@ClientWrapper
class ListTokenpair extends Component {
  constructor() {
    super();
    this.state = {
      baseAsset: '',
      quoteAsset: '',
      initPrice: '',
      isActionLoading: false,
    };
  }

  onBaseAssetChange = (e) => {
    this.setState({ baseAsset: e.target.value });
  };

  onQuoteAssetChange = (e) => {
    this.setState({ quoteAsset: e.target.value });
  };

  onInitPriceChange = (e) => {
    this.setState({ initPrice: e.target.value });
  };

  onList = () => {
    this.setState({ isActionLoading: true });
    const { baseAsset, quoteAsset, initPrice } = this.state;
    const { okexchainClient } = this.props;
    const fBase = baseAsset.toLowerCase();
    const fQuote = quoteAsset.toLowerCase();
    const fInitPrice = util.precisionInput(initPrice).replace(/,/g,'');;
    okexchainClient
      .sendListTokenPairTransaction(fBase, fQuote, fInitPrice)
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
            title: 'List tokenpair success！',
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
    this.onList();
  };

  handleList = () => {
    this.props.checkPK(this.onList);
  };

  toRegister = () => {
    this.props.history.push(PageURL.registerPage);
  };

  render() {
    const { baseAsset, quoteAsset, initPrice, isActionLoading } = this.state;
    return (
      <DexDesktopContainer
        isShowHelp
        isShowAddress
        needLogin
        loading={isActionLoading}
      >
        <div className="list-tokenpair-container">
          <DexDesktopInputPair
            label={toLocale('listToken.label')}
            firstValue={baseAsset}
            onFirstChange={this.onBaseAssetChange}
            secondValue={quoteAsset}
            onSecondChange={this.onQuoteAssetChange}
          />
          <DexDesktopInput
            label={toLocale('listToken.initPrice.label')}
            value={initPrice}
            onChange={this.onInitPriceChange}
          />
          <button
            className="dex-desktop-btn tokenpair-btn"
            onClick={this.handleList}
          >
            {toLocale('listToken.list.btn')}
          </button>
          <div className="tokenpair-register-hint">
            {toLocale('listToken.hint')}
            <span onClick={this.toRegister}>
              {toLocale('listToken.hint.register')}
            </span>
          </div>
        </div>
      </DexDesktopContainer>
    );
  }
}

export default ListTokenpair;
