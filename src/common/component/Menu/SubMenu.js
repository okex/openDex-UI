import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { SubMenu as RcSubMenu } from 'rc-menu';

class SubMenu extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    onTitleClick: PropTypes.func,
    children: PropTypes.array,
  };

  static defaultProps = {
    title: '',
    onTitleClick: () => {},
    children: [],
  };

  render() {
    return <RcSubMenu {...this.props} />;
  }
}

export default SubMenu;
