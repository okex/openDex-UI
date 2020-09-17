import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from '_component/IconLite';
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

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    product
  } = state.SpotTrade;
  return {
    product
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
  componentWillMount() {
  }
  // 获取法币计价货币列表及配置
  componentDidMount() {
    // 初始化okexchain客户端。原因是交易页、未成交委托页撤单和资产页转账都需要
    this.props.commonAction.initOKExChainClient();
  }
  componentWillReceiveProps(nextProps) {
  }
  isTradePage() {
    return this.props.location.pathname.indexOf(PageURL.spotFullPage) >= 0;
  }
  goHome = () => {
    window.location.href = PageURL.spotFullPage;
  }

  render() {
    return (
      <div className="full-top-info-box">
        <a className="logo-wrap" onClick={this.goHome}>
          <img
            src={okexchainLogo}
            style={this.iconStyle}
          />
        </a>
        <DesktopNodeMenu />
        {
          this.isTradePage() ? <FullTradeProductList /> : null
        }
        {
          this.isTradePage() ? <FullTradeTicker /> : null
        }

        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu /> : <LoginMenu />}
          <DesktopLinkMenu />
        </div>
      </div>
    );
  }
}
export default FullTradeHead;
