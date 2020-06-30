import React from 'react';
import { DialogTwoBtn } from '_component/Dialog';
import { toLocale } from '_src/locale/react-locale';


import './index.less';

export default class CurrencySelector extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangeDialog: false,
      activeId: -1,
    };
  }
  componentDidMount() {
    this.setActiveId(this.props.legalId);
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.legalId !== this.props.legalId) {
      this.setActiveId(nextProps.legalId);
    }
  }
  onChangeCurrency = () => {
    const { onChangeCurrency } = this.props;
    onChangeCurrency && onChangeCurrency(this.state.activeId);
    this.onClose();
  };
  onClose = () => {
    this.setState({
      showChangeDialog: false
    });
    this.setActiveId(this.props.legalId);
  };
  onClickCurrency = (e) => {
    e.preventDefault();
    const { legalObj } = this.props;
    if (legalObj.isoCode) {
      this.setState({
        showChangeDialog: true
      });
    }
  };
  setActiveId = (activeId) => {
    this.setState({
      activeId
    });
  };
  getContent = () => {
    const { activeId } = this.state;
    const { legalList } = this.props;
    return (
      <div>
        <div className="selector-content">
          <h2>{toLocale('spot.ticker.legal.unit')}</h2>
          <div className={`selector-list ${legalList.length < 5 ? 'lt5' : ''}`}>
            {
              legalList && legalList.map(({ legalId, isoCode }) => {
                return (
                  <label
                    key={legalId}
                    className={activeId === legalId ? 'active' : ''}
                    onClick={() => { this.setActiveId(legalId); }}
                  >
                    {isoCode}
                  </label>
                );
              })
            }
          </div>
        </div>
      </div>
    );
  };
  render() {
    const { showChangeDialog } = this.state;
    const { legalObj } = this.props;
    return (
      <div className="currency-selector-container">
        {toLocale('spot.ticker.legal.unit')}<a onClick={this.onClickCurrency}>{legalObj.isoCode || '--'}</a>
        <DialogTwoBtn
          theme="dark"
          title={toLocale('settings')}
          openWhen={showChangeDialog}
          onClose={this.onClose}
          onCancel={this.onClose}
          onConfirm={this.onChangeCurrency}
          cancelText={toLocale('cancel')}
          confirmText={toLocale('OK')}
        >
          {this.getContent()}
        </DialogTwoBtn>
      </div>
    );
  }
}
