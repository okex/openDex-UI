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
    mode: PropTypes.oneOf([
      'horizontal',
      'vertical',
      'vertical-left',
      'vertical-right',
      'inline',
    ]),
    style: PropTypes.object,
    className: PropTypes.string,
    selectable: PropTypes.bool,
    onClick: PropTypes.func,
    onSelect: PropTypes.func,
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
