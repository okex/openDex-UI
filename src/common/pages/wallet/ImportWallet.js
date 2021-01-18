import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import WalletContainer from './WalletContainer';
import ImportByKeystore from './ImportByKeystore';
import ImportByMnemonic from './ImportByMnemonic';
import ImportByPrivate from './ImportByPrivate';
import ImportByWalletConnect from './ImportByWalletConnect';
import env from '../../constants/env';
import './ImportWallet.less';

const typeEnmu = {
  keystore: 'keystore',
  mnemonic: 'mnemonic',
  private: 'private',
  walletconnect: 'walletconnect',
};
class ImportWallet extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imporyType: typeEnmu.keystore,
    };
  }
  activeTab = (imporyType) => {
    return () => {
      this.setState({
        imporyType,
      });
    };
  };
  renderByType = (type) => {
    let component = <ImportByKeystore />;
    switch (type) {
      case typeEnmu.keystore:
        component = <ImportByKeystore />;
        break;
      case typeEnmu.mnemonic:
        component = <ImportByMnemonic />;
        break;
      case typeEnmu.private:
        component = <ImportByPrivate />;
        break;
      case typeEnmu.walletconnect:
          component = <ImportByWalletConnect />;
          break;
      default:
        component = <ImportByKeystore />;
        break;
    }
    return component;
  };
  render() {
    const { imporyType } = this.state;
    return (
      <WalletContainer>
        <div className="wallet-import-container">
          <div className="wallet-import-title">{toLocale('wallet_import')}</div>
          <div className="wallet-import-tab">
            <div
              className={`${imporyType === typeEnmu.keystore && 'active'}`}
              onClick={this.activeTab(typeEnmu.keystore)}
            >
              Keystore
            </div>
            <div
              className={`${imporyType === typeEnmu.mnemonic && 'active'}`}
              onClick={this.activeTab(typeEnmu.mnemonic)}
            >
              {toLocale('wallet_import_mnemonic')}
            </div>
            <div
              className={`${imporyType === typeEnmu.private && 'active'}`}
              onClick={this.activeTab(typeEnmu.private)}
            >
              {toLocale('wallet_privateKey')}
            </div>
            {!env.envConfig.isTest && 
            <div
              className={`${imporyType === typeEnmu.walletconnect && 'active'}`}
              onClick={this.activeTab(typeEnmu.walletconnect)}
            >
              {toLocale('wallet_connect')}
            </div>
            }
          </div>
          {this.renderByType(imporyType)}
        </div>
      </WalletContainer>
    );
  }
}

export default ImportWallet;
