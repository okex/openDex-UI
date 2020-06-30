import React, { Component } from 'react';
import Icon from '_src/component/IconLite';
import './index.less';

class DexDesktopInput extends Component {
  constructor() {
    super();
    this.state = {};
  }

  render() {
    const {
      value, onChange, hint, label, multiple
    } = this.props;
    return (
      <div className="dex-desktop-input-container">
        <div className="desktop-input-title-row">
          <label className="desktop-input-label" htmlFor="">{label}</label>
          {
            hint && (
              <div className="desktop-input-icon">
                <Icon className="icon-system_doubt" />
                <div className="desktop-input-hint">{hint}</div>
              </div>
            )
          }
        </div>
        {
          multiple ? (
            <textarea
              className="desktop-input"
              value={value}
              onChange={onChange}
              rows="2"
            />
          ) : (
            <input
              className="desktop-input"
              value={value}
              onChange={onChange}
            />
          )
        }
      </div>
    );
  }
}

export default DexDesktopInput;
