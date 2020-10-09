import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import * as SpotActions from '_src/redux/actions/SpotAction';
import * as CommonAction from '_src/redux/actions/CommonAction';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import DesktopLinkMenu from '_component/DesktopLinkMenu'
import okexchainLogo from '_src/assets/images/OKExChainLogo.png';
import PageURL from '_src/constants/PageURL';
import FullTradeTicker from '_src/pages/fullTrade/FullTradeTicker';
import FullTradeProductList from './FullTradeProductList';
import './FullTradeHead.less';
import util from '_src/utils/util';
import { LoggedMenu, LoginMenu, DocMenu,SwapSetting } from '_src/component/DexMenu';

function mapStateToProps(state) {
  const { product, productObj, callMarketObj, spotOrMargin } = state.SpotTrade;
  const { legalList, legalId, legalObj } = state.Common;
  const { hasSetting } = state.SwapStore;
  return {
    product,
    callMarketObj,
    productObj,
    legalList,
    legalId,
    legalObj,
    spotOrMargin,
    hasSetting
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
  }

  componentDidMount() {
    const { commonAction } = this.props;
    commonAction.fetchLegalList();
    commonAction.fetchChargeUnit();
    commonAction.initOKExChainClient();
  }
  componentWillReceiveProps(nextProps) {
    const { legalList, legalId } = nextProps;
    const { legalList: oldCurrencyList, legalId: oldCurrencyId } = this.props;
    if (
      legalId !== oldCurrencyId ||
      legalList.length !== oldCurrencyList.length
    ) {
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
  };

  render() {
    const { productObj, product, callMarketObj,hasSetting } = this.props;
    const current = PageURL.getCurrent();
    const tradingMode = productObj[product]
      ? Number(productObj[product].tradingMode)
      : 0;
    if (tradingMode > 0 && tradingMode < 3) {
      if (
        callMarketObj[product] &&
        callMarketObj[product].nowDate >= callMarketObj[product].startTime
      ) {
        callMarketName = toLocale('spot.callmarket.title.all.withStep', {
          step: tradingMode,
        });
      } else {
        callMarketName = toLocale('spot.callmarket.startingsoon');
      }
    }
    return (
      <div className="full-top-info-box">
        <a className="logo-wrap" onClick={this.goHome}>
          <img src={okexchainLogo} style={this.iconStyle} />
        </a>
        <DesktopTypeMenu current={current}/>
        {this.isTradePage() ? <FullTradeProductList /> : null}
        {this.isTradePage() ? <FullTradeTicker /> : null}
        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu /> : <LoginMenu />}
          {hasSetting && <SwapSetting />}
          <DocMenu />
          <DesktopLinkMenu hasVersion={false} />
        </div>
      </div>
    );
  }
}
export default FullTradeHead;
