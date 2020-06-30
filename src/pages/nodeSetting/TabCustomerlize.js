import React, { Component } from 'react';
import NodeItem from './NodeItem';
import './TabCustomerlize.less';

class TabCustomerlize extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    return (
      <div className="node-customerlize-container">
        <NodeItem
          name="Eastern Asia - China - Hangzhou"
          ws="wss://ws.gdex.top"
          http="https://www.oklink.com/okchain/v1"
          delayType={NodeItem.NODE_TYPE.LOW}
          delayTime="119.84ms"
        />
      </div>
    );
  }
}

export default TabCustomerlize;
