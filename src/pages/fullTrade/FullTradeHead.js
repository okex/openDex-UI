import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Icon from '_component/IconLite';
import DesktopNodeMenu from '_component/DesktopNodeMenu';
import DesktopLinkMenu from '_component/DesktopLinkMenu';
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
      marginTop: -25,
    };
  }
  componentWillMount() {
  }
  // 获取法币计价货币列表及配置
  componentDidMount() {
    // 初始化okchain客户端。原因是交易页、未成交委托页撤单和资产页转账都需要
    this.props.commonAction.initOKChainClient();
  }
  componentWillReceiveProps(nextProps) {
  }
  isTradePage() {
    return this.props.location.pathname.indexOf(PageURL.spotFullPage) >= 0;
  }
  render() {
    return (
      <div className="full-top-info-box">
        <Link className="logo-wrap" to="/">
          <img
            src="https://static.bafang.com/cdn/assets/imgs/MjAxOTQ/CD3CDB1160FD60652744BF54FD77DBF8.png"
            style={this.iconStyle}
          />
        </Link>
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
