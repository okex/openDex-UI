import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import LanguageSwitch from '_component/LanguageSwitch';
import Icon from '_src/component/IconLite';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Cookies from 'js-cookie';
import CurrencySelector from '../CurrencySelector';
import * as CommonAction from '../../redux/actions/CommonAction';
import { LoggedMenu, LoginMenu } from '../DexMenu';
import util from '../../utils/util';

import './index.less';
import PageURL from '../../constants/PageURL';

function mapStateToProps(state) { // 绑定redux中相关state
  const {
    privateKey
  } = state.Common;
  return {
    privateKey
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch)
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DexHeader extends React.Component {
  componentWillMount() {
  }
  componentDidMount() {
    // 初始化okchain客户端
    this.props.commonAction.initOKChainClient();
  }

  componentWillReceiveProps(nextProps) {
  }
  onLanguageSelect(item) {
    Cookies.set('locale', item.rel);
    window.location.reload();
  }
  render() {
    const lang = util.getSupportLocale(Cookies.get('locale') || 'en_US');
    return (
      <header className="okdex-header">
        <input style={{ display: 'none' }} type="password" />
        <Link to={PageURL.homePage} className="logo-wrap">
          <Icon className="icon-dex-logo-new" isColor style={{ width: '103px', height: '45px' }} />
        </Link>
        <div className="okdex-header-right">
          {util.isLogined() ? <LoggedMenu /> : <LoginMenu />}
          <LanguageSwitch
            titleMode="icon"
            direction="bottomRight"
            isShowArrow={false}
            defaultValue={lang}
            overlayClassName="okdex-language-popup"
            dropDownMatchSelectWidth={false}
            onSelect={this.onLanguageSelect}
          />
          <div className="line-divider" />
        </div>
      </header>
    );
  }
}
export default DexHeader;
