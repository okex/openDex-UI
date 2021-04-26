import React from 'react';
import moment from 'moment';
import { toLocale } from '_src/locale/react-locale';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { crypto, wallet } from '@okexchain/javascript-sdk';
import { Dialog } from '_component/Dialog';
import Menu from '_src/component/Menu';
import util from '_src/utils/util';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button } from '_component/Button';
import Icon from '_src/component/IconLite';
import { withRouter, NavLink } from 'react-router-dom';
import PageURL from '_constants/PageURL';
import PassWordDialog from '_component/PasswordDialog';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import down from '_src/assets/images/down.svg';
import up from '_src/assets/images/up.svg';
import * as CommonAction from '../../redux/actions/CommonAction';
import WalletMenuTool from './WalletMenuTool';
import DocMenu from './DocMenu';
import env from '../../constants/env';
import IconFountUnfold from './IconFountUnfold';

import './index.less';

const SubMenu = Menu.SubMenu;
const KEYSTORE = '1';
const PRIVATEKEY = '2';

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
    type: KEYSTORE,
    expanded: false,
  };

  handleDown = (type = KEYSTORE) => {
    this.setState({
      isShowPassword: true,
      passwordError: '',
      type,
    });
  };

  download = (passValue) => {
    if (this.state.processingPwd) return;
    const { type } = this.state;
    this.setState({ processingPwd: true });
    setTimeout(() => {
      if (type === KEYSTORE) this.downKeyStoreCore(passValue);
      else this.downPrivateKey(passValue);
      this.setState({ processingPwd: false });
    }, 20);
  };

  getPrivateKey = (passValue) => {
    let result = { privateKey: '', keyStore: null };
    const User = window.localStorage.getItem(env.envConfig.dexUser);
    if (User) {
      const UserObj = JSON.parse(User);
      const { info: keyStore } = UserObj;
      result.keyStore = keyStore;
      result.privateKey = crypto.getPrivateKeyFromKeyStore(keyStore, passValue);
    }
    return result;
  };

  downKeyStoreCore = (passValue) => {
    if (!util.isLogined()) {
      window.location.reload();
      return;
    }
    const keyStoreName = `keystore_${moment().format('YYYY-MM-DD HH:mm:ss')}`;
    try {
      const { privateKey, keyStore } = this.getPrivateKey(passValue);
      if (privateKey) {
        util.downloadObjectAsJson(keyStore || '', `${keyStoreName}.txt`);
        this.setState({ isShowPassword: false, passwordError: '' });
      }
    } catch (e) {
      this.setState({
        isShowPassword: true,
        processingPwd: false,
        passwordError: toLocale('pwd_error'),
      });
    }
  };

  downPrivateKey = (passValue) => {
    if (!util.isLogined()) {
      window.location.reload();
      return;
    }
    try {
      const { privateKey } = this.getPrivateKey(passValue);
      if (privateKey) {
        this.setState({ isShowPassword: false, passwordError: '' });
        this.showPrivate(privateKey);
      }
    } catch (e) {
      this.setState({
        isShowPassword: true,
        passwordError: toLocale('pwd_error'),
      });
    }
  };

  handleClosePassWordDialog = () => {
    this.setState({
      isShowPassword: false,
    });
  };

  showPrivate = (privateKey) => {
    this.showPrivate.privateKey = privateKey;
    this.privateDialog = Dialog.show({
      windowStyle: { backgroundColor: '#112F62' },
      children: this.renderPrivateDialog(),
    });
  };

  hidePrivate = () => {
    this.showPrivate.privateKey = void 0;
    this.privateDialog.destroy();
  };

  handleCopy = () => {
    this.privateDialog.update({
      children: this.renderPrivateDialog(true),
    });
    clearTimeout(this.copyTimer);
    this.copyTimer = setTimeout(() => {
      this.privateDialog.update({
        children: this.renderPrivateDialog(false),
      });
    }, 1000);
  };

  renderPrivateDialog = (copySuccess = false) => {
    const privateKey = this.showPrivate.privateKey;
    return (
      <div className="private-container">
        <div className="private-title">{toLocale('wallet_privateKey')}</div>
        <Icon
          className="icon-icon_successfuzhi"
          isColor
          style={{ width: 60, height: 60, marginBottom: 30 }}
        />
        <div className="private-content">
          <span id="okdex-wallet-private-key">{privateKey}</span>
          <span data-clipboard-target="#okdex-wallet-private-key">
            <CopyToClipboard text={privateKey} onCopy={this.handleCopy}>
              <Icon
                className={copySuccess ? 'icon-icon_success' : 'icon-icon_copy'}
                isColor
                style={{ width: 14, height: 14, cursor: 'pointer' }}
              />
            </CopyToClipboard>
          </span>
        </div>
        <Button type="primary" onClick={this.hidePrivate}>
          {toLocale('wallet_ensure')}
        </Button>
      </div>
    );
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
        dialog.destroy();
        window.localStorage.removeItem(env.envConfig.mnemonicPathType);
        if (util.isWalletConnect()) {
          wallet.killSession(() => {
            util.doLogout();
            window.location.reload();
          });
        } else {
          util.doLogout();
          window.location.reload();
        }
      },
    });
  };

  setExpanded = () => {
    const { expanded } = this.state;
    this.setState({ expanded: !expanded });
  };

  render() {
    const { hasDoc, href } = this.props;
    const {
      isShowPassword,
      passwordError,
      processingPwd,
      expanded,
    } = this.state;
    let addr = window.OK_GLOBAL.senderAddr;
    let generalAddr = window.OK_GLOBAL.generalAddr;

    return (
      <>
        <PassWordDialog
          isShow={isShowPassword}
          onEnter={this.download}
          warning={passwordError}
          btnLoading={processingPwd}
          updateWarning={(err) => {
            this.setState({ passwordError: err });
          }}
          onClose={this.handleClosePassWordDialog}
        />
        <Menu mode="horizontal" selectable={false} className="okdex-menu">
          <SubMenu
            key="wallet"
            title={
              <>
                {toLocale('header_menu_wallet')}
                <IconFountUnfold />
              </>
            }
          >
            <Menu.Item
              key="wallet-1"
              style={{ height: 'auto', cursor: 'default' }}
            >
              <WalletMenuTool
                address={generalAddr}
                addressType="default"
                addressLabel={toLocale('header_menu_item_address')}
              />
            </Menu.Item>
            <Menu.Item
              key="wallet-11"
              style={{
                height: 'auto',
                cursor: 'default',
                display: expanded ? '' : 'none',
              }}
            >
              <WalletMenuTool address={addr} addressType="okexchain" addressLabel={toLocale('assets_address_OKExChain')} />
            </Menu.Item>
            <Menu.Item style={{ height: 20, lineHeight: '20px' }}>
              <span
                onClick={this.setExpanded}
                className="address-expanded discription"
              >
                {toLocale(
                  expanded ? 'dex_address_packup' : 'dex_address_expanded'
                )}
                <img src={expanded ? up : down} alt="" />
              </span>
              {/* <a className="discription" href="javascript:;">{toLocale('dex_address_double')}</a> */}
            </Menu.Item>
            <Menu.Item key="wallet-2">
              {href && util.hasKeyStore() ? (
                <a href={PageURL.walletAssets} target="_blank">
                  {toLocale('header_menu_assets')}
                </a>
              ) : (
                <NavLink
                  to={PageURL.walletAssets}
                  activeClassName="active-menu-item"
                >
                  {toLocale('header_menu_assets')}
                </NavLink>
              )}
            </Menu.Item>
            {util.hasKeyStore() && (
              <Menu.Item
                key="wallet-3"
                onClick={() => this.handleDown(KEYSTORE)}
              >
                {toLocale('header_menu_down_keystore')}
              </Menu.Item>
            )}
            {util.hasKeyStore() && (
              <Menu.Item
                key="wallet-5"
                onClick={() => this.handleDown(PRIVATEKEY)}
              >
                {toLocale('header_menu_down_privatekey')}
              </Menu.Item>
            )}
            <Menu.Item key="wallet-4" onClick={this.handleLogOut}>
              {toLocale('header_menu_logout')}
            </Menu.Item>
          </SubMenu>
          {this.isDexMenu() && (
            <SubMenu
              key="order"
              title={
                <>
                  {toLocale('header_menu_order')}
                  <IconFountUnfold />
                </>
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
          )}
          {hasDoc && <DocMenu />}
        </Menu>
      </>
    );
  }
}

export default DexLoggedMenu;
