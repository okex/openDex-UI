import React from 'react';
import { connect } from 'react-redux';
import Enum from '_src/utils/Enum';
import util from '_src/utils/util';
import FullTradeHead from './FullTradeHead';
import FullTradeData from '_src/pages/fullTrade/FullTradeData';
import SpotAsset from '_src/pages/trade/SpotAsset';
import SpotOrder from '_src/pages/trade/SpotOrder';
import FullTradeKLine from './FullTradeKLine';
import FullDepth from '_src/pages/fullTrade/FullDepth';
import SpotPlaceOrder from '_src/pages/trade/SpotPlaceOrder';
import FullTradeDeals from '_src/pages/fullTrade/FullTradeDeals';
import './FullTrade.less';
import { bindActionCreators } from 'redux';
import * as CommonAction from '_src/redux/actions/CommonAction';

function mapStateToProps(state) {
  const { product, productObj } = state.SpotTrade;
  const { privateKey } = state.Common;
  return { product, productObj, privateKey };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@connect(mapStateToProps, mapDispatchToProps)
export default class FullTradeFrame extends React.Component {
  constructor(props) {
    super(props);
    window.OK_GLOBAL.tradeType = Enum.tradeType.fullTrade;
    window.OK_GLOBAL.isMarginType = false;
    window.addEventListener('resize', this.onResize);
  }

  componentWillMount() {
    if (document.querySelector('#headerContainer')) {
      document.querySelector('#headerContainer').style.display = 'none';
    }
    if (document.querySelector('#footerContainer')) {
      document.querySelector('#footerContainer').style.display = 'none';
    }
  }

  componentWillUnmount() {
    if (document.querySelector("#headerContainer")) {
      document.querySelector("#headerContainer").style.display = 'block';
    }
    if (document.querySelector("#footerContainer")) {
      document.querySelector("#footerContainer").style.display = 'block';
    }
    window.removeEventListener('resize', this.onResize);
  }

  onResize = util.debounce(() => {
    if (window.innerWidth >= 1280) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflowX = 'scroll';
    }
    if (window.innerHeight >= 600) {
      document.body.style.overflowY = 'hidden';
    } else {
      document.body.style.overflowY = 'scroll';
    }
  });

  goHome = () => {
    const url = window.location.href.split('#')[0];
    if (/^file/i.test(url)) {
      window.location.href = `${url}#${PageURL.spotFullPage}`;
    } else {
      window.location.href = PageURL.spotFullPage;
    }
  };

  render() {
    return (
      <div className="full-wrap">
        <div className="full-head">
          <FullTradeHead />
        </div>
        <div className="trade-container">
          <div className="full-left">
            <div className="full-left-top">
              <div className="full-left-top-right">
                <div className="full-ticker-kline">
                  <FullTradeKLine />
                </div>
              </div>
            </div>
            <div className="full-left-bottom">
              <SpotAsset />
              <SpotOrder />
            </div>
          </div>
          <div className="full-right">
            <div className="full-right-left">
              <FullDepth />
              <SpotPlaceOrder />
            </div>
            <div className="full-right-right">
              <FullTradeDeals />
            </div>
          </div>
        </div>
        <FullTradeData />
      </div>
    );
  }
}
