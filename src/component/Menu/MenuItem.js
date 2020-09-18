import React, { Component } from 'react';
import { Item } from 'rc-menu';

class MenuItem extends Component {
  render() {
    return <Item {...this.props} />;
  }
}

export default MenuItem;
