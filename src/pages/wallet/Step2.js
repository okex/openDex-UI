import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { toLocale } from '_src/locale/react-locale';
import { Button } from '_component/Button';
import WalletLeft from '_component/WalletLeft';
import WalletRight from '_component/WalletRight';
import * as walletActions from '_src/redux/actions/WalletAction';
import SafeTip from './SafeTip';
import './Step.less';
import './Step2.less';

function mapStateToProps(state) {
  const { isPass, isShowSafeTip, mnemonic } = state.WalletStore;
  return { isPass, isShowSafeTip, mnemonic };
}

function mapDispatchToProps(dispatch) {
  return {
    walletAction: bindActionCreators(walletActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Step2 extends Component {
  onNext = () => {
    this.props.walletAction.updateCreateStep(3);
  }
  handleSafeTipEnsure = () => {
    this.props.walletAction.updateIsShowSafeTip(false);
  }
  render() {
    const { isPass, isShowSafeTip, mnemonic } = this.props;
    return (
      <div>
        <div className="create-wallet-step2 wallet-step-dialog">
          <WalletLeft
            stepNo={2}
            stepName={toLocale('wallet_create_step2')}
            imgUrl="https://static.bafang.com/cdn/assets/imgs/MjAxOTQ/985BA29EFF0DE4AE191822AEDC867924.png"
          />
          <WalletRight>
            <div className="mnemonic-container">
              <div className="mnemonic-title">
                {toLocale('wallet_create_backupMnemonic')}
              </div>
              <div className="mnemonic-content">
                {
                  mnemonic.split(' ').map((item, index) => {
                    return (
                      <div className="mnemonic-item" key={item}>
                        <span className="mnemonic-item-no">{index + 1}</span>
                        <span className="mnemonic-item-word">{item}</span>
                      </div>
                    );
                  })
                }
              </div>
              {
                !isPass &&
                <span className="error-tip">
                  {toLocale('wallet_create_backupMnemonic_error')}
                </span>
              }
            </div>
            <div className="next-row">
              <Button type="primary" onClick={this.onNext}>
                {toLocale('wallet_create_beginValidate')}
              </Button>
            </div>
          </WalletRight>
        </div>

        <SafeTip
          visible={isShowSafeTip}
          onEnsure={this.handleSafeTipEnsure}
        />
      </div>
    );
  }
}

export default Step2;
