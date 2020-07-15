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
      valueName: '',
      valueWs: '',
      valueHttp: '',
    };
  }

  onDelete = () => {
    console.log('delete customerlize node');
  }

  onValueNameChange = (e) => {
    this.setState({ valueName: e.target.value });
  }

  onValueWsChange = (e) => {
    this.setState({ valueWs: e.target.value });
  }

  onValueHttpChange = (e) => {
    this.setState({ valueHttp: e.target.value });
  }

  onCancel = () => {
    this.closeDialog();
    this.clearInputValues();
  }

  onConfirm = () => {
    const { valueName, valueWs, valueHttp } = this.state;
    console.log(valueName);
    console.log(valueWs);
    console.log(valueHttp);
    this.closeDialog();
    this.clearInputValues();
  }

  showDialog = () => {
    this.setState({ isDialogShow: true });
  }

  closeDialog = () => {
    this.setState({ isDialogShow: false });
  }

  clearInputValues = () => {
    this.setState({
      valueName: '',
      valueWs: '',
      valueHttp: '',
    });
  }

  render() {
    const {
      isDialogShow, valueName, valueWs, valueHttp
    } = this.state;
    return (
      <div className="node-customerlize-container">
        <div className="customerlize-add" onClick={this.showDialog}>
          <div className="add-text">ADD NODE</div>
          <div className="add-action">
            <img width="100%" src={iconNodeAdd} alt="pool" />
          </div>
        </div>
        <Dialog
          theme="base-dialog customerlize-dialog"
          visible={isDialogShow}
          onClose={this.closeDialog}
          title="Add Node"
        >
          <div className="cd-main">
            <div className="cd-input-container">
              <label className="cd-label">Name</label>
              <input className="cd-input" type="text" value={valueName} onChange={this.onValueNameChange} />
            </div>
            <div className="cd-input-container">
              <label className="cd-label">WS</label>
              <input className="cd-input" type="text" value={valueWs} onChange={this.onValueWsChange} />
            </div>
            <div className="cd-input-container">
              <label className="cd-label">RPC</label>
              <input className="cd-input" type="text" value={valueHttp} onChange={this.onValueHttpChange} />
            </div>
          </div>
          <div className="cd-btn-container">
            <div className="cd-btn cd-btn-cancel">Cancel</div>
            <div className="cd-btn cd-btn-confirm" onClick={this.onConfirm}>Confirm</div>
          </div>
        </Dialog>
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
