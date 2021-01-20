import React from 'react';
import moment from 'moment';
import { toLocale } from '_src/locale/react-locale';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { crypto } from '@okexchain/javascript-sdk';
import { Dialog } from '_component/Dialog';
import Menu from '_src/component/Menu';
import util from '_src/utils/util';
import IconFountUnfold from './IconFountUnfold';
import { withRouter, NavLink } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import PassWordDialog from '_component/PasswordDialog';
import * as CommonAction from '../../redux/actions/CommonAction';
import WalletMenuTool from './WalletMenuTool';
import DocMenu from './DocMenu';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import env from '../../constants/env';

import './index.less';

const SubMenu = Menu.SubMenu;

function mapStateToProps(state) {
  const { privateKey } = state.Common;
  return {
    privateKey,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    commonAction: bindActionCreators(CommonAction, dispatch),
  };
}

@withRouter
@connect(mapStateToProps, mapDispatchToProps)
class DexLoggedMenu extends React.Component {
  state = {
    isShowPassword: false,
    passwordError: '',
  };
  handleDownKeyStore = () => {
    this.setState({
      isShowPassword: true,
      passwordError: '',
    });
  };
  downKeyStoreCore = (passValue) => {
    if (!util.isLogined()) {
      window.location.reload();
    }

    const keyStoreName = `keystore_${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    const User = window.localStorage.getItem(env.envConfig.dexUser);
    if (User) {
      try {
        const UserObj = JSON.parse(User);
        const { info: keyStore } = UserObj;
        const privateKey = crypto.getPrivateKeyFromKeyStore(
          keyStore,
          passValue
        );
        if (privateKey) {
          util.downloadObjectAsJson(keyStore || '', `${keyStoreName}.txt`);
          this.setState({ isShowPassword: false, passwordError: '' });
        }
      } catch (e) {
        this.setState({
          isShowPassword: true,
          passwordError: toLocale('pwd_error'),
        });
      }
    }
  };
  handleClosePassWordDialog = () => {
    this.setState({
      isShowPassword: false,
    });
  };

  isDexMenu() {
    const current = DesktopTypeMenu.current
      ? DesktopTypeMenu.current.url
      : null;
    return current === PageURL.spotFullPage;
  }

  handleLogOut = () => {
    const dialog = Dialog.confirm({
      title: toLocale('header_menu_logout1'),
      confirmText: toLocale('ensure'),
      cancelText: toLocale('cancel'),
      theme: 'dark',
      dialogId: 'okdex-logout',
      windowStyle: {
        background: '#112F62',
      },
      onConfirm: () => {
        util.doLogout();
        dialog.destroy();
        window.location.reload();
      },
    });
  };
  render() {
    const { hasDoc, href } = this.props;
    const { isShowPassword, passwordError } = this.state;
    let addr = '';
    try {
      const user = JSON.parse(window.localStorage.getItem(env.envConfig.dexUser));
      addr = user ? user.addr : '';
    } catch (e) {
      console.warn(e);
    }
    return (
      <React.Fragment>
        <PassWordDialog
          isShow={isShowPassword}
          onEnter={this.downKeyStoreCore}
          warning={passwordError}
          updateWarning={(err) => {
            this.setState({ passwordError: err });
          }}
          onClose={this.handleClosePassWordDialog}
        />
        <Menu mode="horizontal" selectable={false} className="okdex-menu">
          <SubMenu
            key="wallet"
            title={
              <React.Fragment>
                {toLocale('header_menu_wallet')}
                <IconFountUnfold />
              </React.Fragment>
            }
          >
            <Menu.Item
              key="wallet-1"
              style={{ height: 'auto', cursor: 'default' }}
            >
              <WalletMenuTool address={addr} />
            </Menu.Item>
            <Menu.Item key="wallet-2">
              {href ? 
                <a href={PageURL.walletAssets} target="_blank">{toLocale('header_menu_assets')}</a>:
                  <NavLink
                  to={PageURL.walletAssets}
                  activeClassName="active-menu-item"
                >
                  {toLocale('header_menu_assets')}
                </NavLink>  
              }
            </Menu.Item>
            <Menu.Item key="wallet-3" onClick={this.handleDownKeyStore}>
              {toLocale('header_menu_down_keystore')}
            </Menu.Item>
            <Menu.Item key="wallet-4" onClick={this.handleLogOut}>
              {toLocale('header_menu_logout')}
            </Menu.Item>
          </SubMenu>
          {this.isDexMenu() && 
            <SubMenu
            key="order"
            title={
              <React.Fragment>
                {toLocale('header_menu_order')}
                <IconFountUnfold />
              </React.Fragment>
            }
          >
            <Menu.Item key="order-1">
              <NavLink
                to={PageURL.spotOpenPage}
                activeClassName="active-menu-item"
              >
                {toLocale('header_menu_current_entrust')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="order-2">
              <NavLink
                to={PageURL.spotHistoryPage}
                activeClassName="active-menu-item"
              >
                {toLocale('header_menu_history_entrust')}
              </NavLink>
            </Menu.Item>
            <Menu.Item key="order-3">
              <NavLink
                to={PageURL.spotDealsPage}
                activeClassName="active-menu-item"
              >
                {toLocale('header_menu_deal_entrust')}
              </NavLink>
            </Menu.Item>
          </SubMenu>
          }
          {hasDoc && <DocMenu />}
        </Menu>
      </React.Fragment>
    );
  }
}

export default DexLoggedMenu;
