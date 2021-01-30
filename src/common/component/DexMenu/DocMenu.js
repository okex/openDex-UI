import React from 'react';
import Menu from '_src/component/Menu';
import Config from '_constants/Config';
import { toLocale } from '_src/locale/react-locale';
import IconFountUnfold from './IconFountUnfold';
import DesktopTypeMenu from '_component/DesktopTypeMenu';
import PageURL from '_src/constants/PageURL';
const SubMenu = Menu.SubMenu;

function isSwapMenu() {
  const current = DesktopTypeMenu.current ? DesktopTypeMenu.current.url : null;
  return current === PageURL.swapPage;
}

function isFarmMenu() {
  const current = DesktopTypeMenu.current ? DesktopTypeMenu.current.url : null;
  return current === PageURL.farmPage;
}

const DocMenu = () => {
  return (
    <Menu mode="horizontal" selectable={false} className="okdex-menu">
      <SubMenu
        key="help"
        title={
          <React.Fragment>
            {toLocale('header_menu_help')}
            <IconFountUnfold />
          </React.Fragment>
        }
      >
        <Menu.Item key="help-1">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={Config.okexchain.docUrl}
          >
            {toLocale('header_menu_instructions')}
          </a>
        </Menu.Item>
        <Menu.Item key="help-2">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href={Config.okexchain.receiveCoinUrl}
          >
            {toLocale('home_receive_coin')}
          </a>
        </Menu.Item>
        {isSwapMenu() && (
          <Menu.Item key="help-3">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={Config.okexchain.receiveSwapUrl}
            >
              {toLocale('home_receive_swap')}
            </a>
          </Menu.Item>
        )}
        {isFarmMenu() && (
          <Menu.Item key="help-4">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={Config.okexchain.receiveFarmUrl}
            >
              {toLocale('home_receive_farm')}
            </a>
          </Menu.Item>
        )}
      </SubMenu>
    </Menu>
  );
};

export default DocMenu;
