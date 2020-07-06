import React, { Component } from 'react';
import { Dialog } from '_component/Dialog';
import iconNodeAdd from '_src/assets/images/icon_node_add.png';
import NodeItem from './NodeItem';
import './TabCustomerlize.less';

class TabCustomerlize extends Component {
  constructor() {
    super();
    this.state = {
      isDialogShow: false,
    };
  }

  onDelete = () => {
    console.log('delete customerlize node');
  }

  showDialog = () => {
    this.setState({ isDialogShow: true });
  }

  closeDialog = () => {
    this.setState({ isDialogShow: false });
  }

  render() {
    const { isDialogShow } = this.state;
    return (
      <div className="node-customerlize-container">
        <div className="customerlize-add" onClick={this.showDialog}>
          <div className="add-text">ADD NODE</div>
          <div className="add-action">
            <img width="100%" src={iconNodeAdd} alt="pool" />
          </div>
        </div>
        <Dialog
          theme="base-dialog pwd-dialog"
          visible={isDialogShow}
          onClose={this.closeDialog}
        />
        <NodeItem
          name="Eastern Asia - China - Hangzhou"
          ws="wss://ws.gdex.top"
          http="https://www.oklink.com/okchain/v1"
          delayType={NodeItem.NODE_TYPE.LOW}
          delayTime={119.84}
          isRenderDelete
          onDelete={this.onDelete}
        />
      </div>
    );
  }
}

export default TabCustomerlize;
