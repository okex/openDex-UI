import React from 'react';
import { toLocale } from '_src/locale/react-locale';

export default class SwapSetting extends React.Component {

  render() {
    return (
      <div className="swap-setting-container">
        <i className="iconfont iconmenu-administration" />
        <div className="panel-swap-setting">
            <div className="swap-setting-header">{toLocale('Advanced setting')}</div>
            <div className="swap-setting-content">
              <div className="space-between">
                <div className="left">{toLocale('Set slippage tolerance')}</div>
                <div className="right"><i className="help" /></div>
              </div>
              <div className="space-between check-btns">
                <div className="left">
                  <div className="check-btn-wrap">
                    <div className="check-btn-item">0.1%</div>
                    <div className="check-btn-item active">0.5%</div>
                    <div className="check-btn-item">1%</div>
                  </div>
                </div>
                <div className="right">
                  <div className="check-btn-input">
                    <div className="input">
                      <input type="text" />
                    </div>
                    <i>%</i>
                  </div>
                </div>
              </div>
              <div className="error-tip">*{toLocale('Your transaction may fail')}</div>
              <div className="space-between deadline">
                <div className="left">{toLocale('Transaction deadline')}</div>
                <div className="right"><i className="help" /></div>
              </div>
              <div className="deadline-input">
                <div className="input">
                  <input type="text" />
                </div>
                <i>{toLocale('Minutes')}</i>
              </div>
              <div className="setting-btn">{toLocale('Confirm')}</div>
            </div>
          </div>
      </div>
    );
  }
}