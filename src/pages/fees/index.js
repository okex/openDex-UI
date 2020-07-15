import React, { Component } from 'react';
import DexDesktopContainer from '_component/DexDesktopContainer';
import DexDesktopInput from '_component/DexDesktopInput';
import DexDesktopInputPair from '_component/DexDesktopInputPair';
import ont from '_src/utils/dataProxy';
import URL from '_constants/URL';
import { toLocale } from '_src/locale/react-locale';
import './index.less';

class FeesPage extends Component {
  constructor() {
    super();
    this.state = {
      isActionLoading: false,
      address: '',
      baseAsset: '',
      quoteAsset: '',
    };
  }

  componentDidMount() {
    this.fetchFees();
  }

  onAddressChange = (e) => {
    this.setState({
      address: e.target.value,
    });
  }

  onBaseAssetChange = (e) => {
    this.setState({ baseAsset: e.target.value });
  }

  onQuoteAssetChange = (e) => {
    this.setState({ quoteAsset: e.target.value });
  }

  fetchFees = () => {
    const params = {
      address: window.OK_GLOBAL.senderAddr,
    };
    ont.get(`${URL.GET_FEES}`, { params }).then((res) => {
      console.log(res);
    }).catch((err) => {
      console.log(err);
    });
  }

  render() {
    const {
 isActionLoading, address, baseAsset, quoteAsset 
} = this.state;

    return (
      <DexDesktopContainer
        className="fees-page"
        isShowAddress
        isShowHelp
        needLogin
        loading={isActionLoading}
      >
        <div className="fees-container">
          <DexDesktopInput
            label="HandlingFeeAddress:"
            value={address}
            onChange={this.onAddressChange}
          />
          <DexDesktopInputPair
            label={toLocale('listToken.label')}
            firstValue={baseAsset}
            onFirstChange={this.onBaseAssetChange}
            secondValue={quoteAsset}
            onSecondChange={this.onQuoteAssetChange}
          />
        </div>
      </DexDesktopContainer>
    );
  }
}

export default FeesPage;
