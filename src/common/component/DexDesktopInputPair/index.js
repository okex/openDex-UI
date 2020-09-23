import React, { Component } from 'react';
import './index.less';

class DexDesktopInputPair extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      label,
      firstValue,
      secondValue,
      onFirstChange,
      onSecondChange,
    } = this.props;

    return (
      <div className="dex-desktop-input-pair-container">
        <label className="input-pair-label" htmlFor="">
          {label}
        </label>
        <div className="dex-desktop-input-pair-main">
          <input
            type="text"
            className="input-pair-input"
            value={firstValue}
            onChange={onFirstChange}
          />
          <div className="input-pair-separator">/</div>
          <input
            type="text"
            className="input-pair-input"
            value={secondValue}
            onChange={onSecondChange}
          />
        </div>
      </div>
    );
  }
}

export default DexDesktopInputPair;
