import React from 'react';
import Menu from '_src/component/Menu';
import Config from '_constants/Config';
import { toLocale } from '_src/locale/react-locale';
import IconFountUnfold from './IconFountUnfold';
const SubMenu = Menu.SubMenu;

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
      </SubMenu>
    </Menu>
  );
};

export default DocMenu;
