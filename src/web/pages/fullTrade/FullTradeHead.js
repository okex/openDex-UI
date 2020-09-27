import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import * as SpotActions from '_src/redux/actions/SpotAction';
import * as CommonAction from '_src/redux/actions/CommonAction';
import DesktopLinkMenu from '_component/DesktopLinkMenu';
import okexchainLogo from '_src/assets/images/OKExChainLogo.png';
import PageURL from '_src/constants/PageURL';
import FullTradeTicker from '_src/pages/fullTrade/FullTradeTicker';
import FullTradeProductList from './FullTradeProductList';
import './FullTradeHead.less';
import ComboBox from '_src/component/ComboBox/ComboBox';
import util from '_src/utils/util';
import { LoggedMenu, LoginMenu,DocMenu } from '_src/component/DexMenu';


function mapStateToProps(state) {
  const {
    product, productObj, callMarketObj, spotOrMargin
  } = state.SpotTrade;
  const {
    legalList, legalId, legalObj
  } = state.Common;
  return {
    product,
    callMarketObj,
    productObj,
    legalList,
    legalId,
    legalObj,
    spotOrMargin,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
    spotActions: bindActionCreators(SpotActions, dispatch),
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
    this.currentHead = this.headTypeOKEx[4].url;
  }
  
  componentDidMount() {
    const { commonAction } = this.props;
    commonAction.fetchLegalList();
    commonAction.fetchChargeUnit();
    commonAction.initOKExChainClient();
  }
  componentWillReceiveProps(nextProps) {
    const {
      legalList, legalId
    } = nextProps;
    const {
      legalList: oldCurrencyList, legalId: oldCurrencyId
    } = this.props;
    if (legalId !== oldCurrencyId || legalList.length !== oldCurrencyList.length) {
      this.resetCurrencyObj(legalList, legalId);
    }
  }
  resetCurrencyObj(legalList, legalId) {
    if (legalList.length && legalId >= 0) {
      const legalObj = legalList.find((curr) => {
        return legalId === curr.legalId;
      });
      if (legalObj) {
        this.props.commonAction.setChargeUnitObj(legalObj);
      }
    }
  }

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
  }

  render() {
    const {
      productObj, product, callMarketObj
    } = this.props;
    const tradingMode = productObj[product] ? Number(productObj[product].tradingMode) : 0;
    if (tradingMode > 0 && tradingMode < 3) {
      if (callMarketObj[product] && callMarketObj[product].nowDate >= callMarketObj[product].startTime) {
        callMarketName = toLocale('spot.callmarket.title.all.withStep', { step: tradingMode });
      } else {
        callMarketName = toLocale('spot.callmarket.startingsoon');
      }
    }
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
                current={this.currentHead}
                comboBoxDataSource={headTypeList.length > 1 ? headTypeList : []}
              />
            </div>
          </div>
        </div>
        {this.isTradePage() ? <FullTradeProductList /> : null}
        {this.isTradePage() ? <FullTradeTicker /> : null}
        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu/> : <LoginMenu/>}
          <DocMenu/>
          <DesktopLinkMenu hasVersion={false}/>
        </div>
      </div>
    );
  }
}
export default FullTradeHead;
