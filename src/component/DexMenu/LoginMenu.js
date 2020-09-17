import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import Menu from '_src/component/Menu';
import { withRouter, Link } from 'react-router-dom';
import { toLocale } from '_src/locale/react-locale';
import Icon from '_src/component/IconLite';
import { getLangURL } from '_src/utils/navigation';
import PageURL from '_constants/PageURL';
import Config from '_constants/Config';
import * as walletActions from '_src/redux/actions/WalletAction';

import './index.less';


const SubMenu = Menu.SubMenu;
// 菜单
const IconFountUnfold = () => { return <Icon className="icon-Unfold" style={{ fontSize: '14px', marginLeft: '6px' }} />; };

function mapStateToProps(state) { // 绑定redux中相关state
  const { WalletStore } = state;
  // step 创建钱包状态
  return {
    WalletStore
  };
}

function mapDispatchToProps(dispatch) {
  return {
    walletAction: bindActionCreators(walletActions, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DexLoginMenu extends React.Component {
  handleCreateWallet=() => {
    const { walletAction } = this.props;
    walletAction.updateCreateStep(1);
    // 重新走流程，需要出现安全提示
    walletAction.updateIsShowSafeTip(true);
  };

  render() {
    return (
      <Menu
        mode="horizontal"
        className="okdex-menu"
      >
        {/*
        <Menu.Item key="trade" >
          <NavLink exact to={PageURL.spotFullPage} activeClassName="active-menu-item" >
            {toLocale('header_menu_trade')}
          </NavLink>
        </Menu.Item>
        */}
        <Menu.Item key="createWallet">
          <Link to={getLangURL(`${PageURL.homePage}/wallet/create`)} >{toLocale('header_menu_create_wallet')}</Link>
          {/*
          <NavLink exact to="javascript:void(0);" onClick={this.RedirectToCreate} activeClassName="active-menu-item" >
            {toLocale('header_menu_create_wallet')}
          </NavLink> */}
        </Menu.Item>
        <Menu.Item key="importWallet" >
          <Link to={getLangURL(`${PageURL.homePage}/wallet/import`)} >{toLocale('header_menu_import_wallet')}</Link>
          {/*
          <NavLink exact to={PageURL.walletImport} onClick={this.RedirectToImport} activeClassName="active-menu-item" >
            {toLocale('header_menu_import_wallet')}
          </NavLink> */}
        </Menu.Item>
        {/*
        <Menu.Item key="okexChain" >
          <a target="_blank" rel="noopener noreferrer" href={Config.okexchain.browserUrl}>{toLocale('header_menu_explorer_okexchain')}</a>
        </Menu.Item>
        */}
      </Menu>
    );
  }
}

export default DexLoginMenu;
