
import React from 'react';
import { toLocale } from '_src/locale/react-locale'
export default class LiquidityInfoTip extends React.Component {

  render() {
    return (
      <div className="stake-panel">
        <div className="stake-panel-title">{toLocale('Claim details')}<span className="close" onClick={onClose}>×</span></div>
        <div className="stake-panel-content">
          <div className="infotip">
            {toLocale('You didn’t have any LP tokens')}
          </div>
        </div>
        <div className="stake-panel-footer nomargin">
          <div className="btn cancel" onClick={onClose}>{toLocale('cancel')}</div>
          <div className="btn" onClick={this.confirm}>{toLocale('Add Liquidity')}</div>
        </div>
      </div>
      );
  }
}