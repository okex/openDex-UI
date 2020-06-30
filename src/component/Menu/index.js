import React from 'react';
import PropTypes from 'prop-types';
import RcMenu, { Divider } from 'rc-menu';
import SubMenu from './SubMenu';
import Item from './MenuItem';
import ItemGroup from './ItemGroup';

import './index.less';


export default class Menu extends React.Component {
  static Divider = Divider;
  static Item = Item;
  static SubMenu = SubMenu;
  static ItemGroup = ItemGroup;
  static propTypes = {
    /** 菜单类型，包括垂直('vertical', 'vertical-left', 'vertical-right')、水平(horizontal)、和内嵌(inline)模式三种 */
    mode: PropTypes.oneOf(['horizontal', 'vertical', 'vertical-left', 'vertical-right', 'inline']),
    /** 根节点样式 */
    style: PropTypes.object,
    /** 根节点class */
    className: PropTypes.string,
    /** 是否允许选中 */
    selectable: PropTypes.bool,
    /** 点击 menu item 调用此函数 function({ item, key, keyPath }) */
    onClick: PropTypes.func,
    /** 选中时调用 */
    onSelect: PropTypes.func,
    /** sub menu 展开/关闭的回调 */
    onOpenChange: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    style: {},
    mode: 'vertical',
    selectable: true,
    onClick: () => {},
    onSelect: () => {},
    onOpenChange: () => {},
  };
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const fixedProps = {
      prefixCls: 'ok-menu',
      multiple: false,
    };
    return <RcMenu {...this.props} {...fixedProps} />;
  }
}
