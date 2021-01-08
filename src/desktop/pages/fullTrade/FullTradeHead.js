import React from 'react';
import DesktopNodeMenu from '_app/component/DesktopNodeMenu';
import DesktopLinkMenu from '_component/DesktopLinkMenu';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import okexLogo from '_src/assets/images/OKEx.png';
import Config from '_src/constants/Config';
import PageURL from '_src/constants/PageURL';
import FullTradeTicker from '_src/pages/fullTrade/FullTradeTicker';
import FullTradeProductList from './FullTradeProductList';
import util from '_src/utils/util';
import SwapSetting from '_src/pages/swap/SwapSetting';
import * as CommonAction from '_src/redux/actions/CommonAction';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { LoggedMenu, LoginMenu, DocMenu } from '_src/component/DexMenu';
import './FullTradeHead.less';

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
      marginTop: -25,
    };
  }

  componentDidMount() {
    this.props.commonAction.initOKExChainClient();
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

  render() {
    const current = PageURL.getCurrent();
    return (
      <div className="full-top-info-box">
        <a
          className="logo-wrap"
          target="_blank"
          href={Config.okexchain.homeUrl}
        >
          <img src={okexLogo} style={this.iconStyle} />
        </a>
        <DesktopTypeMenu isDexDesk={true} current={current} />
        {this.isTradePage() && <DesktopNodeMenu />}
        {this.isTradePage() && <FullTradeProductList />}
        {this.isTradePage() && <FullTradeTicker />}
        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu /> : <LoginMenu />}
          {this.isSwapMenu() && <SwapSetting />}
          <DocMenu />
          {!this.isSwapMenu() && <DesktopLinkMenu />}
        </div>
      </div>
    );
  }
}
export default FullTradeHead;
