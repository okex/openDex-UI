import React, { Component } from 'react';
import { connect } from 'react-redux';
import WalletContainer from './WalletContainer';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import './CreateWallet.less';

function mapStateToProps(state) {
  const { step } = state.WalletStore;
  return { step };
}

function mapDispatchToProps() {
  return {};
}

@connect(mapStateToProps, mapDispatchToProps)
class CreateWallet extends Component {
  renderByStep = (step) => {
    let component = <Step1 />;
    switch (step) {
      case 1:
        component = <Step1 />;
        break;
      case 2:
        component = <Step2 />;
        break;
      case 3:
        component = <Step3 />;
        break;
      case 4:
        component = <Step4 />;
        break;
      default:
        component = <Step1 />;
        break;
    }
    return component;
  }
  render() {
    const { step } = this.props;
    return (
      <WalletContainer>
        <div className="wallet-create-container">
          {this.renderByStep(step)}
        </div>
      </WalletContainer>
    );
  }
}

export default CreateWallet;
