import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SubMenu as RcSubMenu } from 'rc-menu';

class SubMenu extends Component {
  static propTypes = {
    /** 唯一标志 */
    // key: PropTypes.string,
    /** 子菜单标题 */
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 点击子菜单标题 function({ key, domEvent }) */
    onTitleClick: PropTypes.func,
    /** 子菜单的菜单项 Array<MenuItem|SubMenu> */
    children: PropTypes.array,
  };
  static defaultProps = {
    // key: '',
    title: '',
    onTitleClick: () => {},
    children: [],
  };
  render() {
    return (
      <RcSubMenu
        {...this.props}
      />
    );
  }
}

export default SubMenu;
