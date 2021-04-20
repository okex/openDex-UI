import React from 'react';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import DesktopLinkMenu from '_component/DesktopLinkMenu';
import DesktopNetMenu from '_component/DesktopNetMenu';
import Config from '_src/constants/Config';
import PageURL from '_src/constants/PageURL';
import FullTradeTicker from '_src/pages/fullTrade/FullTradeTicker';
import util from '_src/utils/util';
import SwapSetting from '_src/pages/swap/SwapSetting';
import * as SpotActions from '_src/redux/actions/SpotAction';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { toLocale } from '_src/locale/react-locale';
import { LoggedMenu, LoginMenu, DocMenu } from '_src/component/DexMenu';
import FullTradeProductList from './FullTradeProductList';
import './FullTradeHead.less';

function mapStateToProps(state) {
  const { product, productObj, callMarketObj, spotOrMargin } = state.SpotTrade;
  const { legalList, legalId, legalObj } = state.Common;
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
  componentDidMount() {
    const { commonAction } = this.props;
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
      const legalObj = legalList.find((curr) => legalId === curr.legalId);
      if (legalObj) {
        this.props.commonAction.setChargeUnitObj(legalObj);
      }
    }
  }

  isTradePage() {
    return this.props.location.pathname.indexOf(PageURL.spotFullPage) >= 0;
  }

  isSwapMenu() {
    const current = DesktopTypeMenu.current
      ? DesktopTypeMenu.current.url
      : null;
    return current === PageURL.swapPage;
  }

  isFarmMenu() {
    const current = DesktopTypeMenu.current
      ? DesktopTypeMenu.current.url
      : null;
    return current === PageURL.farmPage;
  }

  render() {
    const { productObj, product, callMarketObj } = this.props;
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
        <a className="logo-wrap" href="/">
          <img src={Config.okexLogo} />
        </a>
        <DesktopNetMenu />
        <DesktopTypeMenu current={current} />
        {this.isTradePage() ? <FullTradeProductList /> : null}
        {this.isTradePage() ? <FullTradeTicker /> : null}
        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu href /> : <LoginMenu />}
          {this.isSwapMenu() && <SwapSetting />}
          <DocMenu />
          {!this.isSwapMenu() && !this.isFarmMenu() && (
            <DesktopLinkMenu hasVersion={false} />
          )}
        </div>
      </div>
    );
  }
}
export default FullTradeHead;
