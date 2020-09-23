import React, { Component } from 'react';
import { Dialog } from '_component/Dialog';
import './index.less';

class SingleInputDialog extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const { visible, title, value, onChange, onClose, onConfirm } = this.props;

    return (
      <div className="sid-container">
        <Dialog
          className="base-dialog single-input-dialog"
          visible={visible}
          title={title}
          onClose={onClose}
        >
          <div className="sid-main">
            <input className="sid-input" value={value} onChange={onChange} />
          </div>
          <div className="sid-confirm">
            <button className="sid-confirm-btn" onClick={onConfirm}>
              OK
            </button>
          </div>
        </Dialog>
      </div>
    );
  }
}

export default SingleInputDialog;
