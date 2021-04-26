import React, { Component } from 'react';
import { toLocale } from '_src/locale/react-locale';
import { withRouter } from 'react-router-dom';
import Icon from '_component/IconLite';
import PageURL from '_constants/PageURL';
import config from '../../../../package.json';
import './index.less';

@withRouter
class DesktopLinkMenu extends Component {
  constructor() {
    super();
    this.state = {
      isMenuShow: false,
    };
  }

  showMenu = () => {
    this.setState({ isMenuShow: true });
  };

  hideMenu = () => {
    this.setState({ isMenuShow: false });
  };

  toRoute = (route) => () => {
    this.props.history.push(route);
    this.hideMenu();
  };

  render() {
    const { hasVersion = true } = this.props;
    const { isMenuShow } = this.state;
    const { version } = config;
    return (
      <div
        className="desktop-setting-container"
        onMouseEnter={this.showMenu}
        onMouseLeave={this.hideMenu}
      >
        <Icon className="icon-icon_hambergur" />
        <div
          className="desktop-link-menu-wrapper"
          style={{ display: isMenuShow ? 'block' : 'none' }}
        >
          <div className="desktop-link-menu-conntainer">
            <div className="link-menu-item-container">
              <div
                className="link-menu-item"
                onClick={this.toRoute(PageURL.dashboardPage)}
              >
                {toLocale('linkMenu.Dashboard')}
              </div>
            </div>
            <div className="link-menu-item-container link-token-container">
              <div className="link-menu-item">
                {toLocale('linkMenu.Token')}
                <Icon className="icon-retract" />
                <div className="link-sub-menu">
                  <div
                    className="link-submenu-item"
                    onClick={this.toRoute(PageURL.issueTokenPage)}
                  >
                    {toLocale('linkMenu.issue')}
                  </div>
                  <div
                    className="link-submenu-item"
                    onClick={this.toRoute(PageURL.issueDetailPage)}
                  >
                    {toLocale('linkMenu.mintBurn')}
                  </div>
                </div>
              </div>
            </div>
            <div className="link-menu-item-container link-operator-container">
              <div className="link-menu-item">
                {toLocale('linkMenu.operator')}
                <Icon className="icon-retract" />
                <div className="link-sub-menu">
                  <div
                    className="link-submenu-item"
                    onClick={this.toRoute(PageURL.registerPage)}
                  >
                    {toLocale('linkMenu.register')}
                  </div>
                  <div
                    className="link-submenu-item"
                    onClick={this.toRoute(PageURL.listTokenpairPage)}
                  >
                    {toLocale('linkMenu.tokenPair')}
                  </div>
                  <div
                    className="link-submenu-item"
                    onClick={this.toRoute(PageURL.tokenpairDetailPage)}
                  >
                    {toLocale('linkMenu.deposits')}
                  </div>
                  <div
                    className="link-submenu-item"
                    onClick={this.toRoute(PageURL.feesPage)}
                  >
                    {toLocale('linkMenu.handlingFee')}
                  </div>
                </div>
              </div>
            </div>
            {hasVersion && (
              <div className="link-menu-item-container">
                <div className="link-menu-version">
                  {toLocale('linkMenu.version')}
                </div>
                <div className="link-menu-version-detail">
                  OPENDEX {version}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

export default DesktopLinkMenu;
