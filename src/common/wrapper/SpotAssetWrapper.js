import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SpotTradeActions from '../redux/actions/SpotTradeAction';
import FormatAsset from '../utils/FormatAsset';
import navigation from '../utils/navigation';

function mapStateToProps(state) {
  const { product, spotAsset } = state.SpotTrade;
  return {
    product,
    spotAsset,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SpotTradeActions, dispatch),
  };
}

const SpotAssetWrapper = (SpotAssetComponent) => {
  @connect(mapStateToProps, mapDispatchToProps)
  class SpotAsset extends React.Component {
    onTransfer = (currencyName) => {
      const { actions } = this.props;
      return (e) => {
        e.preventDefault();
        if (this.checkLogin()) {
          actions.updateTransfer({
            currencyName,
            isShowTransfer: true,
          });
        }
      };
    };

    checkLogin = () => {
      const { isLogin } = window.OK_GLOBAL;
      if (!isLogin) {
        navigation.login();
        return false;
      }
      return true;
    };

    render() {
      const { isLogin } = window.OK_GLOBAL;
      const { spotAsset, product } = this.props;
      let spotDataSource;
      if (isLogin && spotAsset && spotAsset.length === 2) {
        spotDataSource = spotAsset;
      } else {
        spotDataSource = FormatAsset.getSpotDataNotLogin(product);
      }
      return (
        <SpotAssetComponent
          dataSource={spotDataSource}
          onTransfer={this.onTransfer}
        />
      );
    }
  }
  return SpotAsset;
};
export default SpotAssetWrapper;
