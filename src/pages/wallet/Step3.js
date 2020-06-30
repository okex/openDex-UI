import React, { Component } from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Button } from '_component/Button';
import WalletLeft from '_component/WalletLeft';
import WalletRight from '_component/WalletRight';
import * as walletActions from '_src/redux/actions/WalletAction';
import questionGenerator from './questionGenerator';
import './Step.less';
import './Step3.less';
import { toLocale } from '_src/locale/react-locale';

function mapStateToProps(state) {
  const { mnemonic } = state.WalletStore;
  return { mnemonic };
}

function mapDispatchToProps(dispatch) {
  return {
    walletAction: bindActionCreators(walletActions, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
class Step3 extends Component {
  constructor(props) {
    super(props);
    this.questions = questionGenerator.getQuestions(props.mnemonic.split(' '));
    this.state = {
      selectArr: []
    };
  }
  selectOption = (questionNo, selectedIndex) => {
    return () => {
      const { selectArr } = this.state;
      const selectArrTemp = [...selectArr];
      selectArrTemp[questionNo] = selectedIndex;
      this.setState({
        selectArr: selectArrTemp
      });
    };
  }
  // 返回上一步
  handlePrevStep = () => {
    const { walletAction } = this.props;
    walletAction.updateIsPass(true);
    walletAction.updateCreateStep(2);
  }
  // 点击确定
  handleEnsure = () => {
    const { selectArr } = this.state;
    const { questions } = this;
    const { walletAction } = this.props;
    const isPass = questions.every((item, index) => {
      return item.answer === selectArr[index];
    });
    if (!isPass) {
      walletAction.updateIsPass(false);
      walletAction.updateCreateStep(2);
    } else {
      walletAction.updateCreateStep(4);
    }
  }
  renderQuestion = (question, selectedOption) => {
    const { no, title } = question;
    return (
      <div className="question-item" key={`question${no}`}>
        <div className="question-title">
          {no + 1})
          {toLocale('wallet_choiceMnemonicPre')}
          <span style={{ color: '#3075EE', margin: '0 3px' }}>
            {title}
          </span>
          {toLocale('wallet_choiceMnemonicSuf')}
        </div>
        <div className="options-container">
          {
            question.options.map((optionItem, optionIndex) => {
              const isActive = selectedOption === optionIndex;
              const clsName = `option-item ${isActive ? 'active' : ''}`;
              return (
                <div
                  className={clsName}
                  key={`question${no}-option${optionIndex}`}
                  onClick={this.selectOption(no, optionIndex)}
                >
                  {optionItem}
                </div>
              );
            })
          }
        </div>
      </div>
    );
  }

  render() {
    const { selectArr } = this.state;
    return (
      <div>
        <div className="create-wallet-step3 wallet-step-dialog">
          <WalletLeft
            stepNo={3}
            stepName={toLocale('wallet_create_step3')}
            imgUrl="https://static.bafang.com/cdn/assets/imgs/MjAxOTQ/355F3AD5BD296D7EEA40263B0F98E4F3.png"
          />
          <WalletRight>
            <div className="questions-container">
              {
                this.questions.map((questionItem, questionIndex) => {
                  return this.renderQuestion(questionItem, selectArr[questionIndex]);
                })
              }
            </div>
            <div className="next-row">
              <Button type="primary" className="prev-btn" onClick={this.handlePrevStep}>
                {toLocale('prev_step')}
              </Button>
              <Button type="primary" onClick={this.handleEnsure}>
                {toLocale('wallet_confirm')}
              </Button>
            </div>
          </WalletRight>
        </div>
      </div>
    );
  }
}

export default Step3;
