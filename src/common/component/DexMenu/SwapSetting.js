import React from 'react';
import Menu from '_src/component/Menu';
import './index.less';

export default class SwapSetting extends React.Component {

  render() {
    return (
      <Menu mode="horizontal" className="okdex-menu">
        <Menu.Item key="swapSetting">
          <i className="iconfont iconmenu-administration"></i>
        </Menu.Item>
      </Menu>
    );
  }

}