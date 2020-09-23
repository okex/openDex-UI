import React from 'react';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DesktopNodeMenu from '_component/DesktopNodeMenu';
import DesktopLinkMenu from '_component/DesktopLinkMenu';
import okexchainLogo from '_src/assets/images/OKExChain.png';
import * as CommonAction from '../../redux/actions/CommonAction';
import PageURL from '../../constants/PageURL';
import FullTradeTicker from './FullTradeTicker';
import FullTradeProductList from './FullTradeProductList';
import './FullTradeHead.less';
import util from '../../utils/util';
import { LoggedMenu, LoginMenu } from '../../component/DexMenu';

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
    return (
      <div className="full-top-info-box">
        <a className="logo-wrap" onClick={this.goHome}>
          <img src={okexchainLogo} style={this.iconStyle} />
        </a>
        <DesktopNodeMenu />
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
