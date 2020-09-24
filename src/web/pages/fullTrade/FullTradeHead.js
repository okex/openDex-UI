import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DesktopLinkMenu from '_component/DesktopLinkMenu';
import okexchainLogo from '_src/assets/images/OKExChain.png';
import * as CommonAction from '_src/redux/actions/CommonAction';
import PageURL from '_src/constants/PageURL';
import FullTradeTicker from '_src/pages/fullTrade/FullTradeTicker';
import FullTradeProductList from './FullTradeProductList';
import './FullTradeHead.less';
import { toLocale } from '_src/locale/react-locale';
import ComboBox from '_component/ComboBox/ComboBox';
import util from '_src/utils/util';
import { LoggedMenu, LoginMenu } from '_src/component/DexMenu';

function mapStateToProps(state) {
  const { product } = state.SpotTrade;
  return {
    product,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class FullTradeHead extends React.Component {
  constructor(props) {
    super(props);
    this.iconStyle = {
      width: '100%',
      marginTop: 15,
    };
    this.headTypeOKEx = [
      {
        url: '/derivatives/futures/full', type: '/derivatives/futures/full', label: toLocale('spot.asset.futureTrade'), monitor: 'full_header,nav_future,nav_enter_future'
      },
      {
        url: '/derivatives/swap/full', type: '/derivatives/swap/full', label: toLocale('spot.asset.futureswapTrade'), monitor: 'full_header,nav_swap,nav_enter_swap'
      },
      {
        url: '/spot/full', type: '/spot/full', label: toLocale('spot.asset.spotTrade'), monitor: 'full_header,nav_spot,nav_enter_spot'
      },
      {
        url: '/spot/fullMargin', type: '/spot/fullMargin', label: toLocale('spot.asset.newMarginTrade'), monitor: 'full_header,nav_margin,nav_enter_margin'
      },
      {
        url: `${PageURL.homePage}/spot/trade`, type: '/dex-test/spot/trade', label: toLocale('spot.asset.dexTest'), monitor: 'full_header,nav_dex,nav_enter_dex'
      }
    ];
  }
  componentWillMount() {}
  componentDidMount() {
    this.props.commonAction.initOKExChainClient();
  }
  componentWillReceiveProps(nextProps) {}
  isTradePage() {
    return this.props.location.pathname.indexOf(PageURL.spotFullPage) >= 0;
  }
  goHome = () => {
    const url = window.location.href.split('#')[0];
    if (/^file/i.test(url)) {
      window.location.href = `${url}#${PageURL.spotFullPage}`;
    } else {
      window.location.href = PageURL.spotFullPage;
    }
  };

  render() {
    const headTypeList = this.headTypeOKEx;
    return (
      <div className="full-top-info-box">
        <a className="logo-wrap" onClick={this.goHome}>
          <img src={okexchainLogo} style={this.iconStyle} />
        </a>
        <div className="top-info-title">
          <div className="current-trade-title">
            {toLocale('spot.asset.dexTest')}
            <a className={`down-arrow${headTypeList.length > 1 ? ' has-more' : ''}`} style={{ display: 'inline-block' }} />
            <div className="combo-box">
              <ComboBox
                current={this.props.location.pathname}
                comboBoxDataSource={headTypeList.length > 1 ? headTypeList : []}
              />
            </div>
          </div>
        </div> 
        {this.isTradePage() ? <FullTradeProductList /> : null}
        {this.isTradePage() ? <FullTradeTicker /> : null}

        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu /> : <LoginMenu />}
          <DesktopLinkMenu />
        </div>
      </div>
    );
  }
}
export default FullTradeHead;
