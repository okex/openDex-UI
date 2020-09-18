import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ItemGroup as RcItemGroup } from 'rc-menu';

class ItemGroup extends Component {
  static propTypes = {
    title: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
    children: PropTypes.array,
  };
  static defaultProps = {
    title: '',
    children: [],
  };
  render() {
    return <RcItemGroup {...this.props} />;
  }
}

export default ItemGroup;
