import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import { Item } from 'rc-menu';

class MenuItem extends Component {
  // static propTypes = {
  //   /** item 的唯一标志 */
  //   key: PropTypes.object,
  // };
  // static defaultProps = {
  //   key: '',
  // };
  render() {
    return (
      <Item {...this.props} />
    );
  }
}

export default MenuItem;
