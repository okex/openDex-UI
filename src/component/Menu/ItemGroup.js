import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemGroup as RcItemGroup } from 'rc-menu';

class ItemGroup extends Component {
  static propTypes = {
    /** 分组标题 */
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    /** 分组的菜单项 Array<MenuItem> */
    children: PropTypes.array,
  };
  static defaultProps = {
    title: '',
    children: [],
  };
  render() {
    return (
      <RcItemGroup
        {...this.props}
      />
    );
  }
}

export default ItemGroup;
